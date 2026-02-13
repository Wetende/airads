from django.core.management.base import BaseCommand

from apps.curriculum.models import CurriculumNode
from apps.core.views import (
    _normalize_assignment_mode,
    _normalize_submission_type,
    _normalize_typed_response_mode,
    _safe_int,
    _sync_assignment,
)


class Command(BaseCommand):
    help = (
        "Backfill assignment lesson mode/link integrity. "
        "Normalizes assignment_mode/submission_type and syncs assignment_id/quiz_id."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would change without mutating records.",
        )

    def handle(self, *args, **options):
        dry_run = bool(options.get("dry_run"))
        stats = {
            "scanned": 0,
            "eligible": 0,
            "updated": 0,
            "skipped": 0,
            "failed": 0,
        }

        nodes = CurriculumNode.objects.all().order_by("id")
        for node in nodes:
            stats["scanned"] += 1
            props = node.properties if isinstance(node.properties, dict) else {}
            node_type = str(node.node_type or "").lower()
            lesson_type = str(props.get("lesson_type") or "").lower()
            is_assignment = node_type == "assignment" or lesson_type == "assignment"

            if not is_assignment:
                stats["skipped"] += 1
                continue

            questions = props.get("questions", [])
            has_questions = isinstance(questions, list) and len(questions) > 0
            explicit_mode = str(props.get("assignment_mode") or "").strip().lower()
            if explicit_mode in {"submission_only", "question_only", "mixed"}:
                desired_mode = explicit_mode
            else:
                desired_mode = "mixed" if has_questions else "submission_only"
            current_mode = _normalize_assignment_mode(props)

            desired_typed_response_mode = (
                "short_answer_question"
                if desired_mode == "submission_only" and has_questions
                else "submission_text"
            )
            current_typed_response_mode = _normalize_typed_response_mode(
                props.get("typed_response_mode")
            )

            desired_assessment_prompt = str(
                props.get("assessment_prompt")
                or props.get("instructions")
                or node.title
                or ""
            ).strip()
            current_assessment_prompt = str(props.get("assessment_prompt") or "").strip()

            desired_submission_type = _normalize_submission_type(
                props.get("submission_type")
            )
            current_submission_type = str(props.get("submission_type") or "").strip().lower()

            has_assignment_id = bool(_safe_int(props.get("assignment_id")))
            has_quiz_id = bool(_safe_int(props.get("quiz_id")))
            needs_quiz_link = (
                (
                    desired_mode in {"mixed", "question_only"}
                    or (
                        desired_mode == "submission_only"
                        and desired_typed_response_mode == "short_answer_question"
                    )
                )
                and has_questions
                and not has_quiz_id
            )

            should_update = (
                current_mode != desired_mode
                or current_typed_response_mode != desired_typed_response_mode
                or current_assessment_prompt != desired_assessment_prompt
                or current_submission_type != desired_submission_type
                or not has_assignment_id
                or needs_quiz_link
            )

            if not should_update:
                stats["skipped"] += 1
                continue

            stats["eligible"] += 1
            if dry_run:
                self.stdout.write(
                    f"[DRY RUN] Node {node.id} '{node.title}' -> "
                    f"assignment_mode={desired_mode}, "
                    f"typed_response_mode={desired_typed_response_mode}, "
                    f"submission_type={desired_submission_type}"
                )
                continue

            try:
                next_props = props.copy()
                next_props["assignment_mode"] = desired_mode
                next_props["typed_response_mode"] = desired_typed_response_mode
                next_props["assessment_prompt"] = desired_assessment_prompt
                next_props["submission_type"] = desired_submission_type
                node.properties = next_props
                node.save(update_fields=["properties"])
                _sync_assignment(node)
                stats["updated"] += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Updated node {node.id} '{node.title}'"
                    )
                )
            except Exception as exc:
                stats["failed"] += 1
                self.stderr.write(
                    self.style.ERROR(
                        f"Failed node {node.id} '{node.title}': {exc}"
                    )
                )

        self.stdout.write(
            "Summary: "
            f"scanned={stats['scanned']}, "
            f"eligible={stats['eligible']}, "
            f"updated={stats['updated']}, "
            f"skipped={stats['skipped']}, "
            f"failed={stats['failed']}"
        )
