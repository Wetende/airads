import json
from urllib.parse import parse_qs, urlencode, urlparse

import pytest
from django.contrib.messages import get_messages
from django.test import override_settings
from django.urls import reverse

from apps.core.tests.factories import UserFactory


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
    assert response.url.startswith(
        reverse("core:program_enrollment_resume") + "?intent="
    )

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
def test_google_sign_in_resumes_free_course_enrollment(client, monkeypatch):
    from apps.core.models import AdmissionApplication, User
    from apps.progression.models import Enrollment
    from apps.progression.tests.factories import ProgramFactory

    program = ProgramFactory(
        name="Free Google Course",
        is_published=True,
        custom_pricing={"price": 0},
    )
    lead_response = client.post(
        reverse("core:program_interest_submit", kwargs={"pk": program.id}),
        {
            "fullName": "Mary Wanjiku",
            "email": "mary.google@example.com",
            "phone": "0715000222",
        },
    )
    intent_url = lead_response.url

    login_response = client.get(intent_url)
    assert login_response.status_code == 302
    assert login_response.url.startswith("/login/?next=")

    def fake_verify(_credential):
        return {
            "email": "mary.google@example.com",
            "email_verified": True,
            "given_name": "Mary",
            "family_name": "Wanjiku",
            "sub": "google-free-course-student",
        }

    monkeypatch.setattr("apps.core.views._verify_google_one_tap_credential", fake_verify)
    client.cookies["g_csrf_token"] = "google-csrf"
    google_callback_url = (
        reverse("core:google_onetap_login")
        + "?"
        + urlencode({"next": intent_url})
    )

    with override_settings(
        GOOGLE_ONE_TAP_ENABLED=True,
        GOOGLE_ONE_TAP_CLIENT_ID="google-client-id",
    ):
        google_response = client.post(
            google_callback_url,
            {
                "credential": "signed-google-jwt",
                "g_csrf_token": "google-csrf",
            },
        )

    assert google_response.status_code == 302
    assert google_response.url == intent_url

    enrollment_response = client.get(google_response.url)
    user = User.objects.get(email="mary.google@example.com")
    enrollment = Enrollment.objects.get(user=user, program=program)
    application = AdmissionApplication.objects.get(email="mary.google@example.com")

    assert enrollment_response.status_code == 302
    assert enrollment_response.url == reverse(
        "progression:student.program", kwargs={"pk": program.id}
    )
    assert enrollment.access_source == "free"
    assert application.user == user
    assert application.enrollment == enrollment
    assert application.status == AdmissionApplication.STATUS_ACCEPTED
    assert user.phone == "0715000222"
    assert not user.has_usable_password()


@pytest.mark.django_db
def test_enrollment_resume_rejects_account_with_different_email(client):
    from apps.core.models import AdmissionApplication
    from apps.progression.models import Enrollment
    from apps.progression.tests.factories import ProgramFactory

    program = ProgramFactory(is_published=True, custom_pricing={"price": 0})
    response = client.post(
        reverse("core:program_interest_submit", kwargs={"pk": program.id}),
        {
            "fullName": "Correct Student",
            "email": "correct@example.com",
            "phone": "0715000444",
        },
    )
    other_user = UserFactory(email="different@example.com")
    client.force_login(other_user)

    resume_response = client.get(response.url)

    assert resume_response.status_code == 302
    assert resume_response.url == f"/programs/{program.slug}/"
    application = AdmissionApplication.objects.get(email="correct@example.com")
    assert application.user is None
    assert not Enrollment.objects.filter(user=other_user, program=program).exists()


@pytest.mark.django_db
def test_paid_course_resume_links_checkout_order_and_paid_enrollment(client):
    from apps.commerce.models import Order
    from apps.commerce.services import CheckoutService
    from apps.core.models import AdmissionApplication
    from apps.progression.models import Enrollment

    user = UserFactory(email="paid-google@example.com")
    program = _create_paid_program(code="ADM-PAY-GOOGLE")
    client.force_login(user)
    response = client.post(
        reverse("core:program_interest_submit", kwargs={"pk": program.id}),
        {
            "fullName": "Paid Google Student",
            "email": "paid-google@example.com",
            "phone": "0715000555",
        },
    )

    resume_response = client.get(response.url)
    checkout_query = parse_qs(urlparse(resume_response.url).query)
    application = AdmissionApplication.objects.get(email="paid-google@example.com")

    assert resume_response.status_code == 302
    assert urlparse(resume_response.url).path == "/checkout/"
    assert checkout_query["programId"] == [str(program.id)]
    assert checkout_query["applicationId"] == [str(application.id)]
    assert application.user == user

    order_response = client.post(
        "/commerce/orders/",
        data=json.dumps(
            {
                "paymentMethod": Order.PROVIDER_PAYSTACK,
                "programIds": [program.id],
                "applicationId": application.id,
            }
        ),
        content_type="application/json",
    )
    assert order_response.status_code == 201
    order = Order.objects.get(id=order_response.json()["order"]["id"])
    application.refresh_from_db()
    assert application.order == order

    CheckoutService.mark_order_paid(order)
    application.refresh_from_db()
    enrollment = Enrollment.objects.get(user=user, program=program)
    assert application.enrollment == enrollment
    assert application.status == AdmissionApplication.STATUS_ACCEPTED
    assert enrollment.access_source == "paid"


