from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .payments import CreateCheckoutSessionView
from .views import CategoryListView, HealthView, ProductViewSet
from .webhooks import stripe_webhook

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")

urlpatterns = [
    path("health/", HealthView.as_view(), name="health"),
    path("categories/", CategoryListView.as_view(), name="categories"),
    path("payments/create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path("webhooks/stripe/", stripe_webhook, name="stripe-webhook"),
    path("", include(router.urls)),
]
