from django.contrib import admin

from .models import Order, PaymentAttempt, WebhookEvent


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("reference", "user", "program", "status", "amount_minor", "currency", "provider", "created_at")
    list_filter = ("status", "provider", "currency")
    search_fields = ("reference", "user__email", "program__name")


@admin.register(PaymentAttempt)
class PaymentAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "provider", "state", "provider_reference", "created_at")
    list_filter = ("provider", "state")
    search_fields = ("provider_reference", "order__reference")


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    list_display = ("id", "provider", "dedupe_key", "signature_valid", "processed_at", "created_at")
    list_filter = ("provider", "signature_valid")
    search_fields = ("dedupe_key", "reference", "event_id")
