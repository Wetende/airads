from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("platform", "0007_merge_20260415_0058"),
    ]

    operations = [
        migrations.AddField(
            model_name="platformsettings",
            name="currency_code",
            field=models.CharField(
                default="KES",
                help_text="e.g. USD, KES, NGN",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="platformsettings",
            name="currency_symbol",
            field=models.CharField(
                default="KSh ",
                help_text="e.g. $, KSh, ₦",
                max_length=10,
            ),
        ),
    ]
