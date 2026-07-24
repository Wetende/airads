from __future__ import annotations

import logging
from collections import Counter
from urllib.parse import urlencode

from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.db.models import Q
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.text import slugify

from apps.core.models import (
    AdmissionApplication,
    AdmissionOnboardingBatch,
    AdmissionOnboardingItem,
    User,
)
from apps.core.services.course_prerequisites import CoursePrerequisiteService
from apps.core.services.pricing import get_program_pricing, serialize_price_display


logger = logging.getLogger(__name__)


class AdmissionOnboardingService:
    """Create accounts and course access from admission applications safely."""

    CHUNK_SIZE = 20

    @classmethod
    def create_preview_batch(cls, *, created_by, selection: dict):
        mode = str(selection.get("mode") or "ids").strip()
        if mode not in {
            AdmissionOnboardingBatch.SELECTION_IDS,
            AdmissionOnboardingBatch.SELECTION_FILTERS,
        }:
            raise ValueError("Select applications or use the current filters.")

        filters = selection.get("filters") if isinstance(selection.get("filters"), dict) else {}
        excluded_ids = cls._positive_ids(selection.get("excludedIds", []))
        queryset = cls._selection_queryset(
            mode=mode,
            selected_ids=selection.get("ids", []),
            filters=filters,
            excluded_ids=excluded_ids,
        )
        applications = list(
            queryset.select_related("program", "user", "enrollment").prefetch_related(
                "program__prerequisite_programs"
            )
        )
        if not applications:
            raise ValueError("No admission applications match this selection.")

        preview_counts = Counter()
        for application in applications:
            classification = cls.classify(application)
            preview_counts[classification] += 1
            if classification.startswith("ready_"):
                preview_counts["ready"] += 1
            elif classification == "already_enrolled":
                preview_counts["ready"] += 1
            else:
                preview_counts["needs_review"] += 1

        with transaction.atomic():
            batch = AdmissionOnboardingBatch.objects.create(
                created_by=created_by,
                selection_mode=mode,
                selection_filters=filters,
                excluded_ids=excluded_ids,
                preview_counts=dict(preview_counts),
                total_count=len(applications),
            )
            AdmissionOnboardingItem.objects.bulk_create(
                [
                    AdmissionOnboardingItem(
                        batch=batch,
                        application=application,
                        outcome=cls.classify(application),
                    )
                    for application in applications
                ]
            )
        return batch

    @classmethod
    def classify(cls, application: AdmissionApplication) -> str:
        if application.status == AdmissionApplication.STATUS_DECLINED:
            return "declined"
        if not cls._normalise_email(application.email):
            return "missing_email"
        if not application.program_id:
            return "missing_program"

        user, user_state = cls._matching_user(application)
        if user_state == "ambiguous":
            return "ambiguous_user"

        if user:
            enrollment = cls._enrollment_for(user, application)
            if enrollment and enrollment.status in {"active", "completed"}:
                return "already_enrolled"
            if enrollment and enrollment.status in {"withdrawn", "suspended"}:
                return f"inactive_enrollment_{enrollment.status}"

        evaluation = CoursePrerequisiteService.evaluate(user, application.program)
        if evaluation.required and not evaluation.eligible:
            return "prerequisite_blocked"

        account_label = "existing" if user else "new"
        return f"ready_{account_label}_{cls.program_enrollment_mode(application.program)}"

    @classmethod
    def start(cls, batch: AdmissionOnboardingBatch):
        with transaction.atomic():
            locked = AdmissionOnboardingBatch.objects.select_for_update().get(pk=batch.pk)
            if locked.status == AdmissionOnboardingBatch.STATUS_DRAFT:
                locked.status = AdmissionOnboardingBatch.STATUS_PROCESSING
                locked.started_at = timezone.now()
                locked.save(update_fields=["status", "started_at", "updated_at"])
        batch.refresh_from_db()
        return batch

    @classmethod
    def process_next(cls, batch: AdmissionOnboardingBatch, *, base_url: str):
        batch.refresh_from_db()
        if batch.status == AdmissionOnboardingBatch.STATUS_DRAFT:
            cls.start(batch)
        if batch.status not in {
            AdmissionOnboardingBatch.STATUS_PROCESSING,
        }:
            return batch

        item_ids = list(
            batch.items.filter(status=AdmissionOnboardingItem.STATUS_PENDING)
            .order_by("id")
            .values_list("id", flat=True)[: cls.CHUNK_SIZE]
        )
        for item_id in item_ids:
            cls._process_item(item_id, base_url=base_url)

        cls._refresh_batch_counts(batch.pk)
        batch.refresh_from_db()
        return batch

    @classmethod
    def create_or_link_account(cls, application: AdmissionApplication):
        """Return ``(user, account_state, temporary_password)``."""
        email = cls._normalise_email(application.email)
        if not email:
            raise ValueError("An email address is required to create a student account.")

        if application.user_id:
            user = application.user
            cls._update_user_details(user, application)
            return user, "existing", None

        matches = list(User.objects.filter(email__iexact=email).order_by("id")[:2])
        if len(matches) > 1:
            raise ValueError("Multiple student accounts use this email; review them manually.")
        if matches:
            user = matches[0]
            cls._update_user_details(user, application)
            application.user = user
            application.save(update_fields=["user", "updated_at"])
            return user, "existing", None

        first_name, last_name = cls._split_name(application.full_name)
        temporary_password = cls._temporary_password()
        user = User.objects.create_user(
            username=cls._unique_username(email, application),
            email=email,
            password=temporary_password,
            first_name=first_name,
            last_name=last_name,
        )
        if application.phone:
            user.phone = application.phone
            user.save(update_fields=["phone"])
        application.user = user
        application.save(update_fields=["user", "updated_at"])
        return user, "created", temporary_password

    @classmethod
    def send_account_access_email(
        cls,
        *,
        application: AdmissionApplication,
        user: User,
        account_state: str,
        temporary_password: str | None,
        base_url: str,
        enrollment_mode: str = "approval",
    ) -> bool:
        from apps.notifications.services import NotificationService

        urls = cls._access_urls(
            application=application,
            user=user,
            base_url=base_url,
            enrollment_mode=enrollment_mode,
        )
        return NotificationService.notify_course_enrollment_access(
            user=user,
            application=application,
            program=application.program,
            enrollment_mode=enrollment_mode,
            account_state=account_state,
            temporary_password=temporary_password,
            login_url=urls["login"],
            reset_url=urls["reset"],
            course_url=urls["course"],
            checkout_url=urls["checkout"],
            primary_action_url=urls["primary"],
        )

    @classmethod
    def retry_failed_emails(cls, batch: AdmissionOnboardingBatch, *, base_url: str):
        item_ids = list(
            batch.items.filter(
                status=AdmissionOnboardingItem.STATUS_SUCCEEDED,
                email_status=AdmissionOnboardingItem.EMAIL_FAILED,
            ).values_list("id", flat=True)
        )
        for item_id in item_ids:
            item = (
                AdmissionOnboardingItem.objects.select_related(
                    "application__program", "user", "enrollment"
                )
                .filter(pk=item_id)
                .first()
            )
            if not item or not item.user_id:
                continue
            mode = cls.program_enrollment_mode(item.application.program)
            notification_mode = "free" if item.enrollment_id else mode
            cls._deliver_item_email(
                item_id=item.id,
                application=item.application,
                user=item.user,
                account_state="existing",
                temporary_password=None,
                base_url=base_url,
                enrollment_mode=notification_mode,
            )
        cls._refresh_batch_counts(batch.pk)
        batch.refresh_from_db()
        return batch

    @classmethod
    def program_enrollment_mode(cls, program) -> str:
        from apps.platform.models import PlatformSettings
        from apps.progression.services import get_enrollment_policy_mode

        settings = PlatformSettings.get_settings()
        features = settings.get_default_features_for_mode()
        if isinstance(settings.features, dict):
            features.update(settings.features)
        pricing = get_program_pricing(
            program,
            deployment_mode=settings.deployment_mode,
            platform_features=features,
            currency_code=settings.currency_code,
        )
        display = serialize_price_display(pricing)
        if display["allowsOnlineCheckout"] or display["allowsOfflinePayment"]:
            return "paid"
        if get_enrollment_policy_mode() != "open":
            return "approval"
        return "free"

    @classmethod
    def _process_item(cls, item_id: int, *, base_url: str):
        try:
            with transaction.atomic():
                item = (
                    AdmissionOnboardingItem.objects.select_for_update()
                    .select_related("batch", "application__program", "application__user")
                    .get(pk=item_id)
                )
                if item.status != AdmissionOnboardingItem.STATUS_PENDING:
                    return

                application = item.application
                classification = cls.classify(application)
                if not (
                    classification.startswith("ready_")
                    or classification == "already_enrolled"
                ):
                    cls._mark_item_skipped(item, classification)
                    return

                user, account_state, temporary_password = cls.create_or_link_account(
                    application
                )
                enrollment = cls._enrollment_for(user, application)
                if enrollment and enrollment.status in {"withdrawn", "suspended"}:
                    cls._mark_item_skipped(item, f"inactive_enrollment_{enrollment.status}")
                    return

                if enrollment and enrollment.status in {"active", "completed"}:
                    application.enrollment = enrollment
                    application.status = AdmissionApplication.STATUS_ACCEPTED
                    application.save(
                        update_fields=["user", "enrollment", "status", "updated_at"]
                    )
                    cls._mark_item_succeeded(
                        item,
                        user=user,
                        enrollment=enrollment,
                        account_state=account_state,
                        outcome="already_enrolled",
                        email_status=AdmissionOnboardingItem.EMAIL_SKIPPED,
                    )
                    return

                evaluation = CoursePrerequisiteService.evaluate(user, application.program)
                if evaluation.required and not evaluation.eligible:
                    cls._mark_item_skipped(item, "prerequisite_blocked", user=user)
                    return

                mode = cls.program_enrollment_mode(application.program)
                if mode == "paid":
                    if application.status == AdmissionApplication.STATUS_NEW:
                        application.status = AdmissionApplication.STATUS_CONTACTED
                    application.save(update_fields=["user", "status", "updated_at"])
                    outcome = "payment_required"
                    notification_mode = "paid"
                else:
                    from apps.progression.models import Enrollment

                    enrollment, _ = Enrollment.objects.get_or_create(
                        user=user,
                        program=application.program,
                        defaults={"status": "active", "access_source": "admin"},
                    )
                    application.enrollment = enrollment
                    application.status = AdmissionApplication.STATUS_ACCEPTED
                    application.save(
                        update_fields=["user", "enrollment", "status", "updated_at"]
                    )
                    outcome = "enrolled"
                    notification_mode = "free"

                email_status = AdmissionOnboardingItem.EMAIL_NOT_SENT
                if cls._email_already_sent(item, user, application.program_id):
                    email_status = AdmissionOnboardingItem.EMAIL_SKIPPED
                cls._mark_item_succeeded(
                    item,
                    user=user,
                    enrollment=enrollment,
                    account_state=account_state,
                    outcome=outcome,
                    email_status=email_status,
                )
                if email_status == AdmissionOnboardingItem.EMAIL_NOT_SENT:
                    notification = {
                        "item_id": item.id,
                        "application": application,
                        "user": user,
                        "account_state": account_state,
                        "temporary_password": temporary_password,
                        "base_url": base_url,
                        "enrollment_mode": notification_mode,
                    }
                    transaction.on_commit(
                        lambda payload=notification: cls._deliver_item_email(**payload)
                    )
        except Exception as error:
            logger.exception("Admission onboarding item %s failed", item_id)
            AdmissionOnboardingItem.objects.filter(pk=item_id).update(
                status=AdmissionOnboardingItem.STATUS_FAILED,
                outcome="error",
                error_message=str(error),
                processed_at=timezone.now(),
                updated_at=timezone.now(),
            )

    @classmethod
    def _deliver_item_email(
        cls,
        *,
        item_id: int,
        application: AdmissionApplication,
        user: User,
        account_state: str,
        temporary_password: str | None,
        base_url: str,
        enrollment_mode: str,
    ):
        sent = False
        error_message = ""
        try:
            sent = cls.send_account_access_email(
                application=application,
                user=user,
                account_state=account_state,
                temporary_password=temporary_password,
                base_url=base_url,
                enrollment_mode=enrollment_mode,
            )
            if not sent:
                error_message = "The email provider did not confirm delivery."
        except Exception as error:
            logger.exception("Admission onboarding email for item %s failed", item_id)
            error_message = str(error)

        item = AdmissionOnboardingItem.objects.filter(pk=item_id).first()
        if item:
            item.email_status = (
                AdmissionOnboardingItem.EMAIL_SENT
                if sent
                else AdmissionOnboardingItem.EMAIL_FAILED
            )
            item.email_attempts += 1
            item.error_message = error_message
            item.save(
                update_fields=[
                    "email_status",
                    "email_attempts",
                    "error_message",
                    "updated_at",
                ]
            )
            cls._refresh_batch_counts(item.batch_id)
        return sent

    @classmethod
    def _refresh_batch_counts(cls, batch_id: int):
        items = AdmissionOnboardingItem.objects.filter(batch_id=batch_id)
        pending = items.filter(status=AdmissionOnboardingItem.STATUS_PENDING).count()
        succeeded = items.filter(status=AdmissionOnboardingItem.STATUS_SUCCEEDED).count()
        skipped = items.filter(status=AdmissionOnboardingItem.STATUS_SKIPPED).count()
        failed = items.filter(status=AdmissionOnboardingItem.STATUS_FAILED).count()
        email_failed = items.filter(
            email_status=AdmissionOnboardingItem.EMAIL_FAILED
        ).count()
        processed = succeeded + skipped + failed
        update = {
            "processed_count": processed,
            "succeeded_count": succeeded,
            "skipped_count": skipped,
            "failed_count": failed,
            "email_failed_count": email_failed,
            "updated_at": timezone.now(),
        }
        if pending == 0:
            update["status"] = (
                AdmissionOnboardingBatch.STATUS_COMPLETED_WITH_ERRORS
                if failed or email_failed
                else AdmissionOnboardingBatch.STATUS_COMPLETED
            )
            update["completed_at"] = timezone.now()
        AdmissionOnboardingBatch.objects.filter(pk=batch_id).update(**update)

    @staticmethod
    def _mark_item_succeeded(
        item,
        *,
        user,
        enrollment,
        account_state,
        outcome,
        email_status,
    ):
        item.user = user
        item.enrollment = enrollment
        item.status = AdmissionOnboardingItem.STATUS_SUCCEEDED
        item.outcome = outcome
        item.account_state = account_state
        item.email_status = email_status
        item.error_message = ""
        item.processed_at = timezone.now()
        item.save(
            update_fields=[
                "user",
                "enrollment",
                "status",
                "outcome",
                "account_state",
                "email_status",
                "error_message",
                "processed_at",
                "updated_at",
            ]
        )

    @staticmethod
    def _mark_item_skipped(item, outcome, user=None):
        item.user = user
        item.status = AdmissionOnboardingItem.STATUS_SKIPPED
        item.outcome = outcome
        item.email_status = AdmissionOnboardingItem.EMAIL_SKIPPED
        item.processed_at = timezone.now()
        item.save(
            update_fields=[
                "user",
                "status",
                "outcome",
                "email_status",
                "processed_at",
                "updated_at",
            ]
        )

    @classmethod
    def _email_already_sent(cls, item, user, program_id):
        return (
            AdmissionOnboardingItem.objects.filter(
                batch=item.batch,
                user=user,
                application__program_id=program_id,
                email_status=AdmissionOnboardingItem.EMAIL_SENT,
            )
            .exclude(pk=item.pk)
            .exists()
        )

    @staticmethod
    def _matching_user(application):
        if application.user_id:
            return application.user, "linked"
        email = AdmissionOnboardingService._normalise_email(application.email)
        if not email:
            return None, "missing"
        matches = list(User.objects.filter(email__iexact=email).order_by("id")[:2])
        if len(matches) > 1:
            return None, "ambiguous"
        return (matches[0], "existing") if matches else (None, "new")

    @staticmethod
    def _enrollment_for(user, application):
        if application.enrollment_id:
            return application.enrollment
        if not user or not application.program_id:
            return None
        from apps.progression.models import Enrollment

        return Enrollment.objects.filter(user=user, program=application.program).first()

    @classmethod
    def _selection_queryset(cls, *, mode, selected_ids, filters, excluded_ids):
        queryset = AdmissionApplication.objects.all().order_by("-created_at", "-id")
        if mode == AdmissionOnboardingBatch.SELECTION_IDS:
            ids = cls._positive_ids(selected_ids)
            return queryset.filter(id__in=ids)

        status = str(filters.get("status") or "").strip()
        campus = str(filters.get("campus") or "").strip()
        program = str(filters.get("program") or "").strip()
        search = str(filters.get("search") or "").strip()
        if status:
            queryset = queryset.filter(status=status)
        if campus.isdigit():
            queryset = queryset.filter(campus_id=int(campus))
        if program.isdigit():
            queryset = queryset.filter(program_id=int(program))
        if search:
            queryset = queryset.filter(
                Q(full_name__icontains=search)
                | Q(email__icontains=search)
                | Q(phone__icontains=search)
                | Q(preferred_programme__icontains=search)
            )
        if excluded_ids:
            queryset = queryset.exclude(id__in=excluded_ids)
        return queryset

    @staticmethod
    def _positive_ids(values):
        result = []
        for value in values if isinstance(values, (list, tuple, set)) else []:
            try:
                numeric = int(value)
            except (TypeError, ValueError):
                continue
            if numeric > 0:
                result.append(numeric)
        return sorted(set(result))

    @staticmethod
    def _normalise_email(value):
        return str(value or "").strip().lower()

    @staticmethod
    def _split_name(full_name):
        parts = [part for part in str(full_name or "").strip().split() if part]
        if not parts:
            return "", ""
        return parts[0], " ".join(parts[1:])

    @staticmethod
    def _temporary_password():
        random_part = get_random_string(
            10,
            allowed_chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789",
        )
        return f"Aa7{random_part}"

    @staticmethod
    def _unique_username(email, application):
        base = email or slugify(application.full_name) or f"admission-{application.id}"
        base = base[:140]
        candidate = base
        suffix = 1
        while User.objects.filter(username=candidate).exists():
            suffix += 1
            candidate = f"{base[:135]}-{suffix}"
        return candidate

    @staticmethod
    def _update_user_details(user, application):
        first_name, last_name = AdmissionOnboardingService._split_name(
            application.full_name
        )
        update_fields = []
        if first_name and not user.first_name:
            user.first_name = first_name
            update_fields.append("first_name")
        if last_name and not user.last_name:
            user.last_name = last_name
            update_fields.append("last_name")
        if application.phone and not user.phone:
            user.phone = application.phone
            update_fields.append("phone")
        if update_fields:
            user.save(update_fields=update_fields)

    @staticmethod
    def _absolute(base_url, path):
        return f"{str(base_url or '').rstrip('/')}{path}"

    @classmethod
    def _access_urls(cls, *, application, user, base_url, enrollment_mode):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_path = reverse(
            "core:reset_password",
            kwargs={"uidb64": uid, "token": token},
        )
        login = cls._absolute(base_url, reverse("core:login"))
        course = cls._absolute(
            base_url,
            reverse("progression:student.program", kwargs={"pk": application.program_id}),
        )
        checkout_query = urlencode(
            {
                "mode": "direct",
                "programId": application.program_id,
                "applicationId": application.id,
            }
        )
        checkout_path = f"/checkout/?{checkout_query}"
        checkout = cls._absolute(base_url, checkout_path)
        primary = login
        if enrollment_mode == "paid":
            primary = checkout
        elif enrollment_mode == "free":
            primary = course
        return {
            "login": login,
            "reset": cls._absolute(base_url, reset_path),
            "course": course,
            "checkout": checkout,
            "primary": primary,
        }
