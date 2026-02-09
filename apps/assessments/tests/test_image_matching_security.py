import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from apps.assessments.models import Question, QuestionImageMatchingPair, Quiz, QuizAttempt
from apps.core.models import Program
from apps.curriculum.models import CurriculumNode
from apps.progression.models import Enrollment


User = get_user_model()


class ImageMatchingSecurityTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="student_secure",
            email="student_secure@test.com",
            password="password123",
        )
        self.program = Program.objects.create(name="Security Program", code="SEC-101")
        self.node = CurriculumNode.objects.create(
            program=self.program,
            title="Image Matching Quiz",
            node_type="quiz",
            properties={},
        )
        self.quiz = Quiz.objects.create(
            node=self.node,
            title="Image Matching Security Quiz",
            is_published=True,
            max_attempts=2,
        )
        self.question = Question.objects.create(
            quiz=self.quiz,
            question_type="image_matching",
            text="Match each animal to its sound",
            points=4,
            position=0,
            answer_data={},
        )
        self.pair_1 = QuestionImageMatchingPair.objects.create(
            question=self.question,
            question_text="Dog",
            answer_text="Bark",
            position=0,
        )
        self.pair_2 = QuestionImageMatchingPair.objects.create(
            question=self.question,
            question_text="Cat",
            answer_text="Meow",
            position=1,
        )
        self.enrollment = Enrollment.objects.create(
            user=self.user,
            program=self.program,
            status="active",
        )

    def test_student_quiz_start_hides_raw_pair_ids(self):
        self.client.login(username="student_secure", password="password123")
        response = self.client.get(
            reverse("core:student.quiz_start", kwargs={"quiz_id": self.quiz.id}),
            HTTP_X_INERTIA=True,
        )
        self.assertEqual(response.status_code, 200)

        payload = response.json()
        question_data = next(
            q for q in payload["props"]["questions"] if q["id"] == self.question.id
        )

        left_ids = {str(item["id"]) for item in question_data["left_items"]}
        right_ids = {str(item["id"]) for item in question_data["right_items"]}
        raw_pair_ids = {str(self.pair_1.id), str(self.pair_2.id)}

        self.assertTrue(left_ids.isdisjoint(raw_pair_ids))
        self.assertTrue(right_ids.isdisjoint(raw_pair_ids))
        self.assertTrue(left_ids.isdisjoint(right_ids))

    def test_image_matching_rejects_left_to_left_spoof_submission(self):
        attempt = QuizAttempt.objects.create(
            enrollment=self.enrollment,
            quiz=self.quiz,
            attempt_number=1,
            started_at=timezone.now(),
        )

        pairs = list(self.question.image_matching_pairs.all().order_by("position"))
        spoofed_answer = {
            self.question.get_image_matching_item_id(pair.id, attempt.id, "left"):
            self.question.get_image_matching_item_id(pair.id, attempt.id, "left")
            for pair in pairs
        }

        is_correct, points = self.question.check_answer(
            spoofed_answer, attempt_id=attempt.id
        )
        self.assertFalse(is_correct)
        self.assertEqual(points, 0)

    def test_image_matching_accepts_correct_token_mapping(self):
        attempt = QuizAttempt.objects.create(
            enrollment=self.enrollment,
            quiz=self.quiz,
            attempt_number=1,
            started_at=timezone.now(),
        )
        pairs = list(self.question.image_matching_pairs.all().order_by("position"))
        correct_answer = {
            self.question.get_image_matching_item_id(pair.id, attempt.id, "left"):
            self.question.get_image_matching_item_id(pair.id, attempt.id, "right")
            for pair in pairs
        }

        is_correct, points = self.question.check_answer(
            correct_answer, attempt_id=attempt.id
        )
        self.assertTrue(is_correct)
        self.assertEqual(points, self.question.points)

    def test_submit_endpoint_scores_spoof_mapping_incorrect(self):
        self.client.login(username="student_secure", password="password123")
        start_response = self.client.get(
            reverse("core:student.quiz_start", kwargs={"quiz_id": self.quiz.id}),
            HTTP_X_INERTIA=True,
        )
        self.assertEqual(start_response.status_code, 200)
        question_data = next(
            q
            for q in start_response.json()["props"]["questions"]
            if q["id"] == self.question.id
        )

        spoofed_mapping = {
            str(item["id"]): str(item["id"]) for item in question_data["left_items"]
        }
        submit_response = self.client.post(
            reverse("core:student.quiz_submit", kwargs={"quiz_id": self.quiz.id}),
            data=json.dumps({"answers": {str(self.question.id): spoofed_mapping}}),
            content_type="application/json",
        )
        self.assertEqual(submit_response.status_code, 302)

        attempt = QuizAttempt.objects.get(enrollment=self.enrollment, quiz=self.quiz)
        self.assertEqual(attempt.points_earned, 0)
