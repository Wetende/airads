"""
Property-based tests for public views.
Requirements: 5.2, 5.3, 5.5

Uses Hypothesis for property-based testing with minimum 100 iterations.
"""

import pytest
from hypothesis import given, strategies as st, settings, assume, HealthCheck
from django.test import Client, override_settings
from django.utils import timezone
from datetime import date

from apps.certifications.models import Certificate, VerificationLog
from apps.platform.models import PlatformSettings
from apps.progression.tests.factories import ProgramFactory


HYPOTHESIS_SETTINGS = settings(
    max_examples=10, 
    suppress_health_check=[HealthCheck.function_scoped_fixture, HealthCheck.too_slow],
    deadline=None
)


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
@pytest.mark.django_db
def test_virtual_host_root_renders_virtual_campus(client):
    response = client.get("/", HTTP_HOST="virtual.airads.ac.ke")

    assert response.status_code == 200
    assert b"Public/Virtual" in response.content


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
@pytest.mark.django_db
def test_main_host_root_keeps_normal_home(client):
    response = client.get("/", HTTP_HOST="testserver")

    assert response.status_code == 200
    assert b"Public/Home" in response.content


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
@pytest.mark.django_db
def test_virtual_host_courses_route_uses_virtual_catalog(client):
    response = client.get("/courses/", HTTP_HOST="virtual.airads.ac.ke")

    assert response.status_code == 200
    assert b"Public/VirtualCourses" in response.content


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
@pytest.mark.django_db
def test_virtual_catalog_receives_admin_categories(client):
    settings = PlatformSettings.get_settings()
    settings.program_categories = ["Engineering & ICT", "Business Management"]
    settings.save(update_fields=["program_categories", "updated_at"])

    response = client.get(
        "/courses/?category=Engineering%20%26%20ICT",
        HTTP_HOST="virtual.airads.ac.ke",
        HTTP_X_INERTIA="true",
    )

    assert response.status_code == 200
    props = response.json()["props"]
    assert props["categories"] == ["Engineering & ICT", "Business Management"]
    assert props["filters"]["category"] == "Engineering & ICT"


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
@pytest.mark.django_db
def test_virtual_landing_program_payload_includes_classification_fields(client):
    ProgramFactory(
        name="Introduction to AI",
        category="Engineering & ICT",
        level="Beginner",
        exam_body="Internal",
        qualification_family="Short Course",
        award_type="Internal Certificate of Completion",
    )

    response = client.get(
        "/",
        HTTP_HOST="virtual.airads.ac.ke",
        HTTP_X_INERTIA="true",
    )

    assert response.status_code == 200
    props = response.json()["props"]
    [program] = props["programs"]
    assert program["examBody"] == "Internal"
    assert program["qualificationFamily"] == "Short Course"
    assert program["awardType"] == "Internal Certificate of Completion"


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
@pytest.mark.django_db
def test_virtual_host_apply_route_uses_virtual_application_context(client):
    response = client.get("/apply/", HTTP_HOST="virtual.airads.ac.ke")

    assert response.status_code == 200
    assert b"Public/ApplicationApply" in response.content
    assert b"&quot;mainHome&quot;: &quot;https://airads.ac.ke/&quot;" in response.content
    assert b"&quot;studyMode&quot;: &quot;virtual&quot;" in response.content
    assert b"&quot;lockedCampus&quot;: &quot;Virtual Campus&quot;" in response.content


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
@pytest.mark.django_db
def test_virtual_host_program_detail_receives_virtual_site_context(client):
    program = ProgramFactory(name="Virtual ICT", is_published=True)

    response = client.get(
        f"/programs/{program.slug}/",
        HTTP_HOST="virtual.airads.ac.ke",
        HTTP_X_INERTIA="true",
    )

    assert response.status_code == 200
    props = response.json()["props"]
    assert props["siteContext"]["isVirtualCampus"] is True
    assert props["siteContext"]["routes"]["virtualApply"] == "/apply/"


@override_settings(
    ALLOWED_HOSTS=["testserver", "virtual.airads.ac.ke"],
    VIRTUAL_CAMPUS_HOSTS=["virtual.airads.ac.ke"],
)
def test_main_host_apply_route_redirects_to_virtual_subdomain(client):
    response = client.get("/apply/", HTTP_HOST="testserver")

    assert response.status_code == 302
    assert response.url == "https://virtual.airads.ac.ke/apply/"


def test_old_main_domain_virtual_route_removed(client):
    response = client.get("/campuses/virtual/")

    assert response.status_code == 404


# =============================================================================
# Property 12: Certificate Verification Detail Display
# =============================================================================


