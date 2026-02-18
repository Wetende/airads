from datetime import timedelta

import pytest
from django.utils import timezone

from apps.events.models import Event


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
    assert payload["props"]["event"]["what_you_learn_html"] == "<ul><li>Latest roadmap</li></ul>"
    assert payload["props"]["event"]["what_you_learn"] == ["Latest roadmap"]
