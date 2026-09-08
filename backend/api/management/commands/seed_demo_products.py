from django.core.management.base import BaseCommand

from api.models import Product, User


PRODUCTS = [
    (1, "Hand-Painted Terracotta Vase", "Pottery", 1299, "https://images.unsplash.com/photo-1578500351865-d6c3706e6c21?auto=format&fit=crop&w=700&q=85"),
    (2, "Madhubani Wall Art", "Paintings & Art", 2400, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=700&q=85"),
    (3, "Handwoven Cotton Dupatta", "Textiles & Weaves", 1890, "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"),
    (4, "Beaded Silver Necklace", "Jewelry", 1650, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85"),
    (5, "Bamboo Wicker Basket", "Home Decor", 850, "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=700&q=85"),
    (6, "Indigo Block Print Cushion", "Home Decor", 720, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85"),
    (7, "Earthy Stoneware Mug Set", "Pottery", 1100, "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85"),
    (8, "Wildflower Gouache Print", "Paintings & Art", 950, "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=700&q=85"),
    (9, "Hand-Embroidered Sling Bag", "Textiles & Weaves", 1450, "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=85"),
    (10, "Brass Sun Catcher", "Others", 680, "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85"),
    (11, "Small-Batch Wildflower Honey", "Grocery & Essentials", 540, "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=700&q=85"),
    (12, "Rose Quartz Threader Earrings", "Jewelry", 1250, "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=85"),
]


class Command(BaseCommand):
    help = "Create local demo products matching the marketplace fixture IDs."

    def handle(self, *args, **options):
        seller, _ = User.objects.get_or_create(
            clerk_id="demo-seller",
            defaults={"username": "demo-seller", "email": "demo@trustkart.local", "is_seller": True, "is_verified": True},
        )
        for product_id, name, category, price, image_url in PRODUCTS:
            Product.objects.update_or_create(
                id=product_id,
                defaults={
                    "seller": seller,
                    "name": name,
                    "description": f"A thoughtfully made {name.lower()} from a TrustKart artisan.",
                    "category": category,
                    "price": price,
                    "image_url": image_url,
                    "stock_quantity": 25,
                    "is_active": True,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(PRODUCTS)} demo products with stock."))
