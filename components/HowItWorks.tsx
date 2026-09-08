import { ArrowUpRight, ImagePlus, PartyPopper, UserRound } from "lucide-react";

const steps = [
  ["01", UserRound, "Register in seconds", "Create your free seller profile with a quick, secure sign-up."],
  ["02", ImagePlus, "Add your product", "One photo, one price, and a few words. That is all you need."],
  ["03", PartyPopper, "Get paid securely", "Share your shop and receive payments through Stripe."],
] as const;

export default function HowItWorks() {
  return <section id="how-it-works" className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">The simple way in</p><h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight text-primary sm:text-5xl">From your hands to someone&apos;s home.</h2></div><p className="max-w-sm text-base leading-7 text-primary/65">No complicated dashboard. No confusing setup. Just a clear path to your first sale.</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{steps.map(([number, Icon, title, text]) => <article key={number} className="group rounded-2xl border border-primary/10 bg-base p-7 transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-lg"><div className="flex items-start justify-between"><span className="text-sm font-bold text-secondary">{number}</span><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-soft text-primary transition-colors group-hover:bg-secondary group-hover:text-white"><Icon size={23} /></span></div><h3 className="mt-12 text-xl font-bold text-primary">{title}</h3><p className="mt-3 leading-7 text-primary/65">{text}</p><ArrowUpRight className="mt-6 text-secondary" size={20} /></article>)}</div></div></section>;
}
