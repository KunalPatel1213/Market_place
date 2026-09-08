from __future__ import annotations

import json
from decimal import Decimal

import stripe
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import APIException, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order, OrderItem, Product
from .serializers import OrderSerializer, ProductSerializer


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "trustkart-api"})


class CategoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response([{"value": value, "label": label} for value, label in Product.CATEGORY_CHOICES])


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related("seller")
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")
        if category:
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        if not self.request.user.is_seller:
            self.request.user.is_seller = True
            self.request.user.save(update_fields=["is_seller"])
        serializer.save(seller=self.request.user)


class OrderCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        if not settings.STRIPE_SECRET_KEY or settings.STRIPE_SECRET_KEY.endswith("replace_me"):
            raise APIException("Stripe is not configured.", code="stripe_not_configured")
        items = request.data.get("items", [])
        if not isinstance(items, list) or not items:
            raise ValidationError({"items": "Provide at least one product and quantity."})

        product_ids = [item.get("product_id") for item in items if isinstance(item, dict)]
        products = {product.id: product for product in Product.objects.filter(id__in=product_ids, is_active=True)}
        if len(products) != len(set(product_ids)):
            raise ValidationError({"items": "One or more products are unavailable."})

        normalized_items = []
        total = Decimal("0")
        for item in items:
            try:
                product = products[int(item["product_id"])]
                quantity = int(item["quantity"])
            except (KeyError, TypeError, ValueError):
                raise ValidationError({"items": "Each item needs a valid product_id and quantity."})
            if quantity < 1 or quantity > 99:
                raise ValidationError({"items": "Quantity must be between 1 and 99."})
            total += product.price * quantity
            normalized_items.append((product, quantity))

        order = Order.objects.create(buyer=request.user, total=total)
        OrderItem.objects.bulk_create([OrderItem(order=order, product=product, quantity=quantity, unit_price=product.price) for product, quantity in normalized_items])
        stripe.api_key = settings.STRIPE_SECRET_KEY
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(total * 100),
                currency="inr",
                automatic_payment_methods={"enabled": True},
                metadata={"order_id": str(order.id), "buyer_id": str(request.user.id)},
            )
        except stripe.StripeError as exc:
            order.delete()
            raise APIException("Unable to create Stripe payment.") from exc
        order.stripe_payment_intent = intent.id
        order.save(update_fields=["stripe_payment_intent", "updated_at"])
        return Response({"order": OrderSerializer(order).data, "client_secret": intent.client_secret}, status=status.HTTP_201_CREATED)


@csrf_exempt
@transaction.atomic
def stripe_webhook(request):
    signature = request.headers.get("Stripe-Signature", "")
    try:
        event = stripe.Webhook.construct_event(request.body, signature, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.SignatureVerificationError):
        return JsonResponse({"detail": "Invalid webhook."}, status=400)

    event_type = event["type"]
    payment_intent = event["data"]["object"]
    order_id = payment_intent.get("metadata", {}).get("order_id")
    if order_id and event_type in {"payment_intent.succeeded", "payment_intent.payment_failed"}:
        Order.objects.filter(id=order_id).update(status="paid" if event_type.endswith("succeeded") else "cancelled")
    return JsonResponse({"received": True})


class StripeWebhookView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def dispatch(self, request, *args, **kwargs):
        return stripe_webhook(request)
