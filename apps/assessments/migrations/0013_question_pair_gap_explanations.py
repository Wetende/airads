from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("assessments", "0012_add_weight_to_quiz"),
    ]

    operations = [
        migrations.AddField(
            model_name="questiongapanswer",
            name="explanation",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AddField(
            model_name="questionmatchingpair",
            name="explanation",
            field=models.TextField(blank=True, default=""),
        ),
    ]
