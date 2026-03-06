from django.test import TestCase
from django.urls import reverse

from apps.core.models import Program
from apps.core.tests.factories import UserFactory
from apps.progression.models import Enrollment


class StudentProgramsViewTests(TestCase):
    def test_student_programs_page_renders_with_inertia(self):
        student = UserFactory()
        program = Program.objects.create(
            name="Student Program",
            code="STUDENT-PROGRAM-001",
            level="beginner",
            is_published=True,
        )
        Enrollment.objects.create(user=student, program=program, status="active")

        self.client.force_login(student)
        response = self.client.get(
            reverse("progression:student.programs"),
            HTTP_X_INERTIA="true",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["component"], "Student/Programs/Index")
