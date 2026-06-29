from io import StringIO

import pytest
from django.core.management import call_command

from apps.progression.tests.factories import ProgramFactory


@pytest.mark.django_db
def test_audit_program_media_reports_present_and_missing_thumbnails(settings, tmp_path):
    settings.MEDIA_ROOT = str(tmp_path / "media")
    thumbnail_dir = tmp_path / "media" / "programs" / "thumbnails"
    thumbnail_dir.mkdir(parents=True)
    (thumbnail_dir / "present.png").write_bytes(b"image")

    ProgramFactory(
        name="Present thumbnail",
        thumbnail="programs/thumbnails/present.png",
    )
    ProgramFactory(
        name="Missing thumbnail",
        thumbnail="programs/thumbnails/missing.png",
    )

    output = StringIO()
    call_command("audit_program_media", stdout=output)

    text = output.getvalue()
    assert "MEDIA_ROOT status: exists=True readable=True writable=True" in text
    assert "OK id=" in text
    assert "thumbnail=programs/thumbnails/present.png" in text
    assert "MISSING id=" in text
    assert "thumbnail=programs/thumbnails/missing.png" in text
    assert "Summary: checked=2 reported=2 missing=1" in text


@pytest.mark.django_db
def test_audit_program_media_can_report_missing_only(settings, tmp_path):
    settings.MEDIA_ROOT = str(tmp_path / "media")
    thumbnail_dir = tmp_path / "media" / "programs" / "thumbnails"
    thumbnail_dir.mkdir(parents=True)
    (thumbnail_dir / "present.png").write_bytes(b"image")

    ProgramFactory(
        name="Present thumbnail",
        thumbnail="programs/thumbnails/present.png",
    )
    ProgramFactory(
        name="Missing thumbnail",
        thumbnail="programs/thumbnails/missing.png",
    )

    output = StringIO()
    call_command("audit_program_media", "--missing-only", stdout=output)

    text = output.getvalue()
    assert "thumbnail=programs/thumbnails/present.png" not in text
    assert "thumbnail=programs/thumbnails/missing.png" in text
    assert "Summary: checked=2 reported=1 missing=1" in text
