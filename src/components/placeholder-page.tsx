import Link from "next/link";

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main id="main" className="flex min-h-[60vh] items-center justify-center px-5 py-24">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep">
          Preview placeholder
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight">{title}</h1>
        <p className="mt-4 text-base leading-7 text-mn-ink-soft">{description}</p>
        <Link
          href="/design-preview"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-mn-rose-deep px-6 text-base font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas"
        >
          Back to preview
        </Link>
      </div>
    </main>
  );
}