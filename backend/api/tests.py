from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate

from .payments import CreateCheckoutSessionView
from .models import Product, User


class PublicApiTests(APITestCase):
	@classmethod
	def setUpTestData(cls):
		seller = User.objects.create_user(
			username="clerk_test_seller",
			password="unused",
			clerk_id="user_test_seller",
			email="seller@example.com",
			is_seller=True,
			is_verified=True,
		)
		Product.objects.create(
			seller=seller,
			name="Test Terracotta Vase",
			description="A test handmade vase.",
			category="Pottery",
			price="1299.00",
			image_url="https://images.unsplash.com/test-vase",
		)

	def test_health_endpoint_is_public(self):
		response = self.client.get("/api/health/")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.json()["status"], "ok")

	def test_categories_endpoint_is_public(self):
		response = self.client.get("/api/categories/")
		self.assertEqual(response.status_code, 200)
		self.assertTrue(any(item["value"] == "Pottery" for item in response.json()))

	def test_products_can_be_browsed_and_searched(self):
		response = self.client.get("/api/products/?search=Terracotta")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.json()["count"], 1)
		self.assertEqual(response.json()["results"][0]["seller_name"], "seller@example.com")

	def test_checkout_requires_authentication(self):
		response = self.client.post(
			"/api/payments/create-checkout-session/",
			{"items": [{"productId": 1, "quantity": 1}]},
			format="json",
		)
		self.assertEqual(response.status_code, 401)

	def test_checkout_rejects_invalid_quantity_before_stripe(self):
		user = User.objects.get(clerk_id="user_test_seller")
		request = APIRequestFactory().post(
			"/api/payments/create-checkout-session/",
			{"items": [{"productId": 1, "quantity": 0}]},
			format="json",
		)
		force_authenticate(request, user=user)
		response = CreateCheckoutSessionView.as_view()(request)
		self.assertEqual(response.status_code, 400)
