from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0011_remove_contact_inquiry"),
    ]

    operations = [
        migrations.AddField(
            model_name="program",
            name="access_duration_days",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="program",
            name="drip_enabled",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="program",
            name="drip_mode",
            field=models.CharField(
                choices=[
                    ("none", "None"),
                    ("relative", "Relative"),
                    ("absolute", "Absolute"),
                    ("mixed", "Mixed"),
                ],
                default="none",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="program",
            name="prerequisites_enabled",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="program",
            name="rating_average",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=3),
        ),
        migrations.AddField(
            model_name="program",
            name="rating_count",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="program",
            name="prerequisite_programs",
            field=models.ManyToManyField(
                blank=True,
                related_name="unlocks_programs",
                symmetrical=False,
                to="core.program",
            ),
        ),
    ]
