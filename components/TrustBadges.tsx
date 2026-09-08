import { BadgeCheck, CreditCard, MousePointerClick, ShieldCheck } from "lucide-react";

const badges = [
  [CreditCard, "Secure payments", "Protected by Stripe"],
  [BadgeCheck, "Verified sellers", "Real people, real craft"],
  [MousePointerClick, "1-click listings", "Go live in minutes"],
  [ShieldCheck, "No GST to start", "Begin without the paperwork"],
] as const;

export default function TrustBadges() {
  return <section className="border-y border-primary/10 bg-white/45"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-7 sm:px-8 lg:grid-cols-4 lg:px-10">{badges.map(([Icon, title, text]) => <div key={title} className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary"><Icon size={19} /></span><div><p className="text-sm font-bold text-primary">{title}</p><p className="mt-0.5 text-xs text-primary/60">{text}</p></div></div>)}</div></section>;
}
