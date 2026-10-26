import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="px-5 py-24 text-center">
      <h1 className="font-display text-3xl">Not found</h1>
      <p className="mt-4 text-mn-ink-soft">
        This page doesn&apos;t exist or has been unpublished.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-mn-rose-deep px-6 text-base font-medium text-white hover:bg-mn-rose-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas"
      >
        Back to shop
      </Link>
    </main>
  );
}