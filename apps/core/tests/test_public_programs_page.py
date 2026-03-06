from django.test import TestCase
from django.urls import reverse

from apps.core.models import Program


class PublicProgramsPageTests(TestCase):
    def test_public_programs_page_returns_published_programs(self):
        Program.objects.create(
            name="Visible Program",
            code="VISIBLE-PROGRAM-001",
            level="beginner",
            is_published=True,
        )

        response = self.client.get(
            reverse("core:programs"),
            HTTP_X_INERTIA="true",
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["component"], "Public/Programs")
        self.assertEqual(len(data["props"]["programs"]), 1)
        self.assertEqual(data["props"]["programs"][0]["name"], "Visible Program")
