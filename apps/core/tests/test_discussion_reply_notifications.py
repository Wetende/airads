from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from apps.core.tests.factories import UserFactory
from apps.discussions.models import DiscussionPost, DiscussionThread
from apps.notifications.models import Notification
from apps.progression.models import InstructorAssignment
from apps.progression.tests.factories import CurriculumNodeFactory, ProgramFactory


class InstructorDiscussionReplyNotificationTests(TestCase):
    def test_instructor_reply_notifies_student_thread_owner(self):
        instructor = UserFactory()
        student = UserFactory()
        group, _ = Group.objects.get_or_create(name="Instructors")
        instructor.groups.add(group)

        program = ProgramFactory(is_published=True)
        node = CurriculumNodeFactory(program=program, is_published=True)
        InstructorAssignment.objects.create(instructor=instructor, program=program)

        thread = DiscussionThread.objects.create(
            node=node,
            user=student,
            title="Question",
            content="Need help",
        )

        self.client.force_login(instructor)
        response = self.client.post(
            reverse("core:instructor.discussion_reply"),
            data={"thread": thread.pk, "content": "Instructor response"},
            HTTP_REFERER=f"/instructor/programs/{program.id}/manage/",
        )

        self.assertEqual(response.status_code, 302)
        post = DiscussionPost.objects.get(thread=thread)
        self.assertEqual(post.user, instructor)

        notification = Notification.objects.get(
            recipient=student,
            notification_type="discussion_reply",
        )
        self.assertIn(node.title, notification.message)
