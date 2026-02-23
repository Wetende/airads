from django.test import SimpleTestCase

from apps.blueprints.exceptions import InvalidHierarchyStructureException
from apps.blueprints.services import BlueprintValidationService
from apps.core.taxonomy import MODE_BUILDER_HIERARCHY, validate_builder_hierarchy
from apps.platform.services import MODE_BLUEPRINTS


class BuilderTaxonomyContractTests(SimpleTestCase):
    def test_reserved_tier1_container_labels_are_rejected(self):
        is_valid, reason = validate_builder_hierarchy(["Course", "Lesson"])
        self.assertFalse(is_valid)
        self.assertIn("reserved", reason.lower())

    def test_valid_two_tier_hierarchy_is_accepted(self):
        is_valid, reason = validate_builder_hierarchy(["Unit", "Session"])
        self.assertTrue(is_valid)
        self.assertIsNone(reason)

    def test_blueprint_validation_service_rejects_reserved_container(self):
        service = BlueprintValidationService()
        with self.assertRaisesMessage(InvalidHierarchyStructureException, "reserved"):
            service.validate_hierarchy_structure(["Program", "Session"])

    def test_mode_blueprint_defaults_are_two_tier_and_valid(self):
        self.assertTrue(MODE_BUILDER_HIERARCHY)
        for mode, template in MODE_BLUEPRINTS.items():
            hierarchy = template["hierarchy_structure"]
            is_valid, reason = validate_builder_hierarchy(hierarchy)
            self.assertTrue(
                is_valid,
                msg=f"Mode '{mode}' hierarchy invalid: {hierarchy} ({reason})",
            )
            self.assertEqual(
                len(hierarchy),
                2,
                msg=f"Mode '{mode}' hierarchy must have exactly 2 labels.",
            )
