"use client";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { createUpdateLook } from "@/app/actions/admin";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export default function NewLookPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createUpdateLook(fd);
      if (result.ok) {
        router.push("/admin/looks");
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="py-12 lg:py-24">
      <Container className="max-w-3xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl tracking-tight lg:text-5xl">New Look</h1>
          <p className="mt-2 text-mn-ink-soft">Create a new portfolio look.</p>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-mn-error/10 px-3 py-2 text-sm text-mn-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value="" />

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-mn-ink">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong"
              )}
              placeholder="e.g., Soft Mornings"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-mn-ink">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong"
              )}
              placeholder="soft-mornings"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="story" className="block text-sm font-medium text-mn-ink">Story</label>
            <textarea
              id="story"
              name="story"
              rows={4}
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong"
              )}
              placeholder="Tell the story behind this look..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium text-mn-ink">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong"
              )}
              placeholder="pink, pearl, everyday, bridal"
            />
            <p className="text-xs text-mn-ink-soft">Comma-separated tags for filtering.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="media" className="block text-sm font-medium text-mn-ink">Hero Image</label>
            <input
              type="file"
              id="media"
              name="media"
              accept="image/jpeg,image/png,image/webp"
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-mn-blush file:text-mn-rose-deep"
              )}
            />
            <p className="text-xs text-mn-ink-soft">JPEG, PNG, or WebP. Max 4MB.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="is_published" className="flex items-center gap-2">
                <input type="checkbox" id="is_published" name="is_published" value="true" className="rounded border-mn-border-strong text-mn-rose-deep focus-visible:ring-2 focus-visible:ring-mn-rose-ink" />
                <span className="text-sm font-medium text-mn-ink">Published</span>
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="sort_order" className="block text-sm font-medium text-mn-ink">Sort Order</label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                min="0"
                step="1"
                defaultValue="0"
                className={cn(
                  "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                  "border-mn-border-strong"
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-4 border-t border-mn-border">
            <ButtonLink href="/admin/looks" variant="secondary">Cancel</ButtonLink>
            <button type="submit" disabled={pending} className={cn(
              "flex-1 min-h-12 rounded-full bg-mn-rose-deep px-6 text-base font-medium text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
              "motion-safe:transition-transform motion-safe:active:scale-[0.98]",
              pending ? "opacity-60" : ""
            )}>
              {pending ? "Saving…" : "Create Look"}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}