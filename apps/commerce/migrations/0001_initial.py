from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("core", "0012_program_learning_controls_and_ratings"),
        ("progression", "0007_enrollment_access_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("provider", models.CharField(default="paystack", max_length=32)),
                ("status", models.CharField(choices=[("created", "Created"), ("pending_payment", "Pending payment"), ("paid", "Paid"), ("failed", "Failed"), ("cancelled", "Cancelled"), ("expired", "Expired"), ("refunded", "Refunded")], default="created", max_length=20)),
                ("amount_minor", models.PositiveIntegerField()),
                ("currency", models.CharField(default="KES", max_length=8)),
                ("reference", models.CharField(max_length=128, unique=True)),
                ("paid_at", models.DateTimeField(blank=True, null=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                ("enrollment", models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name="orders", to="progression.enrollment")),
                ("program", models.ForeignKey(on_delete=models.CASCADE, related_name="orders", to="core.program")),
                ("user", models.ForeignKey(on_delete=models.CASCADE, related_name="orders", to="core.user")),
            ],
            options={
                "db_table": "orders",
                "indexes": [models.Index(fields=["user", "status"], name="orders_user_status_665f31_idx"), models.Index(fields=["program", "status"], name="orders_progra_77c782_idx"), models.Index(fields=["provider", "reference"], name="orders_provi_433fd0_idx")],
            },
        ),
        migrations.CreateModel(
            name="WebhookEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("provider", models.CharField(default="paystack", max_length=32)),
                ("event_id", models.CharField(blank=True, default="", max_length=255)),
                ("reference", models.CharField(blank=True, default="", max_length=255)),
                ("dedupe_key", models.CharField(max_length=255, unique=True)),
                ("signature_valid", models.BooleanField(default=False)),
                ("processed_at", models.DateTimeField(blank=True, null=True)),
                ("payload", models.JSONField(blank=True, default=dict)),
            ],
            options={
                "db_table": "payment_webhook_events",
                "indexes": [models.Index(fields=["provider", "reference"], name="payment_web_provider_9192bf_idx"), models.Index(fields=["provider", "event_id"], name="payment_web_provider_4ab30c_idx"), models.Index(fields=["processed_at"], name="payment_web_processed_38ab71_idx")],
            },
        ),
        migrations.CreateModel(
            name="PaymentAttempt",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("provider", models.CharField(default="paystack", max_length=32)),
                ("state", models.CharField(default="initialized", max_length=64)),
                ("provider_reference", models.CharField(blank=True, default="", max_length=128)),
                ("request_payload", models.JSONField(blank=True, default=dict)),
                ("response_payload", models.JSONField(blank=True, default=dict)),
                ("order", models.ForeignKey(on_delete=models.CASCADE, related_name="attempts", to="commerce.order")),
            ],
            options={
                "db_table": "payment_attempts",
                "indexes": [models.Index(fields=["order", "created_at"], name="payment_att_order_i_e5c548_idx"), models.Index(fields=["provider", "provider_reference"], name="payment_att_provide_dfbfa6_idx")],
            },
        ),
    ]
