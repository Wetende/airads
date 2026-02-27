import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse

from apps.core.models import Program
from apps.curriculum.models import CurriculumNode
from apps.discussions.models import DiscussionThread
from apps.progression.models import Enrollment, StudentNote


@pytest.mark.django_db
def test_completed_enrollment_can_post_discussion_and_note(client):
    user_model = get_user_model()
    student = user_model.objects.create_user(
        username="completed-student",
        email="completed-student@example.com",
        password="password123",
    )

    program = Program.objects.create(
        name="Completed Program",
        code="CMP-2001",
        level="beginner",
        is_published=True,
    )

    node = CurriculumNode.objects.create(
        program=program,
        node_type="lesson",
        title="Completed Lesson",
        position=1,
        is_published=True,
    )

    enrollment = Enrollment.objects.create(
        user=student,
        program=program,
        status="active",
    )
    Enrollment.objects.filter(pk=enrollment.pk).update(status="completed")
    enrollment.refresh_from_db()

    client.force_login(student)

    discussion_response = client.post(
        reverse(
            "progression:student.session.discussion",
            kwargs={"pk": enrollment.pk, "node_id": node.pk},
        ),
        data={"content": "Posting after completion"},
    )

    assert discussion_response.status_code == 302
    assert DiscussionThread.objects.filter(
        node=node,
        user=student,
        content="Posting after completion",
    ).exists()

    note_response = client.post(
        reverse(
            "progression:student.session.note.create",
            kwargs={"pk": enrollment.pk, "node_id": node.pk},
        ),
        data={"content": "Note after completion"},
    )

    assert note_response.status_code == 302
    assert StudentNote.objects.filter(
        enrollment=enrollment,
        node=node,
        content="Note after completion",
    ).exists()


@pytest.mark.django_db
def test_discussion_post_with_invalid_enrollment_redirects_safely(client):
    user_model = get_user_model()
    student = user_model.objects.create_user(
        username="invalid-enrollment-student",
        email="invalid-enrollment-student@example.com",
        password="password123",
    )

    program = Program.objects.create(
        name="Missing Enrollment Program",
        code="MEP-2001",
        level="beginner",
        is_published=True,
    )
    node = CurriculumNode.objects.create(
        program=program,
        node_type="lesson",
        title="Lesson",
        position=1,
        is_published=True,
    )

    client.force_login(student)

    response = client.post(
        reverse(
            "progression:student.session.discussion",
            kwargs={"pk": 999999, "node_id": node.pk},
        ),
        data={"content": "test"},
    )

    assert response.status_code == 302
    assert response.url == reverse("progression:student.programs")


@pytest.mark.django_db
def test_note_post_with_invalid_enrollment_redirects_safely(client):
    user_model = get_user_model()
    student = user_model.objects.create_user(
        username="invalid-note-enrollment-student",
        email="invalid-note-enrollment-student@example.com",
        password="password123",
    )

    program = Program.objects.create(
        name="Missing Note Enrollment Program",
        code="MNP-2001",
        level="beginner",
        is_published=True,
    )
    node = CurriculumNode.objects.create(
        program=program,
        node_type="lesson",
        title="Lesson",
        position=1,
        is_published=True,
    )

    client.force_login(student)

    response = client.post(
        reverse(
            "progression:student.session.note.create",
            kwargs={"pk": 999999, "node_id": node.pk},
        ),
        data={"content": "test note"},
    )

    assert response.status_code == 302
    assert response.url == reverse("progression:student.programs")


@pytest.mark.django_db
def test_student_discussion_generates_visible_thread_title(client):
    user_model = get_user_model()
    student = user_model.objects.create_user(
        username="discussion-title-student",
        email="discussion-title-student@example.com",
        password="password123",
    )

    program = Program.objects.create(
        name="Discussion Title Program",
        code="DTP-2001",
        level="beginner",
        is_published=True,
    )
    node = CurriculumNode.objects.create(
        program=program,
        node_type="lesson",
        title="Lesson",
        position=1,
        is_published=True,
    )

    enrollment = Enrollment.objects.create(
        user=student,
        program=program,
        status="active",
    )

    client.force_login(student)

    response = client.post(
        reverse(
            "progression:student.session.discussion",
            kwargs={"pk": enrollment.pk, "node_id": node.pk},
        ),
        data={
            "content": "This is my first question for the instructor in this lesson.",
        },
    )

    assert response.status_code == 302
    thread = DiscussionThread.objects.get(node=node, user=student)
    assert thread.title.strip() != ""
    assert "This is my first question" in thread.title
