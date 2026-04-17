from django.contrib import admin

from .models import Conversation, DirectMessage


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'participant_one', 'participant_two', 'last_message_at', 'created_at')
    search_fields = ('participant_one__email', 'participant_two__email')
    list_filter = ('created_at',)


@admin.register(DirectMessage)
class DirectMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'conversation', 'sender', 'is_read', 'created_at')
    search_fields = ('sender__email', 'content')
    list_filter = ('is_read', 'created_at')
