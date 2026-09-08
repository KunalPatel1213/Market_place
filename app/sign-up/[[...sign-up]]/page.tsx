import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import AuthLayout, { authAppearance } from "@/components/AuthLayout";

type SignUpPageProps = { searchParams: Promise<{ redirect_url?: string }> };

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const params = await searchParams;
  const redirectUrl = params.redirect_url?.startsWith("/") ? params.redirect_url : "/";
  return <AuthLayout mode="sign-up"><div><h2 className="text-3xl font-bold tracking-tight text-primary">Create your account</h2><p className="mt-2 text-primary/60">Join TrustKart as a maker or a curious buyer.</p>{hasClerk ? <div className="mt-8"><SignUp appearance={authAppearance} routing="path" path="/sign-up" signInUrl={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`} fallbackRedirectUrl={redirectUrl} /></div> : <div className="mt-8 rounded-xl border border-primary/10 bg-white p-5 text-sm leading-6 text-primary/70">Add <code className="rounded bg-soft px-1.5 py-0.5 text-primary">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to enable Clerk sign up.</div>}<p className="mt-7 text-center text-sm text-primary/65">Already have an account? <Link href={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`} className="font-bold text-primary hover:text-secondary">Log in</Link></p></div></AuthLayout>;
}
