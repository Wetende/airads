import json
from io import StringIO

from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from apps.assessments.models import (
    Assignment,
    Question,
    QuestionOption,
    Quiz,
    QuizAttempt,
)
from apps.blueprints.models import AcademicBlueprint
from apps.core.models import Program, User
from apps.curriculum.models import CurriculumNode
from apps.curriculum.services import CoursePublishValidationService
from apps.progression.models import Enrollment, InstructorAssignment, NodeCompletion


class QuizLinkIntegrityTest(TestCase):
    def _create_program(self, name="Program A", code="PRG-A"):
        blueprint = AcademicBlueprint.objects.create(
            name=f"{name} Blueprint",
            hierarchy_structure=["Year", "Session"],
            grading_logic={
                "type": "weighted",
                "components": [{"name": "Quiz", "weight": 100, "maxScore": 100}],
            },
        )
        return Program.objects.create(
            blueprint=blueprint,
            name=name,
            code=code,
            description="Program description",
            level="beginner",
        )

    def test_backfill_quiz_links_dry_run_does_not_mutate(self):
        program = self._create_program(name="Backfill Dry", code="BACK-DRY")
        node = CurriculumNode.objects.create(
            program=program,
            title="Legacy Quiz",
            node_type="Session",
            properties={
                "lesson_type": "quiz",
                "questions": [
                    {
                        "id": "temp_1",
                        "type": "mcq",
                        "text": "Legacy question",
                        "options": ["A", "B"],
                        "correct": 1,
                    }
                ],
            },
        )

        output = StringIO()
        call_command("backfill_quiz_links", "--dry-run", stdout=output)

        node.refresh_from_db()
        self.assertIsNone((node.properties or {}).get("quiz_id"))
        self.assertFalse(Quiz.objects.filter(node=node).exists())

        summary = output.getvalue()
        self.assertIn("eligible=1", summary)
        self.assertIn("updated=0", summary)

    def test_backfill_quiz_links_updates_eligible_nodes(self):
        program = self._create_program(name="Backfill Apply", code="BACK-APP")
        node = CurriculumNode.objects.create(
            program=program,
            title="Legacy Quiz",
            node_type="Session",
            properties={
                "lesson_type": "quiz",
                "questions": [
                    {
                        "id": "temp_2",
                        "type": "mcq",
                        "text": "Legacy question",
                        "options": ["A", "B"],
                        "correct": 1,
                    }
                ],
            },
        )

        output = StringIO()
        call_command("backfill_quiz_links", stdout=output)

        node.refresh_from_db()
        self.assertIsNotNone((node.properties or {}).get("quiz_id"))
        self.assertTrue(Quiz.objects.filter(node=node).exists())

        summary = output.getvalue()
        self.assertIn("eligible=1", summary)
        self.assertIn("updated=1", summary)

    def test_validation_flags_quiz_with_questions_but_missing_quiz_id(self):
        program = self._create_program(name="Validation", code="VAL-001")
        quiz_node = CurriculumNode.objects.create(
            program=program,
            title="Knowledge Check",
            node_type="Session",
            properties={
                "lesson_type": "quiz",
                "questions": [
                    {
                        "id": "temp_3",
                        "type": "mcq",
                        "text": "What is true?",
                        "options": ["Yes", "No"],
                        "correct": 0,
                    }
                ],
            },
        )

        result = CoursePublishValidationService().validate_for_publish(program)
        errors = result.get("errors", [])

        self.assertTrue(
            any(
                err.get("type") == "missing_quiz_link"
                and err.get("node_id") == quiz_node.id
                for err in errors
            )
        )

    def test_instructor_node_create_syncs_quiz_questions_on_create(self):
        from django.contrib.auth.models import Group

        instructor = User.objects.create_user(
            username="inst.quiz",
            email="inst.quiz@test.com",
            password="password123",
        )
        group, _ = Group.objects.get_or_create(name="Instructors")
        instructor.groups.add(group)

        program = self._create_program(name="Create Sync", code="SYNC-001")
        InstructorAssignment.objects.create(instructor=instructor, program=program)

        root = CurriculumNode.objects.create(
            program=program,
            title="Year 1",
            node_type="Year",
        )

        self.client.force_login(instructor)
        url = reverse("core:instructor.node_create", kwargs={"program_id": program.id})
        payload = {
            "title": "Knowledge Check",
            "parent_id": root.id,
            "properties": {
                "lesson_type": "quiz",
                "questions": [
                    {
                        "id": "temp_1",
                        "type": "mcq",
                        "text": "What does CPU stand for?",
                        "points": 1,
                        "options": [
                            "Computer Processing Unit",
                            "Central Processing Unit",
                        ],
                        "correct": 1,
                    }
                ],
            },
        }

        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertIn(response.status_code, (200, 302))

        node = CurriculumNode.objects.get(program=program, title="Knowledge Check")
        self.assertIsNotNone((node.properties or {}).get("quiz_id"))

        quiz = Quiz.objects.get(node=node)
        self.assertEqual(quiz.questions.count(), 1)

    def test_student_quiz_submit_marks_course_player_node_complete(self):
        program = self._create_program(name="Player Context", code="PLY-CTX")
        student = User.objects.create_user(
            username="student.quiz",
            email="student.quiz@test.com",
            password="password123",
        )
        enrollment = Enrollment.objects.create(
            user=student,
            program=program,
            status="active",
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Context Quiz Node",
            node_type="Session",
            properties={"lesson_type": "quiz"},
            completion_rules={"is_completable": True, "type": "quiz_pass"},
        )
        quiz = Quiz.objects.create(
            node=node,
            title="Context Quiz",
            is_published=True,
            pass_threshold=70,
            max_attempts=3,
        )
        question = Question.objects.create(
            quiz=quiz,
            question_type="mcq",
            text="Pick one",
            points=1,
            position=0,
            answer_data={"correct": 0},
        )
        correct_option = QuestionOption.objects.create(
            question=question,
            text="Correct",
            is_correct=True,
            position=0,
        )
        wrong_option = QuestionOption.objects.create(
            question=question,
            text="Wrong",
            is_correct=False,
            position=1,
        )
        QuizAttempt.objects.create(
            enrollment=enrollment,
            quiz=quiz,
            attempt_number=1,
            started_at=timezone.now(),
        )

        self.client.force_login(student)
        response = self.client.post(
            reverse("core:student.quiz_submit", kwargs={"quiz_id": quiz.id}),
            data=json.dumps(
                {
                    "answers": {str(question.id): 0},
                    "enrollment_id": enrollment.id,
                    "node_id": node.id,
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 302)
        self.assertIn(
            f"/student/quiz/{quiz.id}/results/?enrollment_id={enrollment.id}&node_id={node.id}",
            response.url,
        )
        self.assertTrue(
            NodeCompletion.objects.filter(
                enrollment=enrollment,
                node=node,
            ).exists()
        )

    def test_instructor_node_create_syncs_assignment_and_question_links(self):
        from django.contrib.auth.models import Group

        instructor = User.objects.create_user(
            username="inst.assignment",
            email="inst.assignment@test.com",
            password="password123",
        )
        group, _ = Group.objects.get_or_create(name="Instructors")
        instructor.groups.add(group)

        program = self._create_program(name="Assignment Sync", code="ASSIGN-SYNC")
        InstructorAssignment.objects.create(instructor=instructor, program=program)

        root = CurriculumNode.objects.create(
            program=program,
            title="Year 1",
            node_type="Year",
        )

        self.client.force_login(instructor)
        url = reverse("core:instructor.node_create", kwargs={"program_id": program.id})
        payload = {
            "title": "Hybrid Assignment",
            "parent_id": root.id,
            "properties": {
                "lesson_type": "assignment",
                "assignment_mode": "mixed",
                "submission_type": "text_entry",
                "instructions": "Explain your approach in detail.",
                "questions": [
                    {
                        "id": "temp_1",
                        "type": "mcq",
                        "text": "Which is correct?",
                        "points": 1,
                        "options": ["A", "B"],
                        "correct": 1,
                    }
                ],
            },
        }
        response = self.client.post(
            url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertIn(response.status_code, (200, 302))

        node = CurriculumNode.objects.get(program=program, title="Hybrid Assignment")
        props = node.properties or {}
        self.assertIsNotNone(props.get("assignment_id"))
        self.assertIsNotNone(props.get("quiz_id"))
        self.assertEqual(props.get("assignment_mode"), "mixed")
        self.assertEqual(props.get("submission_type"), "text")

        self.assertTrue(Assignment.objects.filter(pk=props.get("assignment_id")).exists())
        self.assertTrue(Quiz.objects.filter(pk=props.get("quiz_id")).exists())

    def test_backfill_assignment_modes_dry_run_does_not_mutate(self):
        program = self._create_program(name="Backfill Assignment Dry", code="ASSIGN-DRY")
        node = CurriculumNode.objects.create(
            program=program,
            title="Legacy Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "submission_type": "text_entry",
                "questions": [
                    {
                        "id": "temp_1",
                        "type": "mcq",
                        "text": "Legacy assignment question",
                        "options": ["A", "B"],
                        "correct": 0,
                    }
                ],
            },
        )

        output = StringIO()
        call_command("backfill_assignment_modes", "--dry-run", stdout=output)

        node.refresh_from_db()
        props = node.properties or {}
        self.assertIsNone(props.get("assignment_id"))
        self.assertIsNone(props.get("quiz_id"))
        self.assertNotIn("assignment_mode", props)
        self.assertEqual(props.get("submission_type"), "text_entry")
        self.assertIn("eligible=1", output.getvalue())
        self.assertIn("updated=0", output.getvalue())

    def test_backfill_assignment_modes_updates_nodes(self):
        program = self._create_program(name="Backfill Assignment Apply", code="ASSIGN-APP")
        node = CurriculumNode.objects.create(
            program=program,
            title="Legacy Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "submission_type": "text_entry",
                "questions": [
                    {
                        "id": "temp_2",
                        "type": "mcq",
                        "text": "Legacy assignment question",
                        "options": ["A", "B"],
                        "correct": 0,
                    }
                ],
            },
        )

        output = StringIO()
        call_command("backfill_assignment_modes", stdout=output)

        node.refresh_from_db()
        props = node.properties or {}
        self.assertEqual(props.get("assignment_mode"), "mixed")
        self.assertEqual(props.get("typed_response_mode"), "submission_text")
        self.assertTrue((props.get("assessment_prompt") or "").strip())
        self.assertEqual(props.get("submission_type"), "text")
        self.assertIsNotNone(props.get("assignment_id"))
        self.assertIsNotNone(props.get("quiz_id"))
        self.assertIn("eligible=1", output.getvalue())
        self.assertIn("updated=1", output.getvalue())

    def test_backfill_assignment_modes_preserves_explicit_question_only(self):
        program = self._create_program(name="Backfill Assignment Explicit", code="ASSIGN-EXP")
        node = CurriculumNode.objects.create(
            program=program,
            title="Question Only Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "assignment_mode": "question_only",
                "typed_response_mode": "submission_text",
                "assessment_prompt": "Respond to the prompt",
                "questions": [
                    {
                        "id": "temp_2",
                        "type": "short_answer",
                        "text": "Explain",
                        "keywords": [],
                    }
                ],
            },
        )

        call_command("backfill_assignment_modes")
        node.refresh_from_db()
        props = node.properties or {}

        self.assertEqual(props.get("assignment_mode"), "question_only")
        self.assertEqual(props.get("typed_response_mode"), "submission_text")
        self.assertIsNotNone(props.get("quiz_id"))

    def test_sync_assignment_generates_single_short_answer_for_submission_prompt_mode(self):
        from apps.core.views import _sync_assignment

        program = self._create_program(name="Prompt Sync", code="PROMPT-SYNC")
        node = CurriculumNode.objects.create(
            program=program,
            title="Typed Prompt Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "assignment_mode": "submission_only",
                "typed_response_mode": "short_answer_question",
                "assessment_prompt": "<p>Explain your leadership style.</p>",
                "instructions": "Supporting notes",
                "submission_type": "text",
            },
        )

        _sync_assignment(node)
        node.refresh_from_db()
        props = node.properties or {}

        self.assertEqual(props.get("typed_response_mode"), "short_answer_question")
        self.assertEqual(props.get("assignment_mode"), "submission_only")
        self.assertTrue(props.get("quiz_id"))
        self.assertEqual(len(props.get("questions", [])), 1)
        generated = props["questions"][0]
        self.assertEqual(generated.get("type"), "short_answer")
        self.assertTrue(generated.get("generated_from_assessment_prompt"))

    def test_student_quiz_submit_completes_submission_only_short_answer_assignment(self):
        program = self._create_program(name="Prompt Completion", code="PROMPT-COMP")
        student = User.objects.create_user(
            username="student.prompt",
            email="student.prompt@test.com",
            password="password123",
        )
        enrollment = Enrollment.objects.create(
            user=student,
            program=program,
            status="active",
        )

        node = CurriculumNode.objects.create(
            program=program,
            title="Typed Prompt Assignment Node",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "assignment_mode": "submission_only",
                "typed_response_mode": "short_answer_question",
                "assessment_prompt": "Describe your plan",
            },
            completion_rules={"is_completable": True, "type": "quiz_pass"},
        )

        quiz = Quiz.objects.create(
            node=node,
            title="Prompt Quiz",
            is_published=True,
            pass_threshold=0,
            max_attempts=3,
        )
        question = Question.objects.create(
            quiz=quiz,
            question_type="short_answer",
            text="Describe your plan",
            points=1,
            position=0,
            answer_data={"keywords": [], "manual_grading": True},
        )
        node.properties["quiz_id"] = quiz.id
        node.properties["questions"] = [
            {
                "id": "auto_prompt",
                "db_id": question.id,
                "type": "short_answer",
                "text": "Describe your plan",
                "generated_from_assessment_prompt": True,
            }
        ]
        node.save(update_fields=["properties"])

        QuizAttempt.objects.create(
            enrollment=enrollment,
            quiz=quiz,
            attempt_number=1,
            started_at=timezone.now(),
        )

        self.client.force_login(student)
        response = self.client.post(
            reverse("core:student.quiz_submit", kwargs={"quiz_id": quiz.id}),
            data=json.dumps(
                {
                    "answers": {str(question.id): "My typed response"},
                    "enrollment_id": enrollment.id,
                    "node_id": node.id,
                }
            ),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 302)
        self.assertTrue(
            NodeCompletion.objects.filter(
                enrollment=enrollment,
                node=node,
            ).exists()
        )

    def test_student_assignment_view_fallback_uses_published_source_node(self):
        program = self._create_program(name="Assignment Source", code="ASSIGN-SOURCE")
        student = User.objects.create_user(
            username="student.assignment",
            email="student.assignment@test.com",
            password="password123",
        )
        Enrollment.objects.create(
            user=student,
            program=program,
            status="active",
        )
        assignment = Assignment.objects.create(
            program=program,
            title="A5",
            description="Desc",
            instructions="Published assignment instructions",
            weight=20,
            submission_type="text",
            allowed_file_types=[],
            is_published=True,
        )

        CurriculumNode.objects.create(
            program=program,
            title="Draft Assignment Node",
            node_type="Session",
            position=0,
            is_published=False,
            properties={
                "lesson_type": "assignment",
                "assignment_id": assignment.id,
                "assessment_prompt": "DRAFT prompt",
            },
        )
        CurriculumNode.objects.create(
            program=program,
            title="Published Assignment Node",
            node_type="Session",
            position=1,
            is_published=True,
            properties={
                "lesson_type": "assignment",
                "assignment_id": assignment.id,
                "assessment_prompt": "Published prompt",
            },
        )

        self.client.force_login(student)
        response = self.client.get(
            reverse("core:student.assignment", kwargs={"assignment_id": assignment.id}),
            HTTP_X_INERTIA=True,
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(
            data["props"]["assignment"]["assessmentPrompt"],
            "Published prompt",
        )

    def test_validation_flags_assignment_questions_without_quiz_link(self):
        program = self._create_program(name="Assignment Validation", code="ASSIGN-VAL")
        assignment = Assignment.objects.create(
            program=program,
            title="A1",
            description="Desc",
            instructions="Instructions",
            weight=20,
            submission_type="text",
            allowed_file_types=[],
            is_published=True,
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Mixed Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "assignment_mode": "mixed",
                "assignment_id": assignment.id,
                "submission_type": "text",
                "questions": [
                    {
                        "id": "temp_3",
                        "type": "mcq",
                        "text": "Question",
                        "options": ["A", "B"],
                        "correct": 0,
                    }
                ],
            },
        )

        result = CoursePublishValidationService().validate_for_publish(program)
        errors = result.get("errors", [])
        self.assertTrue(
            any(
                err.get("type") == "missing_assignment_question_link"
                and err.get("node_id") == node.id
                for err in errors
            )
        )

    def test_validation_flags_legacy_submission_type_mapping(self):
        program = self._create_program(name="Submission Mapping", code="ASSIGN-MAP")
        assignment = Assignment.objects.create(
            program=program,
            title="A2",
            description="Desc",
            instructions="Instructions",
            weight=20,
            submission_type="file",
            allowed_file_types=["pdf"],
            is_published=True,
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Submission Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "assignment_mode": "submission_only",
                "assignment_id": assignment.id,
                "submission_type": "file_upload",
                "instructions": "Legacy submission mode.",
            },
        )

        result = CoursePublishValidationService().validate_for_publish(program)
        errors = result.get("errors", [])
        self.assertTrue(
            any(
                err.get("type") == "invalid_submission_type_mapping"
                and err.get("node_id") == node.id
                for err in errors
            )
        )

    def test_validation_flags_missing_assessment_prompt(self):
        program = self._create_program(name="Missing Prompt", code="ASSIGN-PROMPT")
        assignment = Assignment.objects.create(
            program=program,
            title="A3",
            description="Desc",
            instructions="",
            weight=20,
            submission_type="text",
            allowed_file_types=[],
            is_published=True,
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Submission Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "assignment_mode": "submission_only",
                "typed_response_mode": "submission_text",
                "submission_type": "text",
                "assignment_id": assignment.id,
                "assessment_prompt": "",
                "instructions": "",
            },
        )

        result = CoursePublishValidationService().validate_for_publish(program)
        errors = result.get("errors", [])
        self.assertTrue(
            any(
                err.get("type") == "missing_assessment_prompt"
                and err.get("node_id") == node.id
                for err in errors
            )
        )

    def test_validation_flags_missing_quiz_link_for_submission_only_prompt_question_path(
        self,
    ):
        program = self._create_program(name="Prompt Link Missing", code="ASSIGN-PQL")
        Assignment.objects.create(
            program=program,
            title="A4",
            description="Desc",
            instructions="",
            weight=20,
            submission_type="text",
            allowed_file_types=[],
            is_published=True,
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Prompt Assignment",
            node_type="Session",
            properties={
                "lesson_type": "assignment",
                "assignment_mode": "submission_only",
                "typed_response_mode": "short_answer_question",
                "assessment_prompt": "Describe your approach.",
                "questions": [
                    {
                        "id": "auto_prompt",
                        "type": "short_answer",
                        "text": "Describe your approach.",
                        "generated_from_assessment_prompt": True,
                    }
                ],
            },
        )

        result = CoursePublishValidationService().validate_for_publish(program)
        errors = result.get("errors", [])
        self.assertTrue(
            any(
                err.get("type") == "missing_assignment_question_link"
                and err.get("node_id") == node.id
                for err in errors
            )
        )

    def test_student_quiz_save_persists_in_progress_answers(self):
        program = self._create_program(name="Quiz Save", code="QUIZ-SAVE")
        student = User.objects.create_user(
            username="student.save",
            email="student.save@test.com",
            password="password123",
        )
        enrollment = Enrollment.objects.create(
            user=student,
            program=program,
            status="active",
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Draft Quiz Node",
            node_type="Session",
            properties={"lesson_type": "quiz"},
        )
        quiz = Quiz.objects.create(
            node=node,
            title="Draft Quiz",
            is_published=True,
            max_attempts=3,
        )
        question = Question.objects.create(
            quiz=quiz,
            question_type="mcq",
            text="Pick one",
            points=1,
            position=0,
            answer_data={"correct": 0},
        )
        QuizAttempt.objects.create(
            enrollment=enrollment,
            quiz=quiz,
            attempt_number=1,
            started_at=timezone.now(),
        )

        self.client.force_login(student)
        response = self.client.post(
            reverse("core:student.quiz_save", kwargs={"quiz_id": quiz.id}),
            data=json.dumps({"answers": {str(question.id): 0}}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload.get("saved"))

        attempt = QuizAttempt.objects.get(enrollment=enrollment, quiz=quiz)
        self.assertEqual(attempt.answers.get(str(question.id)), 0)
        self.assertIsNone(attempt.submitted_at)

    def test_student_quiz_submit_after_expiry_grades_saved_answers_only(self):
        program = self._create_program(name="Quiz Expiry", code="QUIZ-EXP")
        student = User.objects.create_user(
            username="student.expired",
            email="student.expired@test.com",
            password="password123",
        )
        enrollment = Enrollment.objects.create(
            user=student,
            program=program,
            status="active",
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Expired Quiz Node",
            node_type="Session",
            properties={"lesson_type": "quiz"},
        )
        quiz = Quiz.objects.create(
            node=node,
            title="Expired Quiz",
            is_published=True,
            max_attempts=3,
            time_limit_minutes=1,
            pass_threshold=70,
        )
        question = Question.objects.create(
            quiz=quiz,
            question_type="mcq",
            text="Pick one",
            points=1,
            position=0,
            answer_data={"correct": 0},
        )
        correct_option = QuestionOption.objects.create(
            question=question,
            text="Correct",
            is_correct=True,
            position=0,
        )
        wrong_option = QuestionOption.objects.create(
            question=question,
            text="Wrong",
            is_correct=False,
            position=1,
        )
        QuizAttempt.objects.create(
            enrollment=enrollment,
            quiz=quiz,
            attempt_number=1,
            started_at=timezone.now() - timezone.timedelta(minutes=2),
            answers={str(question.id): wrong_option.id},
        )

        self.client.force_login(student)
        response = self.client.post(
            reverse("core:student.quiz_submit", kwargs={"quiz_id": quiz.id}),
            data=json.dumps({"answers": {str(question.id): correct_option.id}}),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 302)
        attempt = QuizAttempt.objects.get(enrollment=enrollment, quiz=quiz)
        self.assertIsNotNone(attempt.submitted_at)
        self.assertEqual(attempt.answers.get(str(question.id)), wrong_option.id)
        self.assertEqual(attempt.points_earned, 0)
        self.assertEqual(float(attempt.score), 0.0)

    def test_quiz_results_preserves_zero_score_value(self):
        program = self._create_program(name="Quiz Result Zero", code="QUIZ-0")
        student = User.objects.create_user(
            username="student.zero",
            email="student.zero@test.com",
            password="password123",
        )
        enrollment = Enrollment.objects.create(
            user=student,
            program=program,
            status="active",
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Result Quiz Node",
            node_type="Session",
            properties={"lesson_type": "quiz"},
        )
        quiz = Quiz.objects.create(
            node=node,
            title="Result Quiz",
            is_published=True,
            max_attempts=3,
        )
        QuizAttempt.objects.create(
            enrollment=enrollment,
            quiz=quiz,
            attempt_number=1,
            started_at=timezone.now() - timezone.timedelta(minutes=5),
            submitted_at=timezone.now(),
            points_earned=0,
            points_possible=1,
            score=0,
            passed=False,
        )

        self.client.force_login(student)
        response = self.client.get(
            reverse("core:student.quiz_results", kwargs={"quiz_id": quiz.id}),
            HTTP_X_INERTIA=True,
        )

        self.assertEqual(response.status_code, 200)
        attempts = response.json()["props"]["attempts"]
        self.assertEqual(len(attempts), 1)
        self.assertEqual(attempts[0]["score"], 0.0)

    def test_course_player_sidebar_uses_latest_quiz_attempt_result(self):
        program = self._create_program(name="Sidebar Attempts", code="SIDEBAR-ATTEMPT")
        student = User.objects.create_user(
            username="student.sidebar",
            email="student.sidebar@test.com",
            password="password123",
        )
        enrollment = Enrollment.objects.create(
            user=student,
            program=program,
            status="active",
        )
        node = CurriculumNode.objects.create(
            program=program,
            title="Sidebar Quiz Node",
            node_type="Session",
            properties={"lesson_type": "quiz"},
            is_published=True,
        )
        quiz = Quiz.objects.create(
            node=node,
            title="Sidebar Quiz",
            is_published=True,
            max_attempts=3,
        )
        node.properties["quiz_id"] = quiz.id
        node.save(update_fields=["properties"])

        QuizAttempt.objects.create(
            enrollment=enrollment,
            quiz=quiz,
            attempt_number=1,
            started_at=timezone.now() - timezone.timedelta(minutes=10),
            submitted_at=timezone.now() - timezone.timedelta(minutes=9),
            points_earned=9,
            points_possible=10,
            score=90,
            passed=True,
        )
        QuizAttempt.objects.create(
            enrollment=enrollment,
            quiz=quiz,
            attempt_number=2,
            started_at=timezone.now() - timezone.timedelta(minutes=5),
            submitted_at=timezone.now() - timezone.timedelta(minutes=4),
            points_earned=4,
            points_possible=10,
            score=40,
            passed=False,
        )

        self.client.force_login(student)
        response = self.client.get(
            reverse(
                "progression:student.session",
                kwargs={"pk": enrollment.id, "node_id": node.id},
            ),
            HTTP_X_INERTIA=True,
        )

        self.assertEqual(response.status_code, 200)
        curriculum = response.json()["props"]["curriculum"]
        
        def find_node(nodes):
            for item in nodes:
                if item["id"] == node.id:
                    return item
                children = item.get("children") or []
                found = find_node(children)
                if found:
                    return found
            return None

        current_node = find_node(curriculum)

        self.assertIsNotNone(current_node)
        self.assertIn("lastAttempt", current_node)
        self.assertEqual(current_node["lastAttempt"]["number"], 2)
        self.assertEqual(current_node["lastAttempt"]["score"], 40.0)
        self.assertFalse(current_node["lastAttempt"]["passed"])
