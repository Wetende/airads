from django.test import override_settings
from django.views.static import serve as serve_static

from config.urls import media_file_urlpatterns


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
