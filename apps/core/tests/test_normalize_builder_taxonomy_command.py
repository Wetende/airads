from io import StringIO

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

from apps.blueprints.models import AcademicBlueprint
from apps.core.models import Program
from apps.curriculum.models import CurriculumNode


class NormalizeBuilderTaxonomyCommandTests(TestCase):
    def _create_invalid_blueprint(self, name: str, hierarchy: list[str]):
        blueprint = AcademicBlueprint.objects.create(
            name=name,
            hierarchy_structure=["Unit", "Session"],
            grading_logic={"type": "weighted", "components": []},
        )
        # Bypass model validation to simulate legacy/production bad data.
        AcademicBlueprint.objects.filter(pk=blueprint.pk).update(
            hierarchy_structure=hierarchy
        )
        blueprint.refresh_from_db()
        return blueprint

    def _create_program_with_nodes(self, blueprint: AcademicBlueprint, code: str):
        program = Program.objects.create(
            blueprint=blueprint,
            name=f"Program {code}",
            code=code,
            description="test",
            level="diploma",
        )
        root = CurriculumNode(
            program=program,
            title="Root",
            node_type="Course",
            position=0,
        )
        root.save(skip_validation=True)

        child = CurriculumNode(
            program=program,
            parent=root,
            title="Child",
            node_type="Module",
            position=0,
            properties={"lesson_type": "text"},
        )
        child.save(skip_validation=True)
        return program, root, child

    def test_dry_run_reports_changes_without_mutating(self):
        blueprint = self._create_invalid_blueprint(
            "Legacy Online", ["Course", "Module", "Lesson"]
        )
        program, root, child = self._create_program_with_nodes(blueprint, "NBTC-DRY")

        output = StringIO()
        call_command(
            "normalize_builder_taxonomy",
            "--dry-run",
            "--mode",
            "online",
            "--program-id",
            str(program.id),
            stdout=output,
        )

        blueprint.refresh_from_db()
        root.refresh_from_db()
        child.refresh_from_db()

        self.assertEqual(blueprint.hierarchy_structure, ["Course", "Module", "Lesson"])
        self.assertEqual(root.node_type, "Course")
        self.assertEqual(child.node_type, "Module")
        self.assertIn("Dry run", output.getvalue())

    def test_apply_normalizes_blueprint_and_node_types(self):
        blueprint = self._create_invalid_blueprint(
            "Legacy Online Apply", ["Course", "Module", "Lesson"]
        )
        program, root, child = self._create_program_with_nodes(blueprint, "NBTC-APP")

        output = StringIO()
        call_command(
            "normalize_builder_taxonomy",
            "--apply",
            "--mode",
            "online",
            "--program-id",
            str(program.id),
            stdout=output,
        )

        blueprint.refresh_from_db()
        root.refresh_from_db()
        child.refresh_from_db()

        self.assertEqual(blueprint.hierarchy_structure, ["Section", "Lesson"])
        self.assertEqual(root.node_type, "Section")
        self.assertEqual(child.node_type, "Lesson")
        self.assertIn("Applied normalization", output.getvalue())

    def test_apply_aborts_when_depth_exceeds_two_tiers(self):
        blueprint = self._create_invalid_blueprint(
            "Legacy Deep", ["Course", "Module", "Lesson"]
        )
        program, root, child = self._create_program_with_nodes(blueprint, "NBTC-DEEP")

        grandchild = CurriculumNode(
            program=program,
            parent=child,
            title="Grandchild",
            node_type="Lesson",
            position=0,
        )
        grandchild.save(skip_validation=True)

        with self.assertRaises(CommandError):
            call_command(
                "normalize_builder_taxonomy",
                "--apply",
                "--mode",
                "online",
                "--program-id",
                str(program.id),
            )

        blueprint.refresh_from_db()
        root.refresh_from_db()
        child.refresh_from_db()
        grandchild.refresh_from_db()

        # Ensure no partial updates happened.
        self.assertEqual(blueprint.hierarchy_structure, ["Course", "Module", "Lesson"])
        self.assertEqual(root.node_type, "Course")
        self.assertEqual(child.node_type, "Module")
        self.assertEqual(grandchild.node_type, "Lesson")
