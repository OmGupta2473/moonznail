import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main id="main" className="py-12 lg:py-24">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep">Order not found</p>
          <h1 className="mt-4 font-display text-4xl tracking-tight">404</h1>
          <p className="mt-4 text-base leading-7 text-mn-ink-soft">
            This order could not be found. Please check your order number and try again.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-mn-border-strong px-6 py-3 text-sm font-medium hover:bg-mn-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas"
            >
              Back to home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
