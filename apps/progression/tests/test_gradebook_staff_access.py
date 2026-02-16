from django.test import TestCase
from django.urls import reverse

from apps.core.models import Program
from apps.core.tests.factories import UserFactory


class ProgressionGradebookStaffAccessTests(TestCase):
    def test_staff_can_open_gradebook_without_instructor_assignment(self):
        staff = UserFactory(admin=True)
        program = Program.objects.create(
            name="Staff Program",
            code="STAFF-GB-001",
            level="beginner",
            is_published=True,
        )

        self.client.force_login(staff)
        response = self.client.get(
            reverse("progression:instructor.gradebook", kwargs={"pk": program.pk})
        )

        self.assertEqual(response.status_code, 200)
