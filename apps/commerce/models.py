from django.db import models

from apps.core.models import TimeStampedModel


class Order(TimeStampedModel):
    STATUS_CHOICES = [
        ("created", "Created"),
        ("pending_payment", "Pending payment"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
        ("expired", "Expired"),
        ("refunded", "Refunded"),
    ]

    user = models.ForeignKey("core.User", on_delete=models.CASCADE, related_name="orders")
    program = models.ForeignKey("core.Program", on_delete=models.CASCADE, related_name="orders")
    enrollment = models.ForeignKey(
        "progression.Enrollment",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )
    provider = models.CharField(max_length=32, default="paystack")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="created")
    amount_minor = models.PositiveIntegerField()
    currency = models.CharField(max_length=8, default="KES")
    reference = models.CharField(max_length=128, unique=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "orders"
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["program", "status"]),
            models.Index(fields=["provider", "reference"]),
        ]

    def __str__(self):
        return f"Order({self.reference}, {self.status})"


class PaymentAttempt(TimeStampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="attempts")
    provider = models.CharField(max_length=32, default="paystack")
    state = models.CharField(max_length=64, default="initialized")
    provider_reference = models.CharField(max_length=128, blank=True, default="")
    request_payload = models.JSONField(default=dict, blank=True)
    response_payload = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "payment_attempts"
        indexes = [
            models.Index(fields=["order", "created_at"]),
            models.Index(fields=["provider", "provider_reference"]),
        ]


class WebhookEvent(TimeStampedModel):
    provider = models.CharField(max_length=32, default="paystack")
    event_id = models.CharField(max_length=255, blank=True, default="")
    reference = models.CharField(max_length=255, blank=True, default="")
    dedupe_key = models.CharField(max_length=255, unique=True)
    signature_valid = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    payload = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "payment_webhook_events"
        indexes = [
            models.Index(fields=["provider", "reference"]),
            models.Index(fields=["provider", "event_id"]),
            models.Index(fields=["processed_at"]),
        ]

    def __str__(self):
        return f"WebhookEvent({self.provider}, {self.dedupe_key})"