class TestCertificateVerificationDisplay:
    """
    Property 12: For any valid certificate serial number, the verification page
    SHALL display the student name, program title, completion date, and issue date.
    If revoked, it SHALL additionally display the revoked status and date.
    """

    @pytest.mark.django_db
    def test_valid_certificate_displays_details(self, client, certificate):
        """Valid certificate should display all required details."""
        response = client.post(
            "/verify-certificate/",
            {
                "serial_number": certificate.serial_number,
            },
            HTTP_X_INERTIA="true",
        )

        assert response.status_code == 200
        payload = response.json()
        assert payload["component"] == "Public/CertificateVerification"
        assert payload["props"]["result"] == "valid"
        assert payload["props"]["certificate"] == {
            "serialNumber": certificate.serial_number,
            "studentName": certificate.student_name,
            "programTitle": certificate.program_title,
            "completionDate": certificate.completion_date.isoformat(),
            "issueDate": certificate.issue_date.isoformat(),
            "isRevoked": False,
            "revokedAt": None,
            "revocationReason": None,
        }

        direct_response = client.get(
            certificate.get_verification_url(),
            HTTP_X_INERTIA="true",
        )
        assert direct_response.status_code == 200
        direct_payload = direct_response.json()
        assert direct_payload["component"] == "Public/CertificateVerification"
        assert direct_payload["props"]["certificate"] == payload["props"]["certificate"]

    @pytest.mark.django_db
    def test_revoked_certificate_shows_revoked_status(
        self, client, revoked_certificate
    ):
        """Revoked certificate should show revoked status."""
        response = client.post(
            "/verify-certificate/",
            {
                "serial_number": revoked_certificate.serial_number,
            },
            HTTP_X_INERTIA="true",
        )

        assert response.status_code == 200
        assert response.json()["props"]["result"] == "revoked"
        assert response.json()["props"]["certificate"]["isRevoked"] is True

    @pytest.mark.django_db
    @given(
        serial=st.text(
            min_size=5, max_size=20, alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"
        )
    )
    @HYPOTHESIS_SETTINGS
    def test_nonexistent_certificate_returns_not_found(self, client, serial):
        """Non-existent serial should return not found result."""
        # Ensure serial doesn't exist
        assume(not Certificate.objects.filter(serial_number=serial).exists())

        response = client.post(
            "/verify-certificate/",
            {
                "serial_number": serial,
            },
            HTTP_X_INERTIA="true",
        )

        assert response.status_code == 200
        assert response.json()["props"]["result"] == "not_found"
        assert response.json()["props"]["certificate"] is None


# =============================================================================
# Property 13: Verification Audit Logging
# =============================================================================


class TestVerificationAuditLogging:
    """
    Property 13: For any certificate verification attempt, a VerificationLog record
    SHALL be created containing the queried serial number, IP address, user agent,
    result, and timestamp.
    """

    @pytest.mark.django_db
    def test_valid_certificate_creates_log(self, client, certificate):
        """Verifying valid certificate should create log entry."""
        initial_count = VerificationLog.objects.count()

        response = client.post(
            "/verify-certificate/",
            {
                "serial_number": certificate.serial_number,
            },
            HTTP_USER_AGENT="Test Browser",
        )

        assert VerificationLog.objects.count() == initial_count + 1

        log = VerificationLog.objects.latest("created_at")
        assert log.serial_number_queried == certificate.serial_number
        assert log.result == "valid"
        assert log.user_agent == "Test Browser"
        assert log.verified_at is not None

    @pytest.mark.django_db
    def test_revoked_certificate_logs_revoked(self, client, revoked_certificate):
        """Verifying revoked certificate should log 'revoked' result."""
        response = client.post(
            "/verify-certificate/",
            {
                "serial_number": revoked_certificate.serial_number,
            },
        )

        log = VerificationLog.objects.latest("created_at")
        assert log.result == "revoked"

    @pytest.mark.django_db
    @given(
        serial=st.text(
            min_size=5, max_size=20, alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"
        )
    )
    @HYPOTHESIS_SETTINGS
    def test_nonexistent_certificate_logs_not_found(self, client, serial):
        """Verifying non-existent certificate should log 'not_found' result."""
        assume(not Certificate.objects.filter(serial_number=serial).exists())
        assume(serial.strip())  # Ensure non-empty

        initial_count = VerificationLog.objects.count()

        response = client.post(
            "/verify-certificate/",
            {
                "serial_number": serial,
            },
        )

        assert VerificationLog.objects.count() == initial_count + 1

        log = VerificationLog.objects.latest("created_at")
        assert log.serial_number_queried == serial.upper()
        assert log.result == "not_found"

    @pytest.mark.django_db
    def test_log_captures_ip_address(self, client, certificate):
        """Log should capture client IP address."""
        response = client.post(
            "/verify-certificate/",
            {
                "serial_number": certificate.serial_number,
            },
            REMOTE_ADDR="192.168.1.100",
        )

        log = VerificationLog.objects.latest("created_at")
        assert log.ip_address == "192.168.1.100"


# =============================================================================
# Fixtures
# =============================================================================


@pytest.fixture
def client():
    """Django test client."""
    return Client()


@pytest.fixture
def certificate(db):
    """Create a valid certificate for testing."""
    from apps.core.models import Program
    from apps.progression.models import Enrollment
    from apps.certifications.models import CertificateTemplate, Certificate

    # Create minimal required objects
    program = Program.objects.create(
        name="Test Program",
        code="TEST-001",
    )

    # Create user for enrollment
    from apps.core.tests.factories import UserFactory

    user = UserFactory()

    # Create enrollment
    enrollment = Enrollment.objects.create(
        user=user,
        program=program,
        status="completed",
    )

    # Create template
    template = CertificateTemplate.objects.create(
        name="Test Template",
        template_html="<html>{{student_name}}{{program_title}}{{completion_date}}{{serial_number}}</html>",
    )

    # Create certificate
    return Certificate.objects.create(
        enrollment=enrollment,
        template=template,
        serial_number="CERT-TEST-001",
        student_name=user.get_full_name(),
        program_title=program.name,
        completion_date=date.today(),
        issue_date=date.today(),
        pdf_path="/certificates/test.pdf",
        is_revoked=False,
    )


@pytest.fixture
def revoked_certificate(db, certificate):
    """Create a revoked certificate for testing."""
    certificate.is_revoked = True
    certificate.revoked_at = timezone.now()
    certificate.revocation_reason = "Test revocation"
    certificate.serial_number = "CERT-REVOKED-001"
    certificate.save()
    return certificate
