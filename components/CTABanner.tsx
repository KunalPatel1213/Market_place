import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return <section id="get-started" className="bg-primary px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-soft">Your next chapter starts here</p><h2 className="mt-3 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Ready to turn your craft into income?</h2></div><a href="#sign-up" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-base px-6 py-3.5 font-bold text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-soft">Join TrustKart free <ArrowRight size={18} /></a></div></section>;
}
