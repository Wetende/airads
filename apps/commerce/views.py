import hashlib
import hmac
import json
import uuid
from datetime import timedelta
from urllib import error as url_error
from urllib import request as url_request

from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import redirect
from django.utils import timezone
from inertia import render

from apps.core.models import Program
from apps.progression.models import Enrollment

from .models import Order, PaymentAttempt, WebhookEvent

PAYSTACK_INITIALIZE_URL = "https://api.paystack.co/transaction/initialize"
PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify/{reference}"


def _program_price_minor(program: Program):
    custom_pricing = program.custom_pricing or {}
    amount = custom_pricing.get("price", 0) or 0
    currency = custom_pricing.get("currency", "KES") or "KES"

    try:
        amount_float = float(amount)
    except (TypeError, ValueError):
        amount_float = 0

    return max(0, int(round(amount_float * 100))), str(currency).upper()


def _paystack_request(method: str, url: str, payload: dict | None = None):
    body = json.dumps(payload or {}).encode("utf-8") if payload is not None else None
    req = url_request.Request(
        url,
        method=method,
        data=body,
        headers={
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        },
    )
    try:
        with url_request.urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except url_error.HTTPError as exc:
        raw = exc.read().decode("utf-8") if hasattr(exc, "read") else ""
        try:
            return json.loads(raw)
        except Exception:
            return {"status": False, "message": raw or str(exc)}
    except Exception as exc:
        return {"status": False, "message": str(exc)}


def _activate_paid_enrollment(order: Order, paid_at=None):
    paid_at = paid_at or timezone.now()
    expires_at = None
    if order.program.access_duration_days:
        expires_at = paid_at + timedelta(days=int(order.program.access_duration_days))

    enrollment, _ = Enrollment.objects.get_or_create(
        user=order.user,
        program=order.program,
        defaults={
            "status": "active",
            "access_source": "paid",
            "expires_at": expires_at,
        },
    )

    update_fields = []
    if enrollment.access_source != "paid":
        enrollment.access_source = "paid"
        update_fields.append("access_source")
    if enrollment.status in {"withdrawn", "suspended"}:
        enrollment.status = "active"
        update_fields.append("status")
    if expires_at:
        enrollment.expires_at = expires_at
        update_fields.append("expires_at")

    if update_fields:
        enrollment.save(update_fields=update_fields + ["updated_at"])

    if order.enrollment_id != enrollment.id:
        order.enrollment = enrollment

    if order.status != "paid":
        order.status = "paid"
        order.paid_at = paid_at
    elif not order.paid_at:
        order.paid_at = paid_at

    order.save(update_fields=["status", "paid_at", "enrollment", "updated_at"])
    return enrollment


