import { BadgeCheck, Brush, Gem, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const authAppearance = {
  variables: {
    colorPrimary: "#3368A0",
    colorText: "#3368A0",
    colorTextSecondary: "#3368A0",
    colorBackground: "#F2EFE7",
    colorInputBackground: "#C8DFDB",
    colorInputText: "#3368A0",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "bg-transparent shadow-none w-full p-0",
    headerTitle: "text-primary text-2xl font-bold",
    headerSubtitle: "text-primary/60",
    formButtonPrimary: "bg-primary hover:bg-secondary transition-all duration-300 rounded-lg",
    formFieldInput: "rounded-lg border-primary/15 bg-soft focus:ring-2 focus:ring-primary",
    footerActionLink: "text-primary hover:text-secondary",
  },
};

type AuthLayoutProps = { children: ReactNode; mode: "sign-in" | "sign-up" };

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  return <main data-mode={mode} className="flex min-h-screen bg-base"><section className="relative hidden w-[40%] overflow-hidden bg-primary px-10 py-12 text-base lg:flex lg:flex-col lg:justify-between"><div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/90" /><div className="relative"><Link href="/" className="text-3xl font-bold tracking-tight">TrustKart<span className="text-soft">.</span></Link><div className="mt-28 max-w-md"><p className="text-sm font-bold uppercase tracking-[0.16em] text-soft">The marketplace for makers</p><h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight">Turn your craft into income.</h1><p className="mt-6 text-lg leading-8 text-white/75">Sell online with confidence, reach more people, and keep making what you love.</p><div className="mt-12 flex gap-3"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Gem size={27} /></span><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><Brush size={27} /></span><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15"><BadgeCheck size={27} /></span></div></div></div><div className="relative flex items-center gap-6 text-sm text-white/70"><span className="flex items-center gap-2"><ShieldCheck size={17} className="text-soft" /> Secured by Stripe</span><span className="flex items-center gap-2"><BadgeCheck size={17} className="text-soft" /> Verified by Clerk</span></div></section><section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-[60%] lg:px-12"><div className="w-full max-w-md rounded-2xl bg-base p-1 sm:p-8 sm:shadow-lg"><div className="mb-8 lg:hidden"><Link href="/" className="text-2xl font-bold text-primary">TrustKart<span className="text-secondary">.</span></Link></div>{children}<p className="mt-8 text-center text-xs leading-5 text-primary/50">By continuing, you agree to TrustKart&apos;s <a href="#terms" className="font-semibold text-primary underline">Terms</a> &amp; <a href="#privacy" className="font-semibold text-primary underline">Privacy Policy</a>.</p></div></section></main>;
}
