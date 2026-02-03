
from django.test import TestCase
from apps.core.models import Program, User
from apps.curriculum.models import CurriculumNode
from apps.assessments.models import Quiz, Question, QuestionGapAnswer, QuestionImageMatchingPair
from apps.core.views import _sync_quiz_questions

class SyncQuizQuestionsTest(TestCase):
    def setUp(self):
        # Setup basic requirements
        self.user = User.objects.create_user(username='instructor', email='inst@test.com', password='password')
        self.program = Program.objects.create(name="Test Program", code="TEST-101")
        self.program.instructors.add(self.user)
        self.node = CurriculumNode.objects.create(
            program=self.program,
            title="Test Quiz Node",
            node_type="quiz",
            properties={}
        )

    def test_sync_fill_blank_question(self):
        """
        Test that fill_blank questions correctly save gaps.
        """
        questions_data = [
            {
                "id": "temp_1",
                "type": "fill_blank",
                "text": "The capital of France is {{blank}}.",
                "points": 5,
                "gaps": [
                    {
                        "gap_index": 0,
                        "accepted_answers": ["Paris", "paris"]
                    }
                ]
            }
        ]

        _sync_quiz_questions(self.node, questions_data)

        # Verify Quiz created
        quiz = Quiz.objects.get(node=self.node)
        self.assertEqual(quiz.questions.count(), 1)

        # Verify Question created
        question = quiz.questions.first()
        self.assertEqual(question.question_type, "fill_blank")
        self.assertEqual(question.text, "The capital of France is {{blank}}.")

        # Verify Gaps created
        gaps = QuestionGapAnswer.objects.filter(question=question)
        self.assertEqual(gaps.count(), 1, "Should create 1 gap answer record")
        
        gap = gaps.first()
        if gap:
            self.assertEqual(gap.gap_index, 0)
            self.assertIn("Paris", gap.accepted_answers)

    def test_sync_ordering_question(self):
        """
        Test that ordering questions correctly save items.
        """
        questions_data = [
            {
                "id": "temp_2",
                "type": "ordering",
                "text": "Order the numbers",
                "points": 3,
                "items": ["One", "Two", "Three"],  # The correct order
                "correct_order": ["One", "Two", "Three"] # Legacy/fallback
            }
        ]

        _sync_quiz_questions(self.node, questions_data)

        quiz = Quiz.objects.get(node=self.node)
        question = quiz.questions.first()
        
        self.assertEqual(question.question_type, "ordering")
        self.assertEqual(question.answer_data.get("items"), ["One", "Two", "Three"])

    def test_sync_all_quiz_settings(self):
        """
        Test that all frontend settings from AssessmentEditor are synced to Quiz model.
        This ensures full integration between frontend toggles and backend storage.
        """
        # Setup node with all settings enabled
        self.node.properties = {
            "passing_grade": 85,
            "quiz_duration": 45,
            "max_attempts": 3,
            "randomize_questions": True,
            "randomize_answers": True,  # Maps to shuffle_options
            "show_correct_answer": True,  # Maps to show_answers_after_submit
            "quiz_time_unit": "Hours",
            "quiz_style": "pagination",
            "quiz_attempt_history": True,  # Maps to show_attempt_history
            "retake_after_pass": True,  # Maps to allow_retake_after_pass
            "points_cut_after_retake": 15,  # Maps to retake_penalty_percent
            "total_points_override": 100,
            "description": "Test quiz description",
            "questions": [
                {
                    "id": "temp_1",
                    "type": "mcq",
                    "text": "Sample question",
                    "points": 10,
                    "options": ["A", "B", "C"],
                    "correct": 0
                }
            ]
        }
        self.node.save()

        _sync_quiz_questions(self.node, self.node.properties.get("questions", []))

        quiz = Quiz.objects.get(node=self.node)
        
        # Verify all basic settings
        self.assertEqual(quiz.pass_threshold, 85)
        self.assertEqual(quiz.time_limit_minutes, 45)
        self.assertEqual(quiz.max_attempts, 3)
        self.assertTrue(quiz.randomize_questions)
        self.assertEqual(quiz.description, "Test quiz description")
        
        # Verify new settings that were previously not synced
        self.assertTrue(quiz.shuffle_options, "shuffle_options should be True")
        self.assertTrue(quiz.show_answers_after_submit, "show_answers_after_submit should be True")
        self.assertEqual(quiz.time_unit, "hours")
        self.assertEqual(quiz.quiz_style, "pagination")
        self.assertTrue(quiz.show_attempt_history, "show_attempt_history should be True")
        self.assertTrue(quiz.allow_retake_after_pass, "allow_retake_after_pass should be True")
        self.assertEqual(quiz.retake_penalty_percent, 15)
        self.assertEqual(quiz.total_points_override, 100)
        
        # Verify get_total_points respects override
        self.assertEqual(quiz.get_total_points(), 100)

    def test_sync_image_matching_question_creates_pairs(self):
        questions_data = [
            {
                "id": "temp_img_1",
                "type": "image_matching",
                "text": "Match images",
                "points": 4,
                "image_pairs": [
                    {
                        "question_text": "Dog",
                        "question_image": "/media/quiz_images/1/1/dog.png",
                        "answer_text": "Bark",
                        "answer_image": "/media/quiz_images/1/1/bark.png",
                        "explanation": "Dogs bark",
                        "position": 0,
                    },
                    {
                        "question_text": "Cat",
                        "question_image": "/media/quiz_images/1/1/cat.png",
                        "answer_text": "Meow",
                        "answer_image": "/media/quiz_images/1/1/meow.png",
                        "explanation": "Cats meow",
                        "position": 1,
                    },
                ],
            }
        ]

        _sync_quiz_questions(self.node, questions_data)

        quiz = Quiz.objects.get(node=self.node)
        self.assertEqual(quiz.questions.count(), 1)
        q = quiz.questions.first()
        self.assertEqual(q.question_type, "image_matching")

        pairs = QuestionImageMatchingPair.objects.filter(question=q).order_by("position")
        self.assertEqual(pairs.count(), 2)
        self.assertEqual(pairs[0].question_text, "Dog")
        self.assertEqual(pairs[0].answer_text, "Bark")
