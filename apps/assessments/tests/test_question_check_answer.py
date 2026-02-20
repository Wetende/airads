from django.test import TestCase

from apps.assessments.models import Question, QuestionOption, Quiz
from apps.core.models import Program
from apps.curriculum.models import CurriculumNode


class QuestionCheckAnswerTest(TestCase):
    def setUp(self):
        self.program = Program.objects.create(name="Grading Program", code="GRADING-101")
        self.node = CurriculumNode.objects.create(
            program=self.program,
            title="Quiz Node",
            node_type="Session",
            properties={"lesson_type": "quiz"},
        )
        self.quiz = Quiz.objects.create(node=self.node, title="Grading Quiz")

    def test_ordering_requires_items_array(self):
        question = Question.objects.create(
            quiz=self.quiz,
            question_type="ordering",
            text="Order steps",
            points=3,
            position=0,
            answer_data={"correct_order": ["Step 1", "Step 2"]},
        )

        is_correct, points = question.check_answer(["Step 1", "Step 2"])

        self.assertFalse(is_correct)
        self.assertEqual(points, 0)

    def test_mcq_grades_by_position_only(self):
        question = Question.objects.create(
            quiz=self.quiz,
            question_type="mcq",
            text="Pick one",
            points=1,
            position=0,
            answer_data={},
        )
        QuestionOption.objects.create(
            question=question,
            text="A",
            is_correct=False,
            position=0,
        )
        correct_option = QuestionOption.objects.create(
            question=question,
            text="B",
            is_correct=True,
            position=1,
        )

        by_position, position_points = question.check_answer(1)
        by_option_id, id_points = question.check_answer(correct_option.id)

        self.assertTrue(by_position)
        self.assertEqual(position_points, 1)
        self.assertFalse(by_option_id)
        self.assertEqual(id_points, 0)

    def test_mcq_multi_grades_by_positions_only(self):
        question = Question.objects.create(
            quiz=self.quiz,
            question_type="mcq_multi",
            text="Pick all that apply",
            points=2,
            position=1,
            answer_data={},
        )
        QuestionOption.objects.create(
            question=question,
            text="A",
            is_correct=False,
            position=0,
        )
        correct_option = QuestionOption.objects.create(
            question=question,
            text="B",
            is_correct=True,
            position=1,
        )
        QuestionOption.objects.create(
            question=question,
            text="C",
            is_correct=False,
            position=2,
        )

        by_position, position_points = question.check_answer([1])
        by_option_id, id_points = question.check_answer([correct_option.id])

        self.assertTrue(by_position)
        self.assertEqual(position_points, 2)
        self.assertFalse(by_option_id)
        self.assertEqual(id_points, 0)

    def test_mcq_without_options_fails_closed(self):
        question = Question.objects.create(
            quiz=self.quiz,
            question_type="mcq",
            text="No options",
            points=1,
            position=2,
            answer_data={"correct": 0},
        )

        is_correct, points = question.check_answer(0)

        self.assertFalse(is_correct)
        self.assertEqual(points, 0)
