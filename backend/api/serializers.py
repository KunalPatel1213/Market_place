from rest_framework import serializers

from .models import Order, OrderItem, Product, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "clerk_id", "email", "first_name", "last_name", "is_seller")
        read_only_fields = fields


class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.display_name", read_only=True)
    verified_seller = serializers.BooleanField(source="seller.is_verified", read_only=True)

    class Meta:
        model = Product
        fields = ("id", "name", "description", "category", "price", "image_url", "stock_quantity", "seller_name", "verified_seller", "rating", "review_count", "created_at")
        read_only_fields = ("id", "seller_name", "verified_seller", "rating", "review_count", "created_at")

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_stock_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "product", "product_name", "quantity", "unit_price")
        read_only_fields = ("id", "product_name", "unit_price")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ("id", "status", "total", "stripe_payment_intent", "items", "created_at")
        read_only_fields = fields
