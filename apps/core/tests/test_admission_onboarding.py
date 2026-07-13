import json
import re

import pytest
from django.core import mail
from django.test import override_settings
from django.urls import reverse

from apps.core.models import AdmissionApplication, AdmissionOnboardingBatch, User
from apps.core.tests.factories import UserFactory
from apps.progression.models import Enrollment
from apps.progression.tests.factories import ProgramFactory


def create_application(program, **overrides):
    defaults = {
        "full_name": "Bulk Student",
        "phone": "0715000111",
        "email": "bulk-student@example.com",
        "program": program,
        "preferred_campus": "Virtual Campus",
        "preferred_programme": program.name,
        "source": "main_website",
    }
    defaults.update(overrides)
    return AdmissionApplication.objects.create(**defaults)


@pytest.mark.django_db
@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_bulk_onboarding_creates_usable_account_enrollment_and_access_email(
    django_capture_on_commit_callbacks,
):
    from apps.core.services.admission_onboarding import AdmissionOnboardingService

    admin = UserFactory(admin=True)
    program = ProgramFactory(
        name="Free Onboarding Course",
        is_published=True,
        custom_pricing={"price": 0, "payment_collection": "none"},
    )
    application = create_application(program)

    batch = AdmissionOnboardingService.create_preview_batch(
        created_by=admin,
        selection={"mode": "ids", "ids": [application.id]},
    )
    AdmissionOnboardingService.start(batch)
    with django_capture_on_commit_callbacks(execute=True):
        AdmissionOnboardingService.process_next(
            batch,
            base_url="https://virtual.airads.ac.ke",
        )

    application.refresh_from_db()
    batch.refresh_from_db()
    user = User.objects.get(email=application.email)
    enrollment = Enrollment.objects.get(user=user, program=program)

    assert user.has_usable_password()
    assert application.user == user
    assert application.enrollment == enrollment
    assert application.status == AdmissionApplication.STATUS_ACCEPTED
    assert enrollment.status == "active"
    assert enrollment.access_source == "admin"
    assert batch.status == batch.STATUS_COMPLETED
    assert batch.succeeded_count == 1
    assert len(mail.outbox) == 1
    assert "Temporary password:" in mail.outbox[0].body
    assert "Continue with Google" in mail.outbox[0].body
    password_match = re.search(r"Temporary password:\s*(\S+)", mail.outbox[0].body)
    assert password_match
    assert user.check_password(password_match.group(1))


@pytest.mark.django_db
@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_paid_bulk_onboarding_links_account_but_waits_for_checkout_payment(
    client,
    django_capture_on_commit_callbacks,
):
    from apps.commerce.models import Order
    from apps.commerce.services import CheckoutService
    from apps.core.services.admission_onboarding import AdmissionOnboardingService

    admin = UserFactory(admin=True)
    program = ProgramFactory(
        name="Paid Onboarding Course",
        is_published=True,
        custom_pricing={"price": 2500, "payment_collection": "both"},
    )
    application = create_application(program, email="paid-bulk@example.com")

    batch = AdmissionOnboardingService.create_preview_batch(
        created_by=admin,
        selection={"mode": "ids", "ids": [application.id]},
    )
    AdmissionOnboardingService.start(batch)
    with django_capture_on_commit_callbacks(execute=True):
        AdmissionOnboardingService.process_next(
            batch,
            base_url="https://virtual.airads.ac.ke",
        )

    application.refresh_from_db()
    user = User.objects.get(email=application.email)

    assert application.user == user
    assert application.enrollment_id is None
    assert application.order_id is None
    assert application.status == AdmissionApplication.STATUS_CONTACTED
    assert not Enrollment.objects.filter(user=user, program=program).exists()
    assert len(mail.outbox) == 1
    assert "Payment is required before course access is activated." in mail.outbox[0].body
    assert "/checkout/?" in mail.outbox[0].body

    client.force_login(user)
    checkout_response = client.post(
        "/commerce/orders/",
        data=json.dumps(
            {
                "paymentMethod": Order.PROVIDER_OFFLINE_BANK_TRANSFER,
                "programIds": [program.id],
                "applicationId": application.id,
            }
        ),
        content_type="application/json",
    )
    assert checkout_response.status_code == 201, checkout_response.json()
    order = Order.objects.get(pk=checkout_response.json()["order"]["id"])
    CheckoutService.mark_order_paid(order)

    application.refresh_from_db()
    assert application.order == order
    assert application.status == AdmissionApplication.STATUS_ACCEPTED
    assert Enrollment.objects.filter(user=user, program=program, status="active").exists()