def _finalize_order_from_paystack_data(order: Order, data: dict):
    status = str((data or {}).get("status") or "").lower()
    paid_at_raw = (data or {}).get("paid_at")
    paid_at = timezone.now()

    if paid_at_raw:
        parsed = timezone.datetime.fromisoformat(str(paid_at_raw).replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = timezone.make_aware(parsed, timezone.get_current_timezone())
        paid_at = parsed

    if status == "success":
        return _activate_paid_enrollment(order, paid_at=paid_at)

    order.status = "failed"
    order.save(update_fields=["status", "updated_at"])
    return None


@login_required
def program_checkout(request, pk: int):
    program = Program.objects.filter(pk=pk, is_published=True).first()
    if not program:
        messages.error(request, "Program not found.")
        return redirect("core:programs")

    amount_minor, currency = _program_price_minor(program)
    if amount_minor <= 0:
        messages.error(request, "This program does not require paid checkout.")
        return redirect("core:program_detail", pk=pk)

    pending_order = Order.objects.filter(
        user=request.user,
        program=program,
        status__in=["created", "pending_payment"],
    ).order_by("-created_at").first()

    return render(
        request,
        "Payments/Checkout",
        {
            "program": {
                "id": program.id,
                "name": program.name,
                "thumbnail": program.thumbnail.url if program.thumbnail else None,
            },
            "price": {
                "amountMinor": amount_minor,
                "currency": currency,
            },
            "pendingOrder": {
                "reference": pending_order.reference,
                "status": pending_order.status,
            } if pending_order else None,
            "paystack": {
                "publicKey": settings.PAYSTACK_PUBLIC_KEY,
            },
        },
    )


@login_required
def program_checkout_initialize(request, pk: int):
    if request.method != "POST":
        return redirect("commerce:checkout", pk=pk)

    program = Program.objects.filter(pk=pk, is_published=True).first()
    if not program:
        messages.error(request, "Program not found.")
        return redirect("core:programs")

    amount_minor, currency = _program_price_minor(program)
    if amount_minor <= 0:
        messages.error(request, "This program does not require paid checkout.")
        return redirect("core:program_detail", pk=pk)

    existing = Order.objects.filter(
        user=request.user,
        program=program,
        status__in=["created", "pending_payment"],
    ).order_by("-created_at").first()

    order = existing
    if not order:
        order = Order.objects.create(
            user=request.user,
            program=program,
            provider="paystack",
            status="created",
            amount_minor=amount_minor,
            currency=currency,
            reference=f"cv-{program.id}-{request.user.id}-{uuid.uuid4().hex[:16]}",
            metadata={},
        )

    callback_url = settings.PAYSTACK_CALLBACK_URL or request.build_absolute_uri("/payments/paystack/callback/")
    payload = {
        "email": request.user.email or f"user-{request.user.id}@example.com",
        "amount": order.amount_minor,
        "currency": order.currency,
        "reference": order.reference,
        "callback_url": callback_url,
        "metadata": {
            "program_id": program.id,
            "user_id": request.user.id,
            "order_id": order.id,
        },
    }

    paystack_response = _paystack_request("POST", PAYSTACK_INITIALIZE_URL, payload)

    PaymentAttempt.objects.create(
        order=order,
        provider="paystack",
        state="initialize",
        provider_reference=order.reference,
        request_payload=payload,
        response_payload=paystack_response if isinstance(paystack_response, dict) else {},
    )

    if not paystack_response.get("status"):
        order.status = "failed"
        order.save(update_fields=["status", "updated_at"])
        messages.error(
            request,
            "We could not start payment at the moment. Please try again.",
        )
        return redirect("commerce:checkout", pk=pk)

    order.status = "pending_payment"
    order.save(update_fields=["status", "updated_at"])

    auth_url = (paystack_response.get("data") or {}).get("authorization_url")
    if not auth_url:
        messages.error(request, "Missing Paystack authorization URL.")
        return redirect("commerce:checkout", pk=pk)

    return redirect(auth_url)


@login_required
def paystack_callback(request):
    reference = request.GET.get("reference") or request.GET.get("trxref")
    if not reference:
        messages.error(request, "Missing payment reference.")
        return redirect("core:programs")

    order = Order.objects.filter(reference=reference, user=request.user).select_related("program").first()
    if not order:
        messages.error(request, "Order not found.")
        return redirect("core:programs")

    verify_response = _paystack_request("GET", PAYSTACK_VERIFY_URL.format(reference=reference))
    PaymentAttempt.objects.create(
        order=order,
        provider="paystack",
        state="callback_verify",
        provider_reference=reference,
        request_payload={"reference": reference},
        response_payload=verify_response if isinstance(verify_response, dict) else {},
    )

    if verify_response.get("status"):
        data = verify_response.get("data") or {}
        _finalize_order_from_paystack_data(order, data)

    if order.status == "paid":
        messages.success(request, "Payment verified. Access has been granted.")
        return redirect("progression:student.program", pk=order.program_id)

    messages.info(request, "Payment is pending confirmation. We will update your access shortly.")
    return redirect("core:program_detail", pk=order.program_id)


def paystack_webhook(request):
    if request.method != "POST":
        return JsonResponse({"ok": False, "error": "method_not_allowed"}, status=405)

    raw_body = request.body or b""
    signature = request.headers.get("x-paystack-signature", "")

    secret = settings.PAYSTACK_WEBHOOK_SECRET or settings.PAYSTACK_SECRET_KEY
    digest = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha512).hexdigest() if secret else ""
    signature_valid = bool(secret and signature and hmac.compare_digest(signature, digest))

    try:
        payload = json.loads(raw_body.decode("utf-8") or "{}")
    except Exception:
        payload = {}

    event = str(payload.get("event") or "")
    data = payload.get("data") or {}
    reference = str(data.get("reference") or "")
    event_id = str(payload.get("id") or "")
    dedupe_key = f"paystack:{event_id or reference or uuid.uuid4().hex}"

    event_obj, created = WebhookEvent.objects.get_or_create(
        dedupe_key=dedupe_key,
        defaults={
            "provider": "paystack",
            "event_id": event_id,
            "reference": reference,
            "signature_valid": signature_valid,
            "payload": payload if isinstance(payload, dict) else {},
        },
    )

    if not created:
        return JsonResponse({"ok": True, "duplicate": True})

    if not signature_valid:
        return JsonResponse({"ok": False, "error": "invalid_signature"}, status=401)

    if event not in {"charge.success", "charge.failed"} or not reference:
        event_obj.processed_at = timezone.now()
        event_obj.save(update_fields=["processed_at", "updated_at"])
        return JsonResponse({"ok": True})

    with transaction.atomic():
        order = Order.objects.select_for_update().filter(reference=reference).first()
        if not order:
            event_obj.processed_at = timezone.now()
            event_obj.save(update_fields=["processed_at", "updated_at"])
            return JsonResponse({"ok": True})

        PaymentAttempt.objects.create(
            order=order,
            provider="paystack",
            state=f"webhook_{event}",
            provider_reference=reference,
            request_payload={"event": event},
            response_payload=payload if isinstance(payload, dict) else {},
        )

        _finalize_order_from_paystack_data(order, data)

        event_obj.processed_at = timezone.now()
        event_obj.save(update_fields=["processed_at", "updated_at"])

    return JsonResponse({"ok": True})


@login_required
def student_orders(request):
    orders = Order.objects.filter(user=request.user).select_related("program").order_by("-created_at")[:100]

    orders_data = [
        {
            "id": order.id,
            "reference": order.reference,
            "status": order.status,
            "provider": order.provider,
            "amountMinor": order.amount_minor,
            "currency": order.currency,
            "program": {
                "id": order.program_id,
                "name": order.program.name,
            },
            "createdAt": order.created_at.isoformat() if order.created_at else None,
            "paidAt": order.paid_at.isoformat() if order.paid_at else None,
        }
        for order in orders
    ]

    return render(request, "Student/Orders", {"orders": orders_data})
