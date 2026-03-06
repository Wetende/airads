from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from apps.core.models import Program
from apps.core.tests.factories import UserFactory
from apps.progression.models import InstructorAssignment


class CoreSelectRelatedOnlyHazardTests(TestCase):
    def test_admin_programs_page_renders(self):
        admin_user = UserFactory(admin=True)
        Program.objects.create(
            name="Admin Program",
            code="ADMIN-PROGRAM-001",
            level="beginner",
            is_published=True,
        )

        self.client.force_login(admin_user)
        response = self.client.get(
            reverse("core:admin.programs"),
            HTTP_X_INERTIA="true",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["component"], "Admin/Programs/Index")

    def test_instructor_programs_page_renders(self):
        instructor = UserFactory()
        instructors_group, _ = Group.objects.get_or_create(name="Instructors")
        instructor.groups.add(instructors_group)

        program = Program.objects.create(
            name="Instructor Program",
            code="INSTRUCTOR-PROGRAM-001",
            level="beginner",
            is_published=True,
        )
        InstructorAssignment.objects.create(instructor=instructor, program=program)

        self.client.force_login(instructor)
        response = self.client.get(
            reverse("core:instructor.programs"),
            HTTP_X_INERTIA="true",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["component"], "Instructor/Programs/Index")
