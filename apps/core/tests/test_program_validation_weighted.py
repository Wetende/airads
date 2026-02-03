from django.test import TestCase

from apps.assessments.models import Assignment, Quiz
from apps.blueprints.models import AcademicBlueprint
from apps.core.models import Program, User
from apps.core.services.validation import ProgramValidationService
from apps.curriculum.models import CurriculumNode


class ProgramValidationWeightedTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="inst",
            email="inst@test.com",
            password="password",
        )
        self.blueprint = AcademicBlueprint.objects.create(
            name="Weighted",
            hierarchy_structure=["lesson", "quiz", "assignment"],
            grading_logic={"type": "weighted", "components": []},
        )
        self.program = Program.objects.create(
            name="Test Program",
            code="TEST-101",
            blueprint=self.blueprint,
            description="desc",
            thumbnail="thumb.png",
            level="beginner",
        )
        self.program.instructors.add(self.user)

        self.validator = ProgramValidationService()

    def test_weighted_skips_when_no_assessments(self):
        errors = self.validator.validate(self.program)
        self.assertFalse(any("assessment weight" in e.lower() for e in errors))

    def test_weighted_includes_quiz_nodes_by_node_type(self):
        node = CurriculumNode.objects.create(
            program=self.program,
            title="Quiz",
            node_type="quiz",
            properties={},
        )
        Quiz.objects.create(node=node, title="Quiz", weight=40)
        Assignment.objects.create(
            program=self.program,
            title="A1",
            description="d",
            instructions="i" * 120,
            weight=40,
        )

        errors = self.validator.validate(self.program)
        self.assertTrue(any("Total assessment weight is 80%" in e for e in errors))

    def test_weighted_includes_quiz_nodes_by_properties_lesson_type(self):
        node = CurriculumNode.objects.create(
            program=self.program,
            title="Quiz",
            node_type="lesson",
            properties={"lesson_type": "quiz"},
        )
        Quiz.objects.create(node=node, title="Quiz", weight=60)
        Assignment.objects.create(
            program=self.program,
            title="A1",
            description="d",
            instructions="i" * 120,
            weight=30,
        )

        errors = self.validator.validate(self.program)
        self.assertTrue(any("Total assessment weight is 90%" in e for e in errors))
