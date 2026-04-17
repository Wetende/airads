from django.conf import settings
from django.db import models
from django.db.models import F

from apps.core.models import TimeStampedModel


class Conversation(TimeStampedModel):
    """A one-to-one conversation between two users."""

    participant_one = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_as_one',
    )
    participant_two = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_as_two',
    )
    last_message_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'messaging_conversations'
        constraints = [
            models.CheckConstraint(
                check=~models.Q(participant_one=F('participant_two')),
                name='messaging_conversation_distinct_participants',
            ),
            models.UniqueConstraint(
                fields=['participant_one', 'participant_two'],
                name='messaging_conversation_unique_pair',
            ),
        ]
        indexes = [
            models.Index(fields=['participant_one', '-last_message_at']),
            models.Index(fields=['participant_two', '-last_message_at']),
        ]

    def __str__(self):
        return f'Conversation({self.participant_one_id}, {self.participant_two_id})'

    def has_participant(self, user) -> bool:
        return user.id in {self.participant_one_id, self.participant_two_id}

    def other_participant(self, user):
        if user.id == self.participant_one_id:
            return self.participant_two
        return self.participant_one


class DirectMessage(TimeStampedModel):
    """A single direct message in a one-to-one conversation."""

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_direct_messages',
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'messaging_direct_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', '-created_at']),
            models.Index(fields=['conversation', 'is_read']),
            models.Index(fields=['sender', '-created_at']),
        ]

    def __str__(self):
        return f'DirectMessage({self.id}) in Conversation({self.conversation_id})'
