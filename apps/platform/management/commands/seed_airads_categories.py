from django.core.management.base import BaseCommand

from apps.platform.models import PlatformSettings


AIRADS_CATEGORIES = [
    "Engineering & ICT",
    "Business Management",
    "Hospitality & Tourism",
    "Health & Social Sciences",
    "Beauty & Hairdressing",
    "Media Studies",
]


class Command(BaseCommand):
    help = "Seed AIRADS school/department course categories."

    def handle(self, *args, **options):
        settings = PlatformSettings.get_settings()
        if settings.get_program_categories() == AIRADS_CATEGORIES:
            self.stdout.write(self.style.SUCCESS("AIRADS categories already seeded."))
            return

        settings.program_categories = AIRADS_CATEGORIES
        settings.save(update_fields=["program_categories", "updated_at"])
        self.stdout.write(self.style.SUCCESS("Seeded AIRADS course categories."))
