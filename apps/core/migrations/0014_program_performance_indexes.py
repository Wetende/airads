from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0013_remove_program_what_you_learn_and_more"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="program",
            index=models.Index(
                fields=["created_at"],
                name="program_created_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="program",
            index=models.Index(
                fields=["is_published", "created_at"],
                name="program_pub_created_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="program",
            index=models.Index(
                fields=["is_published", "category"],
                name="program_pub_category_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="program",
            index=models.Index(
                fields=["is_published", "level"],
                name="program_pub_level_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="program",
            index=models.Index(
                fields=["blueprint", "created_at"],
                name="program_blueprint_created_idx",
            ),
        ),
    ]
