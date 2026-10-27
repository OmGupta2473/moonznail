import { Container } from "@/components/ui/container";
import { LoginForm } from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — MoonzNails",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main id="main" className="flex min-h-[80vh] items-center justify-center px-5 py-24">
      <Container className="max-w-md">
        <div className="text-center">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-mn-rose-deep">
            Admin Access
          </p>
          <h1 className="mt-4 font-display text-4xl tracking-tight">Sign In</h1>
          <p className="mt-4 text-sm text-mn-ink-soft">
            Enter your credentials to access the dashboard.
          </p>
        </div>
        <LoginForm />
      </Container>
    </main>
  );
}