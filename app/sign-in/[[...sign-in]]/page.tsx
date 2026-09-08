import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import AuthLayout, { authAppearance } from "@/components/AuthLayout";

type SignInPageProps = { searchParams: Promise<{ redirect_url?: string }> };

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const params = await searchParams;
  const redirectUrl = params.redirect_url?.startsWith("/") ? params.redirect_url : "/";
  return <AuthLayout mode="sign-in"><div><h2 className="text-3xl font-bold tracking-tight text-primary">Welcome back</h2><p className="mt-2 text-primary/60">Log in to continue to your TrustKart account.</p>{hasClerk ? <div className="mt-8"><SignIn appearance={authAppearance} routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl={redirectUrl} /></div> : <div className="mt-8 rounded-xl border border-primary/10 bg-white p-5 text-sm leading-6 text-primary/70">Add <code className="rounded bg-soft px-1.5 py-0.5 text-primary">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to enable Clerk sign in.</div>}<p className="mt-7 text-center text-sm text-primary/65">New here? <Link href={`/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`} className="font-bold text-primary hover:text-secondary">Create an account</Link></p></div></AuthLayout>;
}
