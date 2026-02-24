from django.core.management.base import BaseCommand

from apps.assessments.models import QuizAttempt
from apps.progression.models import NodeCompletion


class Command(BaseCommand):
    help = (
        "Remove stale quiz-node completions where the enrollment has no passed "
        "submitted attempt for the linked quiz."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Report stale completions without deleting them.",
        )

    def handle(self, *args, **options):
        dry_run = bool(options.get("dry_run"))

        stats = {
            "scanned": 0,
            "quiz_completions": 0,
            "stale": 0,
            "deleted": 0,
        }

        passed_cache = {}
        stale_completion_ids = []

        completions = NodeCompletion.objects.select_related("enrollment", "node").order_by(
            "id"
        )

        for completion in completions:
            stats["scanned"] += 1
            node = completion.node
            props = node.properties if isinstance(node.properties, dict) else {}
            node_type = str(node.node_type or "").lower()
            lesson_type = str(props.get("lesson_type") or "").lower()
            is_quiz = node_type == "quiz" or lesson_type == "quiz"
            if not is_quiz:
                continue

            quiz_id = props.get("quiz_id")
            try:
                quiz_id = int(quiz_id)
            except (TypeError, ValueError):
                quiz_id = None
            if not quiz_id:
                continue

            stats["quiz_completions"] += 1
            cache_key = (completion.enrollment_id, quiz_id)
            has_passed_attempt = passed_cache.get(cache_key)
            if has_passed_attempt is None:
                has_passed_attempt = QuizAttempt.objects.filter(
                    enrollment_id=completion.enrollment_id,
                    quiz_id=quiz_id,
                    passed=True,
                    submitted_at__isnull=False,
                ).exists()
                passed_cache[cache_key] = has_passed_attempt

            if has_passed_attempt:
                continue

            stats["stale"] += 1
            stale_completion_ids.append(completion.id)

            if dry_run:
                self.stdout.write(
                    f"[DRY RUN] stale completion id={completion.id} "
                    f"enrollment={completion.enrollment_id} node={completion.node_id}"
                )

        if not dry_run and stale_completion_ids:
            deleted_count, _ = NodeCompletion.objects.filter(
                id__in=stale_completion_ids
            ).delete()
            stats["deleted"] = int(deleted_count)

        self.stdout.write(
            "Summary: "
            f"scanned={stats['scanned']}, "
            f"quiz_completions={stats['quiz_completions']}, "
            f"stale={stats['stale']}, "
            f"deleted={stats['deleted']}"
        )
