from django.contrib import admin

from .models import ProgramReview


@admin.register(ProgramReview)
class ProgramReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "program", "user", "rating", "status", "created_at")
    list_filter = ("status", "rating", "created_at")
    search_fields = ("program__name", "user__email", "user__username")
