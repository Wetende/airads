from datetime import timedelta

import pytest
from django.utils import timezone

from apps.core.tests.factories import UserFactory
from apps.events.models import Event
from apps.events.models import EventRegistration


@pytest.mark.django_db
def test_event_save_derives_learning_outcome_items_from_html():
    now = timezone.now()
    event = Event.objects.create(
        title="Canonical Event",
        description="Event description",
        start_datetime=now,
        end_datetime=now + timedelta(hours=2),
        location="Chicago, IL, US",
        is_published=True,
        what_you_learn_html="<p>Networking</p><p>System design</p>",
    )

    assert event.what_you_learn_items == ["Networking", "System design"]


@pytest.mark.django_db
def test_event_detail_uses_canonical_learning_outcome_fields(client):
    now = timezone.now()
    event = Event.objects.create(
        title="Detail Event",
        description="Event description",
        start_datetime=now,
        end_datetime=now + timedelta(hours=1),
        location="Austin, TX, US",
        is_published=True,
        what_you_learn_html="<ul><li>Latest roadmap</li></ul>",
    )

    response = client.get(f"/events/{event.slug}/", HTTP_X_INERTIA=True)

    assert response.status_code == 200
    payload = response.json()
    assert payload["component"] == "Public/EventDetail"
    assert payload["props"]["event"]["what_you_learn_html"] == "<ul><li>Latest roadmap</li></ul>"
    assert payload["props"]["event"]["what_you_learn"] == ["Latest roadmap"]


@pytest.mark.django_db
def test_internal_event_registration_requires_an_explicit_post(client):
    now = timezone.now()
    event = Event.objects.create(
        title="Registration Event",
        description="Event description",
        start_datetime=now + timedelta(days=1),
        end_datetime=now + timedelta(days=1, hours=1),
        location="Nairobi",
        is_published=True,
    )
    user = UserFactory()
    client.force_login(user)
    join_url = f"/events/{event.slug}/join/"

    get_response = client.get(join_url)
    post_response = client.post(join_url)

    assert get_response.status_code == 405
    assert post_response.status_code == 302
    assert EventRegistration.objects.filter(event=event, user=user).count() == 1
