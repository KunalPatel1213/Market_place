"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function CartPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const { items, updateQuantity, removeItem, getTotal, isHydrated } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!items.length) return toast.error("Your cart is empty");
    if (!isLoaded) return toast.info("Checking your login session...");
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent("/cart")}`);
      return;
    }
    setIsCheckingOut(true);
    try {
      if (!API_BASE_URL.startsWith("http")) throw new Error("Payment server URL is not configured.");
      const token = await getToken({ skipCache: true });
      if (!token) throw new Error("Your session has expired. Please sign in again.");
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/payments/create-checkout-session/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        const authError = data.detail ?? "Your login session is not valid for this application.";
        await signOut();
        router.push(`/sign-in?redirect_url=${encodeURIComponent("/cart")}`);
        throw new Error(authError);
      }
      if (!response.ok || !data.checkout_url) throw new Error(data.detail ?? "Unable to start checkout.");
      window.location.href = data.checkout_url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start checkout. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return <><Navbar activeLink="marketplace" /><main className="min-h-screen bg-base px-5 py-10 sm:px-8 lg:px-10 lg:py-16"><div className="mx-auto max-w-6xl"><Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-secondary"><ArrowLeft size={17} /> Continue shopping</Link><div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start"><section className="min-w-0 flex-1"><h1 className="text-4xl font-bold tracking-tight text-primary">Your cart</h1>{!isHydrated ? <div className="mt-8 rounded-2xl bg-white p-8 text-primary/60">Loading your cart...</div> : items.length === 0 ? <div className="mt-8 rounded-2xl border border-primary/10 bg-white px-6 py-16 text-center"><h2 className="text-2xl font-bold text-primary">Your cart is waiting</h2><p className="mt-2 text-primary/60">Add something handmade and meaningful to get started.</p><Link href="/marketplace" className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-secondary">Explore products</Link></div> : <div className="mt-8 space-y-4">{items.map((item) => <article key={item.productId} className="flex gap-4 rounded-2xl border border-primary/10 bg-white p-4 sm:gap-5"><Image src={item.image} alt={item.title} width={112} height={112} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><h2 className="font-bold text-primary">{item.title}</h2><p className="mt-1 text-sm text-primary/55">by {item.sellerId}</p></div><button type="button" onClick={() => removeItem(item.productId)} className="rounded-lg p-2 text-primary/50 transition-colors hover:bg-soft hover:text-primary" aria-label={`Remove ${item.title}`}><Trash2 size={18} /></button></div><div className="mt-6 flex items-center justify-between"><div className="flex items-center rounded-lg border border-primary/15"><button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 text-primary hover:bg-soft" aria-label={`Decrease ${item.title} quantity`}><Minus size={15} /></button><span className="w-8 text-center text-sm font-bold text-primary">{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 text-primary hover:bg-soft" aria-label={`Increase ${item.title} quantity`}><Plus size={15} /></button></div><p className="font-bold text-primary">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p></div></div></article>)}</div>}</section><aside className="w-full rounded-2xl border border-primary/10 bg-white p-6 lg:sticky lg:top-28 lg:max-w-sm"><h2 className="text-xl font-bold text-primary">Order summary</h2><div className="mt-6 flex justify-between border-b border-primary/10 pb-4 text-primary/65"><span>Subtotal</span><span className="font-bold text-primary">₹{getTotal().toLocaleString("en-IN")}</span></div><div className="mt-4 flex justify-between text-lg font-bold text-primary"><span>Total</span><span>₹{getTotal().toLocaleString("en-IN")}</span></div><button type="button" onClick={handleCheckout} disabled={!items.length || isCheckingOut} className="mt-7 w-full rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition-all duration-300 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">{isCheckingOut ? "Opening secure checkout..." : "Proceed to checkout"}</button><p className="mt-4 flex items-center justify-center gap-2 text-xs text-primary/55"><ShieldCheck size={15} className="text-secondary" /> Secure payment powered by Stripe</p></aside></div></div></main></>;
}
