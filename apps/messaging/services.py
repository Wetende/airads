import time
from typing import Optional

from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import OperationalError, transaction
from django.db.models import Q
from django.utils import timezone

from apps.core.utils import is_admin
from apps.notifications.services import NotificationService
from apps.progression.models import Enrollment, InstructorAssignment

from .models import Conversation, DirectMessage

User = get_user_model()


class MessagingService:
    """Business rules and operations for one-to-one direct messaging."""

    LOCK_RETRY_ATTEMPTS = 4
    LOCK_RETRY_BASE_DELAY_SECONDS = 0.15

    @staticmethod
    def _is_db_locked_error(exc: Exception) -> bool:
        return 'database is locked' in str(exc).lower()

    @staticmethod
    def _with_db_lock_retry(action):
        for attempt in range(MessagingService.LOCK_RETRY_ATTEMPTS):
            try:
                return action()
            except OperationalError as exc:
                if not MessagingService._is_db_locked_error(exc):
                    raise
                if attempt >= MessagingService.LOCK_RETRY_ATTEMPTS - 1:
                    raise
                time.sleep(
                    MessagingService.LOCK_RETRY_BASE_DELAY_SECONDS * (attempt + 1)
                )

    @staticmethod
    def normalize_participants(user_a, user_b):
        """Return users sorted by primary key for stable unique-pair storage."""
        return (user_a, user_b) if user_a.id < user_b.id else (user_b, user_a)

    @staticmethod
    def get_or_create_conversation(user_a, user_b):
        if user_a.id == user_b.id:
            raise ValidationError('You cannot start a conversation with yourself.')

        participant_one, participant_two = MessagingService.normalize_participants(
            user_a,
            user_b,
        )
        conversation, created = MessagingService._with_db_lock_retry(
            lambda: Conversation.objects.get_or_create(
                participant_one=participant_one,
                participant_two=participant_two,
            )
        )
        return conversation, created

    @staticmethod
    def get_user_conversation_or_404(conversation_id: int, user):
        return Conversation.objects.select_related(
            'participant_one',
            'participant_two',
        ).get(
            Q(participant_one=user) | Q(participant_two=user),
            id=conversation_id,
        )

    @staticmethod
    def send_message(conversation: Conversation, sender, content: str):
        if not conversation.has_participant(sender):
            raise PermissionDenied('You are not a participant in this conversation.')

        clean_content = (content or '').strip()
        if not clean_content:
            raise ValidationError('Message content is required.')

        def _write_message():
            with transaction.atomic():
                message = DirectMessage.objects.create(
                    conversation=conversation,
                    sender=sender,
                    content=clean_content,
                    is_read=False,
                    read_at=None,
                )

                conversation.last_message_at = message.created_at
                conversation.save(update_fields=['last_message_at', 'updated_at'])

                recipient = conversation.other_participant(sender)
                NotificationService.create(
                    recipient=recipient,
                    notification_type='direct_message',
                    title=f'Message from {sender.get_full_name() or sender.email}',
                    message=clean_content[:200],
                    priority='normal',
                    action_url=f'/messages/{conversation.id}/',
                )
                return message

        return MessagingService._with_db_lock_retry(_write_message)

    @staticmethod
    def mark_conversation_read(conversation: Conversation, user) -> int:
        if not conversation.has_participant(user):
            raise PermissionDenied('You are not a participant in this conversation.')

        return MessagingService._with_db_lock_retry(
            lambda: DirectMessage.objects.filter(
                conversation=conversation,
                is_read=False,
            ).exclude(sender=user).update(
                is_read=True,
                read_at=timezone.now(),
            )
        )

    @staticmethod
    def get_unread_count(user) -> int:
        return DirectMessage.objects.filter(
            Q(conversation__participant_one=user) | Q(conversation__participant_two=user),
            is_read=False,
        ).exclude(sender=user).count()

    @staticmethod
    def can_initiate_conversation(sender, recipient) -> bool:
        """
        Option B policy:
        - Admin can initiate with anyone.
        - Instructor can initiate with students in assigned programs.
        - Student can initiate with instructors in enrolled programs.
        """
        if sender.id == recipient.id:
            return False

        if is_admin(sender):
            return True

        sender_is_instructor = MessagingService._is_instructor(sender)
        recipient_is_instructor = MessagingService._is_instructor(recipient)

        if sender_is_instructor:
            if is_admin(recipient) or recipient_is_instructor:
                return False

            instructor_program_ids = InstructorAssignment.objects.filter(
                instructor=sender,
            ).values_list('program_id', flat=True)
            if not instructor_program_ids:
                return False

            return Enrollment.objects.filter(
                user=recipient,
                program_id__in=instructor_program_ids,
                status__in=['active', 'completed'],
            ).exists()

        if recipient_is_instructor:
            student_program_ids = Enrollment.objects.filter(
                user=sender,
                status__in=['active', 'completed'],
            ).values_list('program_id', flat=True)
            if not student_program_ids:
                return False

            return InstructorAssignment.objects.filter(
                instructor=recipient,
                program_id__in=student_program_ids,
            ).exists()

        return False

    @staticmethod
    def get_allowed_recipients(user, query: Optional[str] = None):
        """Return users that current user can initiate a new conversation with."""
        qs = User.objects.filter(is_active=True).exclude(id=user.id)

        if is_admin(user):
            allowed_qs = qs
        elif MessagingService._is_instructor(user):
            instructor_program_ids = InstructorAssignment.objects.filter(
                instructor=user,
            ).values_list('program_id', flat=True)
            allowed_user_ids = Enrollment.objects.filter(
                program_id__in=instructor_program_ids,
                status__in=['active', 'completed'],
            ).values_list('user_id', flat=True)
            allowed_qs = (
                qs.filter(id__in=allowed_user_ids)
                .exclude(is_staff=True)
                .exclude(is_superuser=True)
                .exclude(groups__name='Instructors')
            )
        else:
            student_program_ids = Enrollment.objects.filter(
                user=user,
                status__in=['active', 'completed'],
            ).values_list('program_id', flat=True)
            allowed_user_ids = InstructorAssignment.objects.filter(
                program_id__in=student_program_ids,
            ).values_list('instructor_id', flat=True)
            allowed_qs = qs.filter(id__in=allowed_user_ids).exclude(is_superuser=True)

        if query:
            search = query.strip()
            if search:
                allowed_qs = allowed_qs.filter(
                    Q(first_name__icontains=search)
                    | Q(last_name__icontains=search)
                    | Q(email__icontains=search)
                )

        return allowed_qs.distinct().order_by('first_name', 'last_name', 'email')

    @staticmethod
    def _is_instructor(user) -> bool:
        if is_admin(user):
            return False
        return user.groups.filter(name='Instructors').exists() or InstructorAssignment.objects.filter(
            instructor=user
        ).exists()
