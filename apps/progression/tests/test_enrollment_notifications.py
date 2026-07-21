from django.core import mail
from django.test import TestCase
from django.urls import reverse

from apps.core.models import Program
from apps.notifications.models import Notification
from apps.platform.models import PlatformSettings
from apps.progression.models import Enrollment, EnrollmentRequest, InstructorAssignment
from apps.core.tests.factories import UserFactory


class EnrollmentNotificationFlowTests(TestCase):
    def _create_program(self, code_suffix):
        return Program.objects.create(
            name=f"Program {code_suffix}",
            code=f"PROG-NOTIF-{code_suffix}",
            level="beginner",
            is_published=True,
        )

    def test_open_mode_enrollment_sends_in_app_and_email(self):
        student = UserFactory()
        program = self._create_program("OPEN")
        platform_settings = PlatformSettings.get_settings()
        platform_settings.features = {"enrollment_mode": "open"}
        platform_settings.save()

        self.client.force_login(student)
        response = self.client.post(
            reverse("core:program_interest_submit", kwargs={"pk": program.id}),
            data={
                "fullName": student.get_full_name() or "Open Student",
                "email": student.email,
                "phone": "+254700000002",
            },
        )

        self.assertEqual(response.status_code, 302)
        enrollment = Enrollment.objects.get(user=student, program=program)
        notification = Notification.objects.get(
            recipient=student,
            related_enrollment_id=enrollment.id,
        )
        self.assertEqual(notification.notification_type, "system")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(student.email, mail.outbox[0].to)

    def test_program_detail_approval_mode_creates_one_pending_request(self):
        instructor = UserFactory()
        student = UserFactory()
        program = self._create_program("REQUEST")
        InstructorAssignment.objects.create(instructor=instructor, program=program)
        platform_settings = PlatformSettings.get_settings()
        platform_settings.features = {"enrollment_mode": "instructor_approval"}
        platform_settings.save()

        self.client.force_login(student)
        submit_url = reverse("core:program_interest_submit", kwargs={"pk": program.id})
        form_data = {
            "fullName": student.get_full_name() or "Request Student",
            "email": student.email,
            "phone": "+254700000003",
            "message": "I would like to join.",
        }

        first_response = self.client.post(submit_url, data=form_data)
        second_response = self.client.post(submit_url, data=form_data)

        self.assertEqual(first_response.status_code, 302)
        self.assertEqual(second_response.status_code, 302)
        self.assertFalse(Enrollment.objects.filter(user=student, program=program).exists())
        enrollment_request = EnrollmentRequest.objects.get(user=student, program=program)
        self.assertEqual(enrollment_request.status, "pending")
        self.assertEqual(enrollment_request.message, "I would like to join.")

    def test_approved_request_sends_in_app_and_email(self):
        instructor = UserFactory()
        student = UserFactory()
        program = self._create_program("APPROVE")
        InstructorAssignment.objects.create(instructor=instructor, program=program)
        enrollment_request = EnrollmentRequest.objects.create(
            user=student,
            program=program,
            status="pending",
        )

        self.client.force_login(instructor)
        response = self.client.post(
            reverse(
                "progression:instructor.enrollment_request.approve",
                kwargs={"pk": program.id, "request_id": enrollment_request.id},
            ),
        )

        self.assertEqual(response.status_code, 302)
        enrollment = Enrollment.objects.get(user=student, program=program)
        enrollment_request.refresh_from_db()
        self.assertEqual(enrollment_request.status, "approved")
        notification = Notification.objects.get(
            recipient=student,
            related_enrollment_id=enrollment.id,
        )
        self.assertEqual(notification.notification_type, "enrollment_approved")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(student.email, mail.outbox[0].to)

    def test_admin_enrollment_create_sends_in_app_and_email(self):
        admin = UserFactory(admin=True)
        student = UserFactory()
        program = self._create_program("ADMIN")

        self.client.force_login(admin)
        response = self.client.post(
            reverse("progression:admin.enrollment.create"),
            data={
                "userId": student.id,
                "programId": program.id,
            },
        )

        self.assertEqual(response.status_code, 302)
        enrollment = Enrollment.objects.get(user=student, program=program)
        notification = Notification.objects.get(
            recipient=student,
            related_enrollment_id=enrollment.id,
        )
        self.assertEqual(notification.notification_type, "enrollment_confirmed")
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(student.email, mail.outbox[0].to)

    def test_admin_enrollment_create_approves_matching_pending_request(self):
        admin = UserFactory(admin=True)
        student = UserFactory()
        program = self._create_program("ADMIN-PENDING")
        enrollment_request = EnrollmentRequest.objects.create(
            user=student,
            program=program,
            status="pending",
        )

        self.client.force_login(admin)
        response = self.client.post(
            reverse("progression:admin.enrollment.create"),
            data={
                "userId": student.id,
                "programId": program.id,
            },
        )

        self.assertEqual(response.status_code, 302)
        enrollment_request.refresh_from_db()
        self.assertEqual(enrollment_request.status, "approved")
        self.assertEqual(enrollment_request.reviewed_by, admin)
        self.assertIsNotNone(enrollment_request.reviewed_at)

    def test_admin_enrollment_create_does_not_change_rejected_request(self):
        admin = UserFactory(admin=True)
        student = UserFactory()
        program = self._create_program("ADMIN-REJECTED")
        enrollment_request = EnrollmentRequest.objects.create(
            user=student,
            program=program,
            status="rejected",
        )

        self.client.force_login(admin)
        response = self.client.post(
            reverse("progression:admin.enrollment.create"),
            data={
                "userId": student.id,
                "programId": program.id,
            },
        )

        self.assertEqual(response.status_code, 302)
        enrollment_request.refresh_from_db()
        self.assertEqual(enrollment_request.status, "rejected")
        self.assertIsNone(enrollment_request.reviewed_by)
