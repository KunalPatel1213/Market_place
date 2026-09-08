"use client";

import Link from "next/link";
import { CheckCircle2, PackageCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const hasClearedCart = useRef(false);
  useEffect(() => {
    if (!hasClearedCart.current) {
      hasClearedCart.current = true;
      clearCart();
    }
  }, [clearCart]);

  return <><Navbar /><main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-base px-5 py-16"><section className="w-full max-w-lg rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-lg sm:p-12"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-soft text-primary"><CheckCircle2 size={34} /></span><p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-secondary">Payment confirmed</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-primary">Thank you for supporting makers.</h1><p className="mt-4 leading-7 text-primary/65">Your order is on its way to the seller. We&apos;ll keep you posted as it moves forward.</p><div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-primary"><PackageCheck size={18} className="text-secondary" /> Your cart has been cleared</div><Link href="/marketplace" className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-secondary">Continue shopping</Link></section></main></>;
}
