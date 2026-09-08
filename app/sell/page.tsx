"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ArrowLeft, CheckCircle2, ImagePlus, PackagePlus, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const categories = ["Pottery", "Textiles & Weaves", "Jewelry", "Home Decor", "Paintings & Art", "Grocery & Essentials", "Others"];

type FormState = { name: string; description: string; category: string; price: string; stock_quantity: string; image_url: string };
const initialForm: FormState = { name: "", description: "", category: "Pottery", price: "", stock_quantity: "1", image_url: "" };

export default function SellPage() {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoaded) return toast.info("Checking your login session...");
    if (!isSignedIn) return toast.error("Please sign in before adding a product.");
    setIsSaving(true);
    try {
      const token = await getToken({ skipCache: true });
      if (!token) throw new Error("Your session expired. Please sign in again.");
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/products/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), stock_quantity: Number(form.stock_quantity) }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error("Your session expired. Please sign in again.");
      if (!response.ok) throw new Error(Object.values(data).flat().join(" ") || data.detail || "Could not publish your product.");
      toast.success("Product published", { description: "Your product is now visible in the marketplace." });
      setForm(initialForm);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not publish your product.");
    } finally {
      setIsSaving(false);
    }
  };

  return <><Navbar activeLink="sell" /><main className="min-h-screen bg-base px-5 py-10 sm:px-8 lg:px-10 lg:py-16"><div className="mx-auto max-w-6xl"><Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary"><ArrowLeft size={17} /> Back to marketplace</Link><div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><section className="rounded-2xl bg-primary p-7 text-white shadow-lg sm:p-10"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15"><Store size={24} /></span><p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-soft">Seller studio</p><h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight">Put your work in front of people who care.</h1><p className="mt-5 leading-7 text-white/75">Add your product once, set your price, and let TrustKart handle the storefront and secure checkout.</p><div className="mt-10 space-y-4 text-sm text-white/80"><p className="flex items-center gap-3"><CheckCircle2 size={18} className="text-soft" /> No technical setup</p><p className="flex items-center gap-3"><ShieldCheck size={18} className="text-soft" /> Secure buyer payments</p><p className="flex items-center gap-3"><PackagePlus size={18} className="text-soft" /> Inventory tracking built in</p></div></section><section className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">New listing</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-primary">Add your product</h2><p className="mt-2 text-sm leading-6 text-primary/60">Share a few details and your product will be ready for buyers.</p></div><ImagePlus className="text-secondary" size={28} /></div>{!isLoaded || !isSignedIn ? <div className="mt-8 rounded-xl bg-soft/60 p-5 text-sm leading-6 text-primary/70">{!isLoaded ? "Checking your seller account..." : <>Please <Link href="/sign-in?redirect_url=%2Fsell" className="font-bold text-primary underline">sign in</Link> to publish a product.</>}</div> : <form onSubmit={submitProduct} className="mt-8 space-y-5"><div><label htmlFor="product-name" className="text-sm font-bold text-primary">Product name</label><input id="product-name" required maxLength={180} value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="e.g. Hand-painted terracotta vase" className="mt-2 w-full rounded-xl border border-primary/15 bg-base px-4 py-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></div><div><label htmlFor="product-description" className="text-sm font-bold text-primary">Description</label><textarea id="product-description" required rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Tell buyers what makes it special" className="mt-2 w-full resize-none rounded-xl border border-primary/15 bg-base px-4 py-3 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></div><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="product-category" className="text-sm font-bold text-primary">Category</label><select id="product-category" value={form.category} onChange={(event) => updateField("category", event.target.value)} className="mt-2 w-full rounded-xl border border-primary/15 bg-base px-4 py-3 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div><label htmlFor="product-price" className="text-sm font-bold text-primary">Price (₹)</label><input id="product-price" required min="1" step="0.01" type="number" value={form.price} onChange={(event) => updateField("price", event.target.value)} placeholder="1299" className="mt-2 w-full rounded-xl border border-primary/15 bg-base px-4 py-3 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div></div><div><label htmlFor="product-stock" className="text-sm font-bold text-primary">Available stock</label><input id="product-stock" required min="0" step="1" type="number" value={form.stock_quantity} onChange={(event) => updateField("stock_quantity", event.target.value)} className="mt-2 w-full rounded-xl border border-primary/15 bg-base px-4 py-3 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div><div><label htmlFor="product-image" className="text-sm font-bold text-primary">Product image URL</label><input id="product-image" required type="url" value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-primary/15 bg-base px-4 py-3 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /><p className="mt-2 text-xs text-primary/50">Use a clear image URL so buyers can see your product.</p></div><button type="submit" disabled={isSaving} className="w-full rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition-all duration-300 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Publishing product..." : "Publish product"}</button></form>}</section></div></div></main></>;
}
