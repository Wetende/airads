from django.test import override_settings
from django.views.static import serve as serve_static

import config.settings.settings as app_settings
from config.urls import media_file_urlpatterns


def test_cpanel_media_defaults_enable_passenger_fallback(monkeypatch):
    monkeypatch.setattr(app_settings, "BASE_DIR", app_settings.CPANEL_APP_ROOT)

    assert app_settings._default_media_root() == app_settings.CPANEL_MEDIA_ROOT
    assert app_settings._default_serve_media_files() is True


def test_local_media_defaults_use_project_media(monkeypatch, tmp_path):
    monkeypatch.setattr(app_settings, "BASE_DIR", tmp_path / "airads")

    assert app_settings._default_media_root() == tmp_path / "airads" / "media"
    assert app_settings._default_serve_media_files() is False


@override_settings(SERVE_MEDIA_FILES=False, MEDIA_URL="/media/")
def test_media_file_urlpatterns_are_disabled_by_default():
    assert media_file_urlpatterns() == []


@override_settings(
    SERVE_MEDIA_FILES=True,
    MEDIA_URL="/media/",
    MEDIA_ROOT="/srv/airads/media",
)
def test_media_file_urlpatterns_can_be_enabled_for_cpanel():
    patterns = media_file_urlpatterns()

    assert len(patterns) == 1
    assert patterns[0].callback == serve_static
    assert patterns[0].pattern.regex.pattern == "^media/(?P<path>.*)$"
    assert patterns[0].default_args["document_root"] == "/srv/airads/media"


@override_settings(SERVE_MEDIA_FILES=True, MEDIA_URL="https://cdn.example.com/media/")
def test_media_file_urlpatterns_ignore_absolute_media_urls():
    assert media_file_urlpatterns() == []
