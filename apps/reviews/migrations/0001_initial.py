from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("core", "0012_program_learning_controls_and_ratings"),
        ("progression", "0007_enrollment_access_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProgramReview",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("rating", models.PositiveSmallIntegerField()),
                ("review_html", models.TextField(blank=True, default="")),
                ("status", models.CharField(choices=[("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")], default="pending", max_length=20)),
                ("moderated_at", models.DateTimeField(blank=True, null=True)),
                ("moderation_note", models.TextField(blank=True, default="")),
                ("enrollment", models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name="reviews", to="progression.enrollment")),
                ("moderated_by", models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name="moderated_reviews", to="core.user")),
                ("program", models.ForeignKey(on_delete=models.CASCADE, related_name="reviews", to="core.program")),
                ("user", models.ForeignKey(on_delete=models.CASCADE, related_name="program_reviews", to="core.user")),
            ],
            options={
                "db_table": "program_reviews",
                "indexes": [models.Index(fields=["program", "status"], name="program_revi_program_513d98_idx"), models.Index(fields=["status", "created_at"], name="program_revi_status_7df8e9_idx")],
            },
        ),
        migrations.AddConstraint(
            model_name="programreview",
            constraint=models.UniqueConstraint(fields=("program", "user"), name="uniq_program_review_user"),
        ),
        migrations.AddConstraint(
            model_name="programreview",
            constraint=models.CheckConstraint(check=models.Q(rating__gte=1) & models.Q(rating__lte=5), name="program_review_rating_1_5"),
        ),
    ]
