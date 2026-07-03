# Generated for admin admissions workflow links.

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("commerce", "0005_wishlistitem"),
        ("core", "0022_masterstudy_settings_fields"),
        ("progression", "0007_enrollment_access_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="admissionapplication",
            name="enrollment",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="admission_applications",
                to="progression.enrollment",
            ),
        ),
        migrations.AddField(
            model_name="admissionapplication",
            name="order",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="admission_applications",
                to="commerce.order",
            ),
        ),
        migrations.AddField(
            model_name="admissionapplication",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="admission_applications",
                to="core.user",
            ),
        ),
    ]
