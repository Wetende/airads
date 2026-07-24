from __future__ import annotations

from django.db.models import Q

from .registry import (
    MAX_SYNC_REPORT_ROWS,
    ReportColumn,
    ReportDefinition,
    ReportResult,
    register_report,
)
from .utils import (
    display_datetime,
    parse_date_boundary,
    parse_positive_int_filter,
    selected_numeric_ids,
)


try:
    from apps.core.models import AdmissionApplication, Campus, Program
except (ImportError, AttributeError):
    AdmissionApplication = None
    Campus = None
    Program = None


ADMISSIONS_COLUMNS = (
    ReportColumn("id", "ID"),
    ReportColumn("applicant", "Applicant"),
    ReportColumn("email", "Email"),
    ReportColumn("phone", "Phone"),
    ReportColumn("program", "Program"),
    ReportColumn("campus", "Campus"),
    ReportColumn("status", "Status"),
    ReportColumn("payment", "Payment"),
    ReportColumn("enrollment", "Enrollment"),
    ReportColumn("source", "Source"),
    ReportColumn("createdAt", "Created"),
)


def _apply_date_filters(queryset, filters: dict):
    date_from = parse_date_boundary(filters.get("date_from") or filters.get("from"))
    date_to = parse_date_boundary(
        filters.get("date_to") or filters.get("to"),
        end_of_day=True,
    )
    if date_from:
        queryset = queryset.filter(created_at__gte=date_from)
    if date_to:
        queryset = queryset.filter(created_at__lte=date_to)
    return queryset


def build_admin_admissions_report(request, filters: dict, selected_ids: list[str]):
    program_id = parse_positive_int_filter(filters.get("program"), "program")
    campus_id = parse_positive_int_filter(filters.get("campus"), "campus")
    application_ids = selected_numeric_ids(selected_ids)
    queryset = AdmissionApplication.objects.select_related(
        "program",
        "campus",
        "user",
        "order",
        "enrollment",
    )
    if filters.get("status"):
        queryset = queryset.filter(status=filters["status"])
    if program_id:
        queryset = queryset.filter(program_id=program_id)
    if campus_id:
        queryset = queryset.filter(campus_id=campus_id)
    if filters.get("study_mode"):
        queryset = queryset.filter(study_mode=filters["study_mode"])
    if filters.get("search"):
        search = filters["search"]
        queryset = queryset.filter(
            Q(full_name__icontains=search)
            | Q(email__icontains=search)
            | Q(phone__icontains=search)
            | Q(preferred_programme__icontains=search)
        )
    if selected_ids:
        queryset = (
            queryset.filter(id__in=application_ids)
            if application_ids
            else queryset.none()
        )

    queryset = _apply_date_filters(queryset, filters).order_by("-created_at", "-id")
    total_count = queryset.count()
    is_truncated = total_count > MAX_SYNC_REPORT_ROWS
    rows = []
    for application in queryset[:MAX_SYNC_REPORT_ROWS]:
        program_name = (
            application.program.name
            if application.program_id
            else application.preferred_programme
        )
        campus_name = (
            application.campus.name
            if application.campus_id
            else application.preferred_campus
        )
        rows.append(
            {
                "id": application.id,
                "applicant": application.full_name,
                "email": application.email or "-",
                "phone": application.phone,
                "program": program_name or "-",
                "campus": campus_name or "-",
                "status": application.get_status_display(),
                "payment": (
                    application.order.get_status_display()
                    if application.order_id
                    else "No order"
                ),
                "enrollment": (
                    application.enrollment.get_status_display()
                    if application.enrollment_id
                    else "Not enrolled"
                ),
                "source": application.source or "-",
                "createdAt": display_datetime(application.created_at),
            }
        )

    program_label = "All"
    if program_id and Program is not None:
        program = Program.objects.filter(pk=program_id).first()
        program_label = program.name if program else str(program_id)

    campus_label = "All"
    if campus_id and Campus is not None:
        campus = Campus.objects.filter(pk=campus_id).first()
        campus_label = campus.name if campus else str(campus_id)

    return ReportResult(
        title="Admissions Applications Report",
        columns=list(ADMISSIONS_COLUMNS),
        rows=rows,
        filters={
            "Status": filters.get("status") or "All",
            "Campus": campus_label,
            "Program": program_label,
            "Search": filters.get("search") or "None",
        },
        summary={"Total matching applications": total_count},
        orientation="landscape",
        total_count=total_count,
        is_truncated=is_truncated,
    )


if AdmissionApplication is not None:
    register_report(
        ReportDefinition(
            id="admin.admissions",
            title="Admissions Applications",
            scope="admin",
            roles=("admin",),
            columns=ADMISSIONS_COLUMNS,
            builder=build_admin_admissions_report,
            description="AIRADS admissions list by status, campus, program, and search.",
            orientation="landscape",
            shared_engine=False,
        )
    )
