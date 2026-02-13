from django.core.management.base import BaseCommand

from apps.curriculum.models import CurriculumNode
from apps.core.views import _sync_quiz_questions


class Command(BaseCommand):
    help = (
        "Backfill quiz links for curriculum nodes that have quiz questions but no "
        "quiz_id in properties."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be updated without mutating records.",
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
            lesson_type = str(props.get("lesson_type") or "").lower()
            node_type = str(node.node_type or "").lower()
            is_quiz = node_type == "quiz" or lesson_type == "quiz"

            questions = props.get("questions", [])
            has_questions = isinstance(questions, list) and len(questions) > 0
            has_quiz_id = bool(props.get("quiz_id"))

            if not is_quiz or not has_questions or has_quiz_id:
                stats["skipped"] += 1
                continue

            stats["eligible"] += 1

            if dry_run:
                self.stdout.write(
                    f"[DRY RUN] Node {node.id} '{node.title}' is eligible for quiz link backfill."
                )
                continue

            try:
                _sync_quiz_questions(node, questions)
                stats["updated"] += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Updated node {node.id} '{node.title}' with quiz_id."
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
