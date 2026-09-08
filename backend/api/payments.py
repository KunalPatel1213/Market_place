from __future__ import annotations

import logging
from decimal import Decimal

import stripe
from django.conf import settings
from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order, OrderItem, Product
from .serializers import OrderSerializer

logger = logging.getLogger(__name__)


class CreateCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        items = request.data.get("items")
        if not isinstance(items, list) or not items:
            return Response({"detail": "Your cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        requested: dict[int, int] = {}
        for item in items:
            if not isinstance(item, dict):
                return Response({"detail": "Each cart item must include productId and quantity."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                product_id = int(item["productId"])
                quantity = int(item["quantity"])
            except (KeyError, TypeError, ValueError):
                return Response({"detail": "Each cart item must include a valid productId and quantity."}, status=status.HTTP_400_BAD_REQUEST)
            if quantity <= 0:
                return Response({"detail": "Product quantities must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)
            requested[product_id] = requested.get(product_id, 0) + quantity

        products = {
            product.id: product
            for product in Product.objects.select_for_update().filter(id__in=requested, is_active=True)
        }
        missing = sorted(set(requested) - set(products))
        if missing:
            return Response({"detail": f"Product(s) not found: {', '.join(map(str, missing))}."}, status=status.HTTP_400_BAD_REQUEST)
        for product_id, quantity in requested.items():
            if quantity > products[product_id].stock_quantity:
                return Response({"detail": f"Only {products[product_id].stock_quantity} unit(s) of {products[product_id].name} are available."}, status=status.HTTP_400_BAD_REQUEST)

        total = sum((products[product_id].price * quantity for product_id, quantity in requested.items()), Decimal("0"))
        order = Order.objects.create(buyer=request.user, total=total, status="pending")
        OrderItem.objects.bulk_create([
            OrderItem(order=order, product=products[product_id], quantity=quantity, unit_price=products[product_id].price)
            for product_id, quantity in requested.items()
        ])

        line_items = [
            {
                "price_data": {
                    "currency": "inr",
                    "product_data": {"name": products[product_id].name},
                    "unit_amount": int(products[product_id].price * 100),
                },
                "quantity": quantity,
            }
            for product_id, quantity in requested.items()
        ]

        if not settings.STRIPE_SECRET_KEY or settings.STRIPE_SECRET_KEY.endswith("replace_me"):
            logger.error("Stripe checkout requested without STRIPE_SECRET_KEY")
            return Response({"detail": "Payments are not configured."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        stripe.api_key = settings.STRIPE_SECRET_KEY
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=line_items,
                mode="payment",
                success_url=f"{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/checkout/cancel",
                customer_email=request.user.email or None,
                metadata={"order_id": str(order.id)},
                payment_intent_data={"metadata": {"order_id": str(order.id)}},
            )
        except stripe.StripeError:
            logger.exception("Stripe Checkout Session creation failed for order %s", order.id)
            transaction.set_rollback(True)
            return Response({"detail": "We could not start checkout. Please try again."}, status=status.HTTP_502_BAD_GATEWAY)

        order.stripe_checkout_session = session.id
        order.save(update_fields=["stripe_checkout_session", "updated_at"])
        return Response({"checkout_url": session.url, "order": OrderSerializer(order).data}, status=status.HTTP_200_OK)
