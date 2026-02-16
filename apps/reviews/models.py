from django.db import models

from apps.core.models import TimeStampedModel


class ProgramReview(TimeStampedModel):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    program = models.ForeignKey(
        "core.Program",
        on_delete=models.CASCADE,
        related_name="reviews",
    )
    user = models.ForeignKey(
        "core.User",
        on_delete=models.CASCADE,
        related_name="program_reviews",
    )
    enrollment = models.ForeignKey(
        "progression.Enrollment",
        on_delete=models.SET_NULL,
        related_name="reviews",
        null=True,
        blank=True,
    )
    rating = models.PositiveSmallIntegerField()
    review_html = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    moderated_by = models.ForeignKey(
        "core.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="moderated_reviews",
    )
    moderated_at = models.DateTimeField(null=True, blank=True)
    moderation_note = models.TextField(blank=True, default="")

    class Meta:
        db_table = "program_reviews"
        constraints = [
            models.UniqueConstraint(fields=["program", "user"], name="uniq_program_review_user"),
            models.CheckConstraint(check=models.Q(rating__gte=1) & models.Q(rating__lte=5), name="program_review_rating_1_5"),
        ]
        indexes = [
            models.Index(fields=["program", "status"]),
            models.Index(fields=["status", "created_at"]),
        ]

    def __str__(self):
        return f"Review({self.program_id}, {self.user_id}, {self.status})"
