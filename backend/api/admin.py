from django.contrib import admin

from .models import Order, OrderItem, Product, User

admin.site.register(User)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
