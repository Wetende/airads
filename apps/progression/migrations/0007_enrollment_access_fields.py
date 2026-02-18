from datetime import timedelta

from django.db import migrations, models


def backfill_enrollment_expiry(apps, schema_editor):
    Enrollment = apps.get_model("progression", "Enrollment")

    queryset = Enrollment.objects.select_related("program").filter(
        status="active",
        expires_at__isnull=True,
    )

    updates = []
    for enrollment in queryset.iterator():
        program = enrollment.program
        access_days = getattr(program, "access_duration_days", None)
        if access_days:
            enrolled_at = enrollment.enrolled_at or enrollment.created_at
            if enrolled_at:
                enrollment.expires_at = enrolled_at + timedelta(days=int(access_days))
                updates.append(enrollment)

    if updates:
        Enrollment.objects.bulk_update(updates, ["expires_at"])


def noop_reverse(apps, schema_editor):
    return None


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0012_program_learning_controls_and_ratings"),
        ("progression", "0006_student_notes"),
    ]

    operations = [
        migrations.AddField(
            model_name="enrollment",
            name="access_source",
            field=models.CharField(
                choices=[
                    ("free", "Free"),
                    ("approval", "Approval"),
                    ("paid", "Paid"),
                    ("admin", "Admin"),
                ],
                default="free",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="enrollment",
            name="expires_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(backfill_enrollment_expiry, noop_reverse),
    ]
