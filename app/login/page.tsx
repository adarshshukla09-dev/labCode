import { AuthSignupCard } from "@/components/blocks/auth-signup-card";

export default function SignupPage() {
  return (
    <main className="h-dvh overflow-hidden">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
        <AuthSignupCard />
      </div>
    </main>
  );
}