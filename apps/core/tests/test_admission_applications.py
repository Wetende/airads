import json

import pytest
from django.test import override_settings
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


@pytest.mark.django_db
@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
def test_virtual_subdomain_submission_forces_virtual_campus(client):
    from apps.core.models import AdmissionApplication, Campus

    Campus.objects.get_or_create(
        slug="virtual",
        defaults={
            "name": "Virtual Campus",
            "campus_type": Campus.CAMPUS_TYPE_VIRTUAL,
            "contact_email": "virtualcampus@airads.ac.ke",
        },
    )

    response = client.post(
        "/apply/submit/",
        data={
            "fullName": "Virtual Student",
            "phone": "0715000111",
            "preferredProgramme": "Information Communication Technology",
            "preferredCampus": "Eldoret Campus",
        },
        HTTP_HOST="virtual.airads.ac.ke",
    )

    assert response.status_code == 302
    assert response.url == "/apply/"
    application = AdmissionApplication.objects.get()
    assert application.study_mode == AdmissionApplication.STUDY_MODE_VIRTUAL
    assert application.campus.slug == "virtual"
    assert application.preferred_campus == "Virtual Campus"
    assert application.source == "virtual_subdomain"


@pytest.mark.django_db
def test_normal_submission_requires_physical_campus(client):
    response = client.post(
        reverse("core:airads.application_submit"),
        data={
            "fullName": "Normal Student",
            "phone": "0715000111",
            "preferredProgramme": "Information Communication Technology",
            "preferredCampus": "",
        },
    )

    assert response.status_code == 302
    assert response.url == reverse("core:airads.application_apply")