@pytest.mark.django_db
def test_direct_checkout_without_admission_application_still_works(client):
    from apps.commerce.models import Order

    user = UserFactory()
    program = _create_paid_program(code="ADM-PAY-DIRECT")
    client.force_login(user)

    response = client.post(
        "/commerce/orders/",
        data=json.dumps(
            {
                "paymentMethod": Order.PROVIDER_PAYSTACK,
                "programIds": [program.id],
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 201
    assert response.json()["order"]["status"] == Order.STATUS_PENDING_PAYMENT


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


def _create_admission_application(**overrides):
    from apps.core.models import AdmissionApplication

    program = overrides.get("program")
    defaults = {
        "full_name": "Lead Student",
        "phone": "0715000333",
        "whatsapp": "0715000333",
        "email": "lead@example.com",
        "program": program,
        "preferred_campus": "Course detail enquiry",
        "preferred_programme": program.name if program else "Information Communication Technology",
        "source": "program_detail_modal",
    }
    defaults.update(overrides)
    return AdmissionApplication.objects.create(**defaults)


def _create_paid_program(code="ADM-PAY-001", price=1500):
    from apps.core.models import Program
    from apps.platform.models import PlatformSettings

    settings = PlatformSettings.get_settings()
    features = settings.features if isinstance(settings.features, dict) else {}
    settings.features = {**features, "payments": True}
    settings.save(update_fields=["features", "updated_at"])
    return Program.objects.create(
        name=f"Admissions Course {code}",
        code=code,
        is_published=True,
        custom_pricing={"price": price, "currency": "KES"},
    )


@pytest.mark.django_db
def test_admin_can_link_existing_user_from_admission_application(client):
    student = UserFactory(username="existing-student", email="lead@example.com")
    admin = UserFactory(admin=True)
    application = _create_admission_application(email="LEAD@example.com")
    client.force_login(admin)

    response = client.post(
        reverse("core:admin.admission_application.link_user", args=[application.id])
    )

    assert response.status_code == 302
    application.refresh_from_db()
    assert application.user == student


@pytest.mark.django_db
def test_admin_can_create_student_account_from_admission_application(client):
    from apps.core.models import User

    admin = UserFactory(admin=True)
    application = _create_admission_application(
        full_name="Grace Njeri Wambui",
        email="grace@example.com",
        phone="0700111222",
    )
    client.force_login(admin)

    response = client.post(
        reverse("core:admin.admission_application.create_user", args=[application.id])
    )

    assert response.status_code == 302
    user = User.objects.get(email="grace@example.com")
    application.refresh_from_db()
    assert application.user == user
    assert user.first_name == "Grace"
    assert user.last_name == "Njeri Wambui"
    assert user.phone == "0700111222"
    assert not user.has_usable_password()


@pytest.mark.django_db
def test_admin_direct_enroll_creates_enrollment_and_links_application(client):
    from apps.progression.models import Enrollment
    from apps.progression.tests.factories import ProgramFactory

    admin = UserFactory(admin=True)
    student = UserFactory(email="enroll@example.com")
    program = ProgramFactory(name="Direct Admissions", is_published=True)
    application = _create_admission_application(
        email="enroll@example.com",
        user=student,
        program=program,
    )
    client.force_login(admin)

    response = client.post(
        reverse("core:admin.admission_application.direct_enroll", args=[application.id])
    )

    assert response.status_code == 302
    enrollment = Enrollment.objects.get(user=student, program=program)
    application.refresh_from_db()
    assert enrollment.status == "active"
    assert enrollment.access_source == "admin"
    assert application.enrollment == enrollment
    assert application.status == "accepted"


@pytest.mark.django_db
def test_admin_admission_payment_status_serializes_pending_and_paid_orders(client):
    from apps.commerce.models import Order
    from apps.commerce.services import CheckoutService
    from apps.progression.models import Enrollment

    admin = UserFactory(admin=True)
    student = UserFactory(email="paying-lead@example.com")
    program = _create_paid_program()
    application = _create_admission_application(
        email="paying-lead@example.com",
        user=student,
        program=program,
    )
    client.force_login(admin)

    order = CheckoutService.create_order_from_programs(
        student,
        [program],
        Order.PROVIDER_OFFLINE_BANK_TRANSFER,
    )

    pending_response = client.get(
        reverse("core:admin.admission_application", args=[application.id]),
        HTTP_X_INERTIA=True,
    )
    pending_application = pending_response.json()["props"]["application"]
    assert pending_application["paymentStatus"]["state"] == "pending"
    assert pending_application["paymentStatus"]["orderId"] == order.id
    assert pending_application["enrollmentStatus"]["state"] == "not_enrolled"

    CheckoutService.mark_order_paid(order, actor=admin)

    paid_response = client.get(
        reverse("core:admin.admission_application", args=[application.id]),
        HTTP_X_INERTIA=True,
    )
    paid_application = paid_response.json()["props"]["application"]
    assert paid_application["paymentStatus"]["state"] == "paid"
    assert paid_application["enrollmentStatus"]["state"] == "active"
    assert Enrollment.objects.filter(user=student, program=program).exists()
