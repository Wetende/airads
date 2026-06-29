from io import StringIO

import pytest
from django.core.management import call_command

from apps.core.models import Program
from apps.platform.management.commands.seed_airads_categories import AIRADS_CATEGORIES
from apps.platform.models import PlatformSettings


@pytest.mark.django_db
def test_seed_airads_categories_is_idempotent_and_does_not_update_courses():
    settings = PlatformSettings.get_settings()
    settings.program_categories = []
    settings.save(update_fields=["program_categories", "updated_at"])
    program = Program.objects.create(
        name="Legacy Engineering Course",
        code="LEG-ENG-101",
        category="Engineering",
    )

    first_output = StringIO()
    second_output = StringIO()
    call_command("seed_airads_categories", stdout=first_output)
    call_command("seed_airads_categories", stdout=second_output)

    settings.refresh_from_db()
    program.refresh_from_db()
    assert settings.program_categories == AIRADS_CATEGORIES
    assert program.category == "Engineering"
    assert "Seeded AIRADS course categories" in first_output.getvalue()
    assert "already seeded" in second_output.getvalue()
