from django.core import mail
from django.test import TestCase
from django.urls import reverse

from apps.core.tests.factories import UserFactory
from apps.discussions.models import DiscussionPost, DiscussionThread
from apps.notifications.models import Notification
from apps.progression.models import Enrollment, InstructorAssignment
from apps.progression.tests.factories import CurriculumNodeFactory, ProgramFactory


class DiscussionNotificationFlowTests(TestCase):
    def test_student_comment_notifies_instructor(self):
        instructor = UserFactory()
        student = UserFactory()
        program = ProgramFactory(is_published=True)
        node = CurriculumNodeFactory(program=program, is_published=True)

        program.instructors.add(instructor)
        InstructorAssignment.objects.create(instructor=instructor, program=program)
        Enrollment.objects.create(user=student, program=program, status="active")

        self.client.force_login(student)
        response = self.client.post(
            reverse(
                "progression:student.session.discussion",
                kwargs={"pk": Enrollment.objects.get(user=student, program=program).pk, "node_id": node.pk},
            ),
            data={"content": "Please help with this lesson"},
        )

        self.assertEqual(response.status_code, 302)
        thread = DiscussionThread.objects.get(node=node)
        self.assertEqual(thread.user, student)

        notification = Notification.objects.get(
            recipient=instructor,
            notification_type="discussion_comment",
        )
        self.assertIn(node.title, notification.message)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(instructor.email, mail.outbox[0].to)

    def test_student_reply_notifies_thread_owner(self):
        owner = UserFactory()
        replier = UserFactory()
        program = ProgramFactory(is_published=True)
        node = CurriculumNodeFactory(program=program, is_published=True)

        owner_enrollment = Enrollment.objects.create(
            user=owner,
            program=program,
            status="active",
        )
        replier_enrollment = Enrollment.objects.create(
            user=replier,
            program=program,
            status="active",
        )

        thread = DiscussionThread.objects.create(
            node=node,
            user=owner,
            title="",
            content="Original question",
        )

        self.client.force_login(replier)
        response = self.client.post(
            reverse(
                "progression:student.session.discussion",
                kwargs={"pk": replier_enrollment.pk, "node_id": node.pk},
            ),
            data={"thread_id": thread.pk, "content": "Here is a reply"},
        )

        self.assertEqual(response.status_code, 302)
        post = DiscussionPost.objects.get(thread=thread)
        self.assertEqual(post.user, replier)

        notification = Notification.objects.get(
            recipient=owner,
            notification_type="discussion_reply",
        )
        self.assertIn(node.title, notification.message)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(owner.email, mail.outbox[0].to)

        # Ensure action URL points to owner's enrollment session.
        self.assertEqual(
            notification.action_url,
            f"/student/programs/{owner_enrollment.pk}/session/{node.pk}/",
        )
