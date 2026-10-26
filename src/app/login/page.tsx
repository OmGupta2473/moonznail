import { Container } from "@/components/ui/container";
import { LoginForm } from "./LoginForm";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main id="main" className="flex min-h-[70vh] items-center justify-center px-5 py-24">
      <Container className="max-w-md">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep">
            Owner Access
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight">Sign in</h1>
          <p className="mt-4 text-base leading-7 text-mn-ink-soft">
            Enter your email to receive a magic link. No password needed.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-mn-border bg-mn-canvas p-8 shadow-1">
          <LoginForm />
        </div>
      </Container>
    </main>
  );
}