from __future__ import annotations

import logging

import stripe
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Order

logger = logging.getLogger(__name__)


@csrf_exempt
def stripe_webhook(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed."}, status=405)
    if not settings.STRIPE_WEBHOOK_SECRET:
        logger.error("Stripe webhook received without STRIPE_WEBHOOK_SECRET")
        return JsonResponse({"detail": "Webhook is not configured."}, status=503)

    try:
        event = stripe.Webhook.construct_event(
            request.body,
            request.headers.get("Stripe-Signature", ""),
            settings.STRIPE_WEBHOOK_SECRET,
        )
    except (ValueError, stripe.SignatureVerificationError):
        return JsonResponse({"detail": "Invalid webhook signature."}, status=400)

    event_type = event["type"]
    payload = event["data"]["object"]
    metadata = payload.get("metadata", {})
    order_id = metadata.get("order_id")
    if not order_id:
        return JsonResponse({"received": True})

    if event_type == "checkout.session.completed":
        with transaction.atomic():
            order = Order.objects.select_for_update().prefetch_related("items__product").filter(id=order_id).first()
            if order and order.status != "paid":
                for item in order.items.all():
                    product = item.product
                    product.stock_quantity -= item.quantity
                    product.save(update_fields=["stock_quantity", "updated_at"])
                order.status = "paid"
                order.save(update_fields=["status", "updated_at"])
    elif event_type == "payment_intent.payment_failed":
        Order.objects.filter(id=order_id, status="pending").update(status="cancelled")

    return JsonResponse({"received": True})
