import { AuthSignupCard } from "@/components/blocks/auth-signup-card";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to access your Labs learning account and interactive database practice.",
  robots: { index: false, follow: false },
};
export default function SignupPage() {
  return (
    <main className="h-dvh overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
        <AuthSignupCard />
      </div>
    </main>
  );
}
