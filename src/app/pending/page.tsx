import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { signOut } from "@/app/actions/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function PendingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main id="main" className="flex min-h-[70vh] items-center justify-center px-5 py-24">
      <Container className="max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep">
          Authentication Required
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight">Access Pending</h1>
        <p className="mt-4 max-w-md text-base leading-7 text-mn-ink-soft">
          You are logged in as <strong>{user.email}</strong>. However, owner
          authorization has not yet been configured.
        </p>
        <form action={signOut} className="mt-8">
          <ButtonLink href="/" variant="secondary">
            Sign Out
          </ButtonLink>
        </form>
      </Container>
    </main>
  );
}