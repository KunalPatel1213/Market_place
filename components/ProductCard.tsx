"use client";

import Image from "next/image";
import { Check, CreditCard, Heart, Star } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export type Product = {
  id: number;
  name: string;
  seller: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
};

type ProductCardProps = { product: Product };
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ProductCard({ product }: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { addItem } = useCart();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({ productId: product.id, title: product.name, price: product.price, image: product.image, sellerId: product.seller });
    setIsAdded(true);
    toast.success("Added to cart", { description: `${product.name} is ready for checkout.` });
  };

  const handleBuyNow = async () => {
    if (!isLoaded) return toast.info("Checking your login session...");
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent("/marketplace")}`);
      return;
    }
    setIsBuying(true);
    try {
      const token = await getToken({ skipCache: true });
      if (!token) throw new Error("Your session has expired. Please sign in again.");
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/payments/create-checkout-session/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: [{ productId: product.id, quantity: 1 }] }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.checkout_url) throw new Error(data.detail ?? "Unable to start checkout.");
      window.location.href = data.checkout_url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start checkout.");
      setIsBuying(false);
    }
  };

  return (
    <article className="group rounded-2xl border border-primary/10 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-soft">
        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw" />
        <button type="button" onClick={() => setIsSaved(!isSaved)} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-primary shadow-sm transition-all duration-300 hover:scale-110 hover:bg-white" aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={isSaved}>
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-2 pt-4">
        <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-primary/55">{product.category}</span><span className="flex items-center gap-1 text-xs font-bold text-primary"><Star size={13} fill="currentColor" className="text-secondary" /> {product.rating} <span className="font-normal text-primary/45">({product.reviews})</span></span></div>
        <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-bold leading-6 text-primary">{product.name}</h3>
        <p className="mt-2 flex items-center gap-1 text-xs text-primary/65">{product.seller}<span className="inline-flex items-center gap-0.5 rounded-full bg-soft px-1.5 py-0.5 font-semibold text-primary"><Check size={11} strokeWidth={3} /> Verified</span></p>
        <p className="mt-4 text-lg font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</p>
        <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={handleAddToCart} className="rounded-lg border border-primary/20 px-2 py-2 text-xs font-bold text-primary transition-all duration-300 hover:border-secondary hover:bg-soft">{isAdded ? "Added" : "Add to cart"}</button><button type="button" onClick={handleBuyNow} disabled={isBuying} className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-2 py-2 text-xs font-bold text-white transition-all duration-300 hover:bg-secondary disabled:cursor-wait disabled:opacity-60"><CreditCard size={13} />{isBuying ? "Opening..." : "Buy now"}</button></div>
      </div>
    </article>
  );
}

export function ProductSkeleton() {
  return <div className="animate-pulse rounded-2xl border border-primary/10 bg-white p-3"><div className="aspect-square rounded-xl bg-soft" /><div className="space-y-3 p-2 pt-4"><div className="h-3 w-1/3 rounded bg-soft" /><div className="h-5 w-4/5 rounded bg-soft" /><div className="h-3 w-1/2 rounded bg-soft" /><div className="h-9 rounded-lg bg-soft" /></div></div>;
}
