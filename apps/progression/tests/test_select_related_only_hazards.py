from django.test import TestCase
from django.urls import reverse

from apps.core.models import Program
from apps.core.tests.factories import UserFactory
from apps.progression.models import Enrollment


class ProgressionSelectRelatedOnlyHazardTests(TestCase):
    def test_admin_enrollments_page_renders(self):
        admin_user = UserFactory(admin=True)
        student = UserFactory()
        program = Program.objects.create(
            name="Enrollment Program",
            code="ENROLLMENT-PROGRAM-001",
            level="beginner",
            is_published=True,
        )
        Enrollment.objects.create(user=student, program=program, status="active")

        self.client.force_login(admin_user)
        response = self.client.get(
            reverse("progression:admin.enrollments"),
            HTTP_X_INERTIA="true",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["component"], "Admin/Enrollments/Index")
