"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const links = [
  { label: "Home", href: "/#home", key: "home" },
  { label: "Marketplace", href: "/marketplace", key: "marketplace" },
  { label: "Sell with us", href: "/sell", key: "sell" },
  { label: "About", href: "/#why-trust-us", key: "about" },
];

function ClerkAuthActions() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <div className="h-9 w-20 animate-pulse rounded-full bg-soft" aria-hidden="true" />;
  if (isSignedIn) return <UserButton />;
  return <div className="flex items-center gap-2"><SignInButton mode="modal"><button className="hidden rounded-full px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft sm:inline-flex">Login</button></SignInButton><SignUpButton mode="modal"><button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary">Sign up</button></SignUpButton></div>;
}

function AuthActions() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return <div className="flex items-center gap-2"><Link href="/sign-in" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-soft sm:inline-flex">Login</Link><Link href="/sign-up" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary">Sign up</Link></div>;
  return <ClerkAuthActions />;
}

type NavbarProps = { activeLink?: string };

export default function Navbar({ activeLink = "home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-base/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/#home" className="shrink-0 text-2xl font-bold tracking-tight text-primary" aria-label="TrustKart home">
          TrustKart<span className="text-secondary">.</span>
        </Link>
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
          {links.map((link) => <a key={link.href} href={link.href} className={`relative text-sm font-medium transition-colors hover:text-primary ${activeLink === link.key ? "text-primary after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:bg-primary" : "text-primary/70"}`}>{link.label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <label className="flex w-44 items-center gap-2 rounded-full bg-soft/65 px-3 py-2 text-primary/55 xl:w-52"><Search size={16} /><span className="sr-only">Search products</span><input type="search" placeholder="Search products" className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-primary/55" /></label>
          <Link href="/cart" className="relative rounded-full p-2 text-primary transition-colors hover:bg-soft" aria-label="Open shopping cart"><ShoppingBag size={20} /><span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">{itemCount}</span></Link>
          <AuthActions />
        </div>
        <button type="button" className="rounded-lg p-2 text-primary xl:hidden" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isOpen && <div className="border-t border-primary/10 bg-base px-5 pb-5 pt-3 xl:hidden">
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors hover:bg-soft ${activeLink === link.key ? "bg-soft text-primary" : "text-primary/75"}`}>{link.label}</a>)}
        </nav>
        <div className="mt-3 flex items-center justify-between border-t border-primary/10 pt-3"><label className="flex items-center gap-2 rounded-full bg-soft/65 px-3 py-2 text-primary/55"><Search size={16} /><span className="sr-only">Search products</span><input type="search" placeholder="Search products" className="w-40 bg-transparent text-sm text-primary outline-none placeholder:text-primary/55" /></label><div className="flex items-center gap-2"><Link href="/cart" className="relative rounded-full p-2 text-primary" aria-label="Open shopping cart"><ShoppingBag size={20} /><span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">{itemCount}</span></Link><AuthActions /></div></div>
      </div>}
    </header>
  );
}
