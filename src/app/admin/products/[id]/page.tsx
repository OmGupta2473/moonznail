"use client";
import { useParams, useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { createUpdateProduct, getProductForEdit } from "@/app/actions/admin";
import { cn } from "@/lib/cn";

export default function EditProductPage() {
  const paramsResolved = useParams();
  const id = Array.isArray(paramsResolved.id) ? paramsResolved.id[0] : paramsResolved.id;
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<{
    id: string; name: string; slug: string; description: string | null;
    price_minor: number | null; currency: string | null; shape: string | null;
    length: string | null; finish: string | null; is_published: boolean;
    sort_order: number;
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    startTransition(async () => {
      const result = await getProductForEdit(id);
      if (!result.ok) {
        setError(result.message);
      } else if (result.data) {
        setProduct(result.data);
      }    });
  }, [id]);

  if (!product) return null;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("id", product.id);
    startTransition(async () => {
      const result = await createUpdateProduct(fd);
      if (result.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div className="py-12 lg:py-24">
      <Container className="max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Edit Product</h1>
            <p className="mt-2 text-mn-ink-soft">Editing: {product.name}</p>
          </div>
          <a href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-mn-rose-deep underline-offset-2 hover:underline">
            View on site →
          </a>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-mn-error/10 px-3 py-2 text-sm text-mn-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={product.id} />

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-mn-ink">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={product.name}
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong"
              )}
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
              defaultValue={product.slug}
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong"
              )}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-mn-ink">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product.description || ""}
              className={cn(
                "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                "border-mn-border-strong"
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="price_minor" className="block text-sm font-medium text-mn-ink">Price (in minor units/cents) *</label>
              <input
                type="number"
                id="price_minor"
                name="price_minor"
                required
                min="0"
                step="1"
                defaultValue={product.price_minor?.toString() || ""}
                className={cn(
                  "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                  "border-mn-border-strong"
                )}
              />
              <p className="text-xs text-mn-ink-soft">Price in cents (e.g., 3200 = $32.00)</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="block text-sm font-medium text-mn-ink">Currency (ISO 4217) *</label>
              <input
                type="text"
                id="currency"
                name="currency"
                required
                maxLength={3}
                defaultValue={product.currency || "USD"}
                className={cn(
                  "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70 uppercase",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                  "border-mn-border-strong"
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="shape" className="block text-sm font-medium text-mn-ink">Shape</label>
              <input
                type="text"
                id="shape"
                name="shape"
                defaultValue={product.shape || ""}
                className={cn(
                  "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                  "border-mn-border-strong"
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="length" className="block text-sm font-medium text-mn-ink">Length</label>
              <input
                type="text"
                id="length"
                name="length"
                defaultValue={product.length || ""}
                className={cn(
                  "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                  "border-mn-border-strong"
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="finish" className="block text-sm font-medium text-mn-ink">Finish</label>
              <input
                type="text"
                id="finish"
                name="finish"
                defaultValue={product.finish || ""}
                className={cn(
                  "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                  "border-mn-border-strong"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="media" className="block text-sm font-medium text-mn-ink">Main Image</label>
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
            <p className="text-xs text-mn-ink-soft">JPEG, PNG, or WebP. Max 4MB. Leave empty to keep current image.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="is_published" className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  value="true"
                  defaultChecked={product.is_published}
                  className="rounded border-mn-border-strong text-mn-rose-deep focus-visible:ring-2 focus-visible:ring-mn-rose-ink"
                />
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
                defaultValue={product.sort_order?.toString() || "0"}
                className={cn(
                  "w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
                  "border-mn-border-strong"
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row pt-4 border-t border-mn-border">
            <ButtonLink href="/admin/products" variant="secondary">
              Cancel
            </ButtonLink>
            <button type="submit" disabled={pending} className={cn(
              "flex-1 min-h-12 rounded-full bg-mn-rose-deep px-6 text-base font-medium text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
              "motion-safe:transition-transform motion-safe:active:scale-[0.98]",
              pending ? "opacity-60" : ""
            )}>
              {pending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
}