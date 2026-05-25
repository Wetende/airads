import json

import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_public_admission_application_submission_creates_pending_application(client):
    from apps.core.models import AdmissionApplication

    payload = {
        "fullName": "  Jane Achieng  ",
        "phone": " 0715 000 111 ",
        "whatsapp": "0715 000 111",
        "email": " jane@example.com ",
        "preferredCampus": "Eldoret Campus",
        "preferredProgramme": "Information Communication Technology",
        "intake": "January 2026",
        "educationLevel": "KCSE",
        "message": "I would like to join the diploma intake.",
    }

    response = client.post(
        reverse("core:airads.application_submit"),
        data=json.dumps(payload),
        content_type="application/json",
    )

    assert response.status_code == 302
    assert response.url == reverse("core:airads.application_apply")

    application = AdmissionApplication.objects.get()
    assert application.full_name == "Jane Achieng"
    assert application.phone == "0715 000 111"
    assert application.whatsapp == "0715 000 111"
    assert application.email == "jane@example.com"
    assert application.preferred_campus == "Eldoret Campus"
    assert application.preferred_programme == "Information Communication Technology"
    assert application.intake == "January 2026"
    assert application.education_level == "KCSE"
    assert application.message == "I would like to join the diploma intake."
    assert application.status == AdmissionApplication.STATUS_NEW
