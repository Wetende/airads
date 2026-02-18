import pytest

from apps.core.models import Program


@pytest.mark.django_db
def test_program_save_derives_learning_outcome_items_from_html():
    program = Program.objects.create(
        name="Canonical Program",
        code="CANON-001",
        level="beginner",
        what_you_learn_html="<ul><li>Build features</li><li>Ship safely</li></ul>",
    )

    assert program.what_you_learn_html == "<ul><li>Build features</li><li>Ship safely</li></ul>"
    assert program.what_you_learn_items == ["Build features", "Ship safely"]