@pytest.mark.django_db
@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_bulk_onboarding_is_resumable_across_processing_chunks(
    django_capture_on_commit_callbacks,
    monkeypatch,
):
    from apps.core.services.admission_onboarding import AdmissionOnboardingService

    monkeypatch.setattr(AdmissionOnboardingService, "CHUNK_SIZE", 2)
    admin = UserFactory(admin=True)
    program = ProgramFactory(
        is_published=True,
        custom_pricing={"price": 0, "payment_collection": "none"},
    )
    applications = [
        create_application(program, email=f"chunk-{index}@example.com")
        for index in range(3)
    ]
    batch = AdmissionOnboardingService.create_preview_batch(
        created_by=admin,
        selection={"mode": "ids", "ids": [item.id for item in applications]},
    )

    with django_capture_on_commit_callbacks(execute=True):
        AdmissionOnboardingService.process_next(batch, base_url="https://example.com")
    batch.refresh_from_db()
    assert batch.status == batch.STATUS_PROCESSING
    assert batch.processed_count == 2

    with django_capture_on_commit_callbacks(execute=True):
        AdmissionOnboardingService.process_next(batch, base_url="https://example.com")
    batch.refresh_from_db()
    assert batch.status == batch.STATUS_COMPLETED
    assert batch.processed_count == 3
    assert batch.succeeded_count == 3


@pytest.mark.django_db
@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
def test_admin_create_student_account_uses_temporary_password_email(
    client,
    django_capture_on_commit_callbacks,
):
    admin = UserFactory(admin=True)
    program = ProgramFactory(is_published=True)
    application = create_application(program, email="single-admin@example.com")
    client.force_login(admin)

    with django_capture_on_commit_callbacks(execute=True):
        response = client.post(
            f"/admin/admissions/{application.id}/create-user/",
        )

    application.refresh_from_db()
    assert response.status_code == 302
    assert application.user.has_usable_password()
    assert len(mail.outbox) == 1
    assert "Temporary password:" in mail.outbox[0].body


@pytest.mark.django_db
def test_admin_can_preview_selected_applications_through_inertia_flow(client):
    admin = UserFactory(admin=True)
    program = ProgramFactory(is_published=True, custom_pricing={"price": 0})
    selected = create_application(program, email="selected@example.com")
    create_application(program, email="not-selected@example.com")
    client.force_login(admin)

    response = client.post(
        reverse("core:admin.admission_onboarding.preview"),
        data=json.dumps({"selection": {"mode": "ids", "ids": [selected.id]}}),
        content_type="application/json",
    )

    batch = AdmissionOnboardingBatch.objects.get()
    assert response.status_code == 302
    assert response.url == reverse(
        "core:admin.admission_onboarding", args=[batch.id]
    )
    assert list(batch.items.values_list("application_id", flat=True)) == [selected.id]

    page = client.get(response.url, HTTP_X_INERTIA=True)
    payload = page.json()
    assert payload["component"] == "Admin/Admissions/Onboarding"
    assert payload["props"]["batch"]["isDraft"] is True
    assert payload["props"]["items"][0]["applicationId"] == selected.id

    index_page = client.get(
        reverse("core:admin.admission_applications"),
        HTTP_X_INERTIA=True,
    ).json()
    assert index_page["props"]["onboardingBatches"][0]["id"] == batch.id


@pytest.mark.django_db
def test_filtered_preview_snapshots_all_matching_applications(client):
    admin = UserFactory(admin=True)
    program = ProgramFactory(is_published=True, custom_pricing={"price": 0})
    matching = create_application(
        program,
        email="match@example.com",
        status=AdmissionApplication.STATUS_NEW,
        source="main_website",
    )
    create_application(
        program,
        email="excluded@example.com",
        status=AdmissionApplication.STATUS_ACCEPTED,
        source="main_website",
    )
    client.force_login(admin)

    response = client.post(
        reverse("core:admin.admission_onboarding.preview"),
        data=json.dumps(
            {
                "selection": {
                    "mode": "filters",
                    "filters": {
                        "status": AdmissionApplication.STATUS_NEW,
                        "source": "main_website",
                        "program": str(program.id),
                        "search": "match@example.com",
                    },
                    "excludedIds": [],
                }
            }
        ),
        content_type="application/json",
    )

    assert response.status_code == 302
    batch = AdmissionOnboardingBatch.objects.get()
    assert batch.selection_mode == AdmissionOnboardingBatch.SELECTION_FILTERS
    assert list(batch.items.values_list("application_id", flat=True)) == [matching.id]


@pytest.mark.django_db
def test_non_admin_cannot_create_or_view_onboarding_batches(client):
    admin = UserFactory(admin=True)
    student = UserFactory()
    program = ProgramFactory(is_published=True, custom_pricing={"price": 0})
    application = create_application(program)
    batch = AdmissionOnboardingBatch.objects.create(
        created_by=admin,
        selection_mode=AdmissionOnboardingBatch.SELECTION_IDS,
        total_count=1,
    )
    client.force_login(student)

    create_response = client.post(
        reverse("core:admin.admission_onboarding.preview"),
        data=json.dumps(
            {"selection": {"mode": "ids", "ids": [application.id]}}
        ),
        content_type="application/json",
    )
    view_response = client.get(
        reverse("core:admin.admission_onboarding", args=[batch.id])
    )

    assert create_response.status_code == 302
    assert create_response.url == "/dashboard/"
    assert view_response.status_code == 302
    assert view_response.url == "/dashboard/"
    assert AdmissionOnboardingBatch.objects.count() == 1


@pytest.mark.django_db
def test_legacy_bulk_enrollment_page_redirects_to_admissions(client):
    client.force_login(UserFactory(admin=True))

    response = client.get(reverse("progression:admin.enrollment.bulk"))

    assert response.status_code == 302
    assert response.url == "/admin/admissions/?onboarding=1"
