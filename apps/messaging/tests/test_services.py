from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.test import TestCase

from apps.core.models import Program
from apps.messaging.models import DirectMessage
from apps.messaging.services import MessagingService
from apps.notifications.models import Notification
from apps.progression.models import Enrollment, InstructorAssignment

User = get_user_model()


class MessagingServiceTests(TestCase):
    def setUp(self):
        self.student = User.objects.create_user(
            username='student',
            email='student@example.com',
            password='testpass123',
        )
        self.instructor = User.objects.create_user(
            username='instructor',
            email='instructor@example.com',
            password='testpass123',
        )
        self.other_student = User.objects.create_user(
            username='other_student',
            email='other-student@example.com',
            password='testpass123',
        )
        self.admin = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='testpass123',
            is_staff=True,
        )

        instructors_group, _ = Group.objects.get_or_create(name='Instructors')
        self.instructor.groups.add(instructors_group)

        self.program = Program.objects.create(
            name='Messaging Program',
            code='MSG-001',
            level='beginner',
        )
        Enrollment.objects.create(
            user=self.student,
            program=self.program,
            status='active',
        )
        InstructorAssignment.objects.create(
            instructor=self.instructor,
            program=self.program,
            is_primary=True,
        )

    def test_can_initiate_student_to_program_instructor(self):
        self.assertTrue(
            MessagingService.can_initiate_conversation(self.student, self.instructor)
        )

    def test_cannot_initiate_student_to_unrelated_student(self):
        self.assertFalse(
            MessagingService.can_initiate_conversation(self.student, self.other_student)
        )

    def test_can_initiate_instructor_to_program_student(self):
        self.assertTrue(
            MessagingService.can_initiate_conversation(self.instructor, self.student)
        )

    def test_admin_can_initiate_to_anyone(self):
        self.assertTrue(
            MessagingService.can_initiate_conversation(self.admin, self.student)
        )
        self.assertTrue(
            MessagingService.can_initiate_conversation(self.admin, self.instructor)
        )

    def test_send_message_and_mark_read_flow(self):
        conversation, _ = MessagingService.get_or_create_conversation(
            self.student,
            self.instructor,
        )

        sent = MessagingService.send_message(
            conversation,
            self.student,
            'Hello instructor',
        )

        self.assertIsNotNone(sent.id)
        self.assertEqual(DirectMessage.objects.filter(conversation=conversation).count(), 1)
        self.assertEqual(MessagingService.get_unread_count(self.instructor), 1)

        updated = MessagingService.mark_conversation_read(conversation, self.instructor)
        self.assertEqual(updated, 1)
        self.assertEqual(MessagingService.get_unread_count(self.instructor), 0)

    def test_send_message_creates_direct_message_notification(self):
        conversation, _ = MessagingService.get_or_create_conversation(
            self.student,
            self.instructor,
        )

        MessagingService.send_message(
            conversation,
            self.student,
            'Need help with assignment',
        )

        self.assertEqual(
            Notification.objects.filter(
                recipient=self.instructor,
                notification_type='direct_message',
            ).count(),
            1,
        )
