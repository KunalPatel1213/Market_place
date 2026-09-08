import Link from "next/link";
import { ArrowLeft, CircleX } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function CheckoutCancelPage() {
  return <><Navbar /><main className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-base px-5 py-16"><section className="w-full max-w-lg rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-lg sm:p-12"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-soft text-primary"><CircleX size={34} /></span><p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-secondary">Checkout cancelled</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-primary">Your cart is still here.</h1><p className="mt-4 leading-7 text-primary/65">No payment was taken. You can review your items and try again whenever you&apos;re ready.</p><Link href="/cart" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-secondary"><ArrowLeft size={17} /> Return to cart</Link></section></main></>;
}
