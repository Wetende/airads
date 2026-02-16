from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from apps.core.models import Program
from apps.core.tests.factories import UserFactory
from apps.progression.models import Enrollment, InstructorAssignment


class GradebookBridgeTests(TestCase):
    def setUp(self):
        self.instructor = UserFactory()
        group, _ = Group.objects.get_or_create(name="Instructors")
        self.instructor.groups.add(group)

        self.program = Program.objects.create(
            name="Bridge Program",
            code="BRIDGE-001",
            level="beginner",
            is_published=True,
        )
        InstructorAssignment.objects.create(
            instructor=self.instructor,
            program=self.program,
        )

        self.student = UserFactory()
        self.enrollment = Enrollment.objects.create(
            user=self.student,
            program=self.program,
            status="active",
        )

    def test_global_gradebook_redirects_to_program_gradebook(self):
        self.client.force_login(self.instructor)
        response = self.client.get(reverse("core:instructor.gradebook"))

        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response["Location"],
            f"/instructor/programs/{self.program.pk}/gradebook/",
        )

    def test_global_gradebook_honors_program_query_param(self):
        self.client.force_login(self.instructor)
        response = self.client.get(
            f"{reverse('core:instructor.gradebook')}?program={self.program.pk}"
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response["Location"],
            f"/instructor/programs/{self.program.pk}/gradebook/",
        )

    def test_grade_entry_redirects_to_progression_student_view(self):
        self.client.force_login(self.instructor)
        response = self.client.get(
            reverse(
                "core:instructor.grade_entry",
                kwargs={"enrollment_id": self.enrollment.pk},
            )
        )

        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response["Location"],
            (
                f"/instructor/programs/{self.program.pk}/gradebook/student/"
                f"{self.enrollment.pk}/"
            ),
        )
