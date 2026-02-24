from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("assessments", "0013_question_pair_gap_explanations"),
    ]

    operations = [
        migrations.AddField(
            model_name="quizattempt",
            name="runtime_state",
            field=models.JSONField(default=dict),
        ),
    ]
