from django.test import RequestFactory

from apps.core.utils import (
    get_requested_inertia_props,
    should_render_inertia_prop,
)


def test_get_requested_inertia_props_returns_none_without_header():
    request = RequestFactory().get("/programs/")

    assert get_requested_inertia_props(request) is None


def test_get_requested_inertia_props_parses_partial_header():
    request = RequestFactory().get(
        "/programs/",
        HTTP_X_INERTIA_PARTIAL_DATA="programs, groupedPrograms, filters",
    )

    assert get_requested_inertia_props(request) == {
        "programs",
        "groupedPrograms",
        "filters",
    }


def test_should_render_inertia_prop_respects_requested_props():
    request = RequestFactory().get(
        "/programs/",
        HTTP_X_INERTIA_PARTIAL_DATA="programs, filters",
    )

    assert should_render_inertia_prop(request, "programs") is True
    assert should_render_inertia_prop(request, "pagination", "filters") is True
    assert should_render_inertia_prop(request, "categories") is False
