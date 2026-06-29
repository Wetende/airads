import os

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from apps.core.models import Program


class Command(BaseCommand):
    help = "Audit program thumbnail records against the configured media storage."

    def add_arguments(self, parser):
        parser.add_argument(
            "--program-id",
            type=int,
            help="Only audit one program id.",
        )
        parser.add_argument(
            "--missing-only",
            action="store_true",
            help="Only print program thumbnails whose files are missing.",
        )
        parser.add_argument(
            "--fail-on-missing",
            action="store_true",
            help="Exit with an error when any referenced thumbnail file is missing.",
        )

    def handle(self, *args, **options):
        media_root = str(settings.MEDIA_ROOT)
        self.stdout.write("Program media audit")
        self.stdout.write(f"DEBUG: {settings.DEBUG}")
        self.stdout.write(f"MEDIA_URL: {settings.MEDIA_URL}")
        self.stdout.write(f"MEDIA_ROOT: {media_root}")
        self.stdout.write(
            "MEDIA_ROOT status: "
            f"exists={os.path.isdir(media_root)} "
            f"readable={os.access(media_root, os.R_OK)} "
            f"writable={os.access(media_root, os.W_OK)}"
        )

        queryset = Program.objects.exclude(thumbnail="").exclude(thumbnail__isnull=True)
        if options["program_id"]:
            queryset = queryset.filter(pk=options["program_id"])

        total = 0
        reported = 0
        missing = 0

        for program in queryset.order_by("id"):
            total += 1
            record = self._build_record(program)
            if not record["exists"]:
                missing += 1

            if options["missing_only"] and record["exists"]:
                continue

            reported += 1
            status = "OK" if record["exists"] else "MISSING"
            self.stdout.write(
                f"{status} id={program.id} slug={program.slug} "
                f"name={program.name!r} thumbnail={record['name']}"
            )
            self.stdout.write(f"  url={record['url']}")
            self.stdout.write(f"  expected_path={record['path']}")
            if record["size"] is not None:
                self.stdout.write(f"  size={record['size']} bytes")

        self.stdout.write(
            f"Summary: checked={total} reported={reported} missing={missing}"
        )

        if missing and options["fail_on_missing"]:
            raise CommandError(f"{missing} program thumbnail file(s) are missing.")

    def _build_record(self, program):
        thumbnail = program.thumbnail
        name = thumbnail.name
        url = thumbnail.url

        try:
            path = thumbnail.path
        except NotImplementedError:
            path = os.path.join(str(settings.MEDIA_ROOT), name)

        exists = thumbnail.storage.exists(name)
        size = None
        if exists:
            try:
                size = thumbnail.size
            except OSError:
                size = None

        return {
            "name": name,
            "url": url,
            "path": path,
            "exists": exists,
            "size": size,
        }
