import json
from collections import Counter

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.blueprints.models import AcademicBlueprint
from apps.core.models import Program
from apps.core.taxonomy import (
    MAX_BUILDER_DEPTH,
    MODE_BUILDER_HIERARCHY,
    get_mode_builder_hierarchy,
    validate_builder_hierarchy,
)
from apps.curriculum.models import CurriculumNode
from apps.platform.models import PlatformSettings


class Command(BaseCommand):
    help = (
        "Normalize builder taxonomy to 2-tier hierarchy "
        "(Tier 1 in Program.level; Tier 2+3 in curriculum tree)."
    )

    def add_arguments(self, parser):
        mode_choices = sorted(MODE_BUILDER_HIERARCHY.keys())

        parser.add_argument(
            "--apply",
            action="store_true",
            help="Apply normalization changes. Default behavior is dry-run.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview changes without mutating records (default).",
        )
        parser.add_argument(
            "--program-id",
            type=int,
            help="Limit analysis/normalization to one program.",
        )
        parser.add_argument(
            "--blueprint-id",
            type=int,
            help="Limit analysis/normalization to one blueprint.",
        )
        parser.add_argument(
            "--mode",
            choices=mode_choices,
            help="Override target mode mapping for container/content labels.",
        )
        parser.add_argument(
            "--output-json",
            help="Write a detailed report to this JSON file path.",
        )

    def handle(self, *args, **options):
        if options.get("apply") and options.get("dry_run"):
            raise CommandError("Use either --apply or --dry-run, not both.")

        apply_changes = bool(options.get("apply"))
        dry_run = not apply_changes

        program_id = options.get("program_id")
        blueprint_id = options.get("blueprint_id")
        selected_mode = (
            options.get("mode")
            or PlatformSettings.get_settings().deployment_mode
            or "custom"
        )
        target_hierarchy = get_mode_builder_hierarchy(selected_mode)

        programs = Program.objects.select_related("blueprint").all().order_by("id")
        if program_id:
            programs = programs.filter(id=program_id)
        if blueprint_id:
            programs = programs.filter(blueprint_id=blueprint_id)

        if program_id and not programs.exists():
            raise CommandError(f"Program {program_id} not found.")

        if blueprint_id:
            blueprints = AcademicBlueprint.objects.filter(id=blueprint_id)
        elif program_id:
            blueprints = AcademicBlueprint.objects.filter(
                id__in=programs.values_list("blueprint_id", flat=True)
            )
        else:
            blueprints = AcademicBlueprint.objects.filter(
                programs__isnull=False
            ).distinct()

        if not blueprints.exists():
            raise CommandError("No blueprints found for provided filters.")

        report = {
            "dryRun": dry_run,
            "apply": apply_changes,
            "filters": {
                "programId": program_id,
                "blueprintId": blueprint_id,
                "mode": selected_mode,
            },
            "targetHierarchy": target_hierarchy,
            "invalidBlueprints": [],
            "impactedPrograms": [],
            "summary": {
                "blueprintsScanned": 0,
                "blueprintsInvalid": 0,
                "programsScanned": 0,
                "programsImpacted": 0,
                "programsBlockedByDepth": 0,
                "nodesToRename": 0,
            },
        }

        blueprint_by_id = {bp.id: bp for bp in blueprints.order_by("id")}
        filtered_programs = list(programs)
        programs_by_blueprint = {}
        for program in filtered_programs:
            programs_by_blueprint.setdefault(program.blueprint_id, []).append(program)

        blocked_programs = []
        invalid_blueprints = []
        impacted_program_ids = set()
        nodes_to_rename = 0

        for blueprint in blueprint_by_id.values():
            report["summary"]["blueprintsScanned"] += 1
            is_valid, reason = validate_builder_hierarchy(blueprint.hierarchy_structure or [])
            blueprint_programs = programs_by_blueprint.get(blueprint.id)
            if blueprint_programs is None:
                blueprint_programs = list(
                    Program.objects.filter(blueprint=blueprint)
                    .select_related("blueprint")
                    .order_by("id")
                )

            if not is_valid:
                report["summary"]["blueprintsInvalid"] += 1
                invalid_blueprints.append(blueprint)
                report["invalidBlueprints"].append(
                    {
                        "id": blueprint.id,
                        "name": blueprint.name,
                        "currentHierarchy": blueprint.hierarchy_structure or [],
                        "reason": reason,
                        "proposedHierarchy": target_hierarchy,
                        "programIds": [p.id for p in blueprint_programs],
                    }
                )

            for program in blueprint_programs:
                report["summary"]["programsScanned"] += 1
                analysis = self._analyze_program(program, target_hierarchy)
                program_entry = {
                    "id": program.id,
                    "name": program.name,
                    "blueprintId": blueprint.id,
                    "blueprintValid": is_valid,
                    "depthDistribution": analysis["depth_distribution"],
                    "maxDepth": analysis["max_depth"],
                    "proposedHierarchy": (
                        target_hierarchy
                        if not is_valid
                        else (blueprint.hierarchy_structure or target_hierarchy)
                    ),
                    "renameCounts": analysis["rename_counts"],
                }
                report["impactedPrograms"].append(program_entry)

                if not is_valid:
                    impacted_program_ids.add(program.id)
                    nodes_to_rename += analysis["rename_counts"]["total"]
                    if analysis["max_depth"] > MAX_BUILDER_DEPTH:
                        blocked_programs.append(
                            {
                                "programId": program.id,
                                "programName": program.name,
                                "maxDepth": analysis["max_depth"],
                                "deepNodeIds": analysis["deep_node_ids"],
                            }
                        )

        report["summary"]["programsImpacted"] = len(impacted_program_ids)
        report["summary"]["programsBlockedByDepth"] = len(blocked_programs)
        report["summary"]["nodesToRename"] = nodes_to_rename
        if blocked_programs:
            report["blockedPrograms"] = blocked_programs

        if options.get("output_json"):
            with open(options["output_json"], "w", encoding="utf-8") as fh:
                json.dump(report, fh, indent=2, sort_keys=True)

        self.stdout.write(
            f"Mode mapping: {selected_mode} -> {target_hierarchy[0]} / {target_hierarchy[1]}"
        )
        self.stdout.write(
            "Summary: "
            f"blueprints_scanned={report['summary']['blueprintsScanned']}, "
            f"blueprints_invalid={report['summary']['blueprintsInvalid']}, "
            f"programs_scanned={report['summary']['programsScanned']}, "
            f"programs_impacted={report['summary']['programsImpacted']}, "
            f"blocked_by_depth={report['summary']['programsBlockedByDepth']}, "
            f"nodes_to_rename={report['summary']['nodesToRename']}"
        )

        if dry_run:
            self.stdout.write(self.style.WARNING("Dry run: no changes applied."))
            for entry in report["invalidBlueprints"]:
                self.stdout.write(
                    f"[DRY RUN] Blueprint {entry['id']} '{entry['name']}' "
                    f"{entry['currentHierarchy']} -> {entry['proposedHierarchy']}"
                )
            if blocked_programs:
                self.stdout.write(
                    self.style.WARNING(
                        "Deep-tree programs detected. Apply would be blocked until "
                        "manual flattening is completed."
                    )
                )
            return

        if blocked_programs:
            raise CommandError(
                "Cannot apply normalization. Found programs with depth > 1: "
                + ", ".join(
                    f"{p['programId']}:{p['programName']} (max_depth={p['maxDepth']})"
                    for p in blocked_programs
                )
            )

        if not invalid_blueprints:
            self.stdout.write(self.style.SUCCESS("No invalid blueprints found."))
            return

        with transaction.atomic():
            updated_blueprints = 0
            updated_nodes = 0

            for blueprint in invalid_blueprints:
                if (blueprint.hierarchy_structure or []) != target_hierarchy:
                    blueprint.hierarchy_structure = list(target_hierarchy)
                    blueprint.save(update_fields=["hierarchy_structure"])
                    updated_blueprints += 1

                programs_for_blueprint = Program.objects.filter(blueprint=blueprint).only("id")
                if program_id:
                    programs_for_blueprint = programs_for_blueprint.filter(id=program_id)

                for program in programs_for_blueprint:
                    changed = self._apply_program_node_type_mapping(
                        program.id, target_hierarchy
                    )
                    updated_nodes += changed

        self.stdout.write(
            self.style.SUCCESS(
                f"Applied normalization: blueprints_updated={updated_blueprints}, "
                f"nodes_updated={updated_nodes}"
            )
        )

    def _analyze_program(self, program, target_hierarchy):
        rows = list(
            CurriculumNode.objects.filter(program=program)
            .order_by("id")
            .values("id", "parent_id", "node_type")
        )
        if not rows:
            return {
                "max_depth": -1,
                "depth_distribution": {},
                "rename_counts": {"depth0": 0, "depth1": 0, "total": 0},
                "deep_node_ids": [],
            }

        depth_map = self._compute_depth_map(rows)
        distribution = Counter(depth_map.values())
        depth0_expected, depth1_expected = target_hierarchy
        depth0_renames = 0
        depth1_renames = 0
        deep_node_ids = []

        for row in rows:
            depth = depth_map[row["id"]]
            if depth == 0 and row["node_type"] != depth0_expected:
                depth0_renames += 1
            elif depth == 1 and row["node_type"] != depth1_expected:
                depth1_renames += 1
            elif depth > MAX_BUILDER_DEPTH:
                deep_node_ids.append(row["id"])

        return {
            "max_depth": max(distribution.keys()),
            "depth_distribution": {
                str(depth): count for depth, count in sorted(distribution.items())
            },
            "rename_counts": {
                "depth0": depth0_renames,
                "depth1": depth1_renames,
                "total": depth0_renames + depth1_renames,
            },
            "deep_node_ids": deep_node_ids,
        }

    def _compute_depth_map(self, rows):
        parent_map = {row["id"]: row["parent_id"] for row in rows}
        memo = {}
        visiting = set()

        def get_depth(node_id):
            if node_id in memo:
                return memo[node_id]
            if node_id in visiting:
                raise CommandError(f"Cycle detected in curriculum tree at node {node_id}.")

            visiting.add(node_id)
            parent_id = parent_map.get(node_id)
            if parent_id is None or parent_id not in parent_map:
                depth = 0
            else:
                depth = get_depth(parent_id) + 1
            visiting.remove(node_id)
            memo[node_id] = depth
            return depth

        for node_id in parent_map:
            get_depth(node_id)

        return memo

    def _apply_program_node_type_mapping(self, program_id: int, target_hierarchy):
        nodes = list(
            CurriculumNode.objects.filter(program_id=program_id).only(
                "id", "parent_id", "node_type"
            )
        )
        if not nodes:
            return 0

        rows = [{"id": node.id, "parent_id": node.parent_id} for node in nodes]
        depth_map = self._compute_depth_map(rows)
        container_label, content_label = target_hierarchy

        to_update = []
        for node in nodes:
            depth = depth_map[node.id]
            if depth == 0 and node.node_type != container_label:
                node.node_type = container_label
                to_update.append(node)
            elif depth == 1 and node.node_type != content_label:
                node.node_type = content_label
                to_update.append(node)

        if to_update:
            CurriculumNode.objects.bulk_update(to_update, ["node_type"], batch_size=500)
        return len(to_update)
