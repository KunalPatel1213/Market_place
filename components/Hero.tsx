import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-base">
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8 lg:py-24">
        <p className="mb-8 inline-flex items-center gap-2 rounded-full bg-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><span className="h-2 w-2 rounded-full bg-secondary" />Made for makers</p>
        <div className="relative">
          <span className="pointer-events-none absolute -right-8 -top-10 hidden text-7xl font-black leading-none text-primary/90 sm:block" aria-hidden="true">◆</span>
          <h1 className="max-w-5xl text-[clamp(3.4rem,9vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-primary">Turn your craft<br /><span className="text-secondary">into income.</span></h1>
        </div>
        <p className="mt-9 max-w-2xl text-base leading-7 text-primary/70 sm:text-lg sm:leading-8">List your handmade products in minutes, reach real customers, and get paid securely with TrustKart.</p>
        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a href="#get-started" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary">Start selling <ArrowRight size={18} /></a>
          <a href="#categories" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 px-7 py-4 font-bold text-primary transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:bg-soft"><Play size={17} fill="currentColor" /> Shop handmade</a>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-primary/65"><div className="flex -space-x-2">{["A", "M", "S"].map((letter) => <span key={letter} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-base bg-secondary text-xs font-bold text-white">{letter}</span>)}</div><span>Join 2,500+ independent makers</span></div>
      </div>
    </section>
  );
}
