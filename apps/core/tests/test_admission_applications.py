import json

import pytest
from django.contrib.messages import get_messages
from django.test import override_settings
from django.urls import reverse


@pytest.mark.django_db
def test_public_admission_application_submission_creates_pending_application(client):
    from apps.core.models import AdmissionApplication

    payload = {
        "fullName": "  Jane Achieng  ",
        "phone": " 0715 000 111 ",
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
    assert application.phone == "0715000111"
    assert application.whatsapp == "0715000111"
    assert application.source == "virtual_subdomain"


@pytest.mark.django_db
def test_application_submission_uses_course_label_for_missing_course(client):
    response = client.post(
        reverse("core:airads.application_submit"),
        data={
            "fullName": "Normal Student",
            "phone": "0715000111",
            "preferredCampus": "Eldoret Campus",
        },
    )

    assert response.status_code == 302
    messages = [str(message) for message in get_messages(response.wsgi_request)]
    assert any("Preferred course" in message for message in messages)


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


@pytest.mark.django_db
def test_program_interest_submission_creates_pending_application(client):
    from apps.core.models import AdmissionApplication
    from apps.progression.tests.factories import ProgramFactory

    program = ProgramFactory(name="Introduction to AI", is_published=True)

    response = client.post(
        reverse("core:program_interest_submit", kwargs={"pk": program.id}),
        data=json.dumps(
            {
                "fullName": "  Mary Wanjiku  ",
                "email": " MARY@example.com ",
                "phone": " 0715 000 222 ",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 302
    assert response.url == f"/programs/{program.slug}/"

    application = AdmissionApplication.objects.get()
    assert application.full_name == "Mary Wanjiku"
    assert application.email == "mary@example.com"
    assert application.phone == "0715 000 222"
    assert application.whatsapp == "0715 000 222"
    assert application.program == program
    assert application.preferred_programme == "Introduction to AI"
    assert application.preferred_campus == "Course detail enquiry"
    assert application.source == "program_detail_modal"
    assert application.status == AdmissionApplication.STATUS_NEW


@pytest.mark.django_db
def test_program_interest_submission_validates_required_fields(client):
    from apps.core.models import AdmissionApplication
    from apps.progression.tests.factories import ProgramFactory

    program = ProgramFactory(is_published=True)

    response = client.post(
        reverse("core:program_interest_submit", kwargs={"pk": program.id}),
        data=json.dumps(
            {
                "fullName": "",
                "email": "not-an-email",
                "phone": "",
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 302
    assert response.url == f"/programs/{program.slug}/"
    assert AdmissionApplication.objects.count() == 0
