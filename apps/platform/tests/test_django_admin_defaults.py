import pytest
from django.test import override_settings
from django.urls import reverse


@override_settings(
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"
        },
    }
)
@pytest.mark.django_db
def test_django_admin_login_renders_without_unfold_theme(client):
    response = client.get(reverse("admin:login"))

    assert response.status_code == 200
    assert "unfold" not in response.content.decode().lower()
