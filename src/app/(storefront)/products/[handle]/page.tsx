import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { DevelopmentBannerInline } from "@/components/catalogue/development-banner-inline";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/lib/catalogue/queries";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { BuyNowButton } from "@/components/cart/buy-now-button";
import { ProductGallery } from "@/components/catalogue/product-gallery";
import { Reveal } from "@/components/ui/reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductBySlug(handle);
  return {
    title: product ? `${product.name} — MoonzNails` : "Product not found — MoonzNails",
    robots: { index: false, follow: false },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductBySlug(handle);
  if (!product) notFound();

  const price = formatPrice(product.priceMinor, product.currency);

  return (
    <main id="main" className="pt-6 pb-0 lg:pt-8 lg:pb-24 relative flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="mx-auto max-w-[1600px] flex-1">
        {product.isFixture && <Container><DevelopmentBannerInline /></Container>}
        
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-start">
          
          {/* Image Column - Bleeds right */}
          <div className="relative pl-5 sm:pl-8 lg:pl-12 lg:sticky lg:top-24">
            <ProductGallery media={product.media} isFixture={product.isFixture} />
          </div>

          {/* Details Column */}
          <div className="px-5 sm:px-8 lg:px-0 lg:pr-12 lg:pt-4 pb-24 lg:pb-0">
            <Reveal>
              <h1 className="font-display text-4xl tracking-tight lg:text-6xl">
                {product.name}
              </h1>
              <p className="mt-4 text-xl text-mn-rose-deep">{price ?? "Price on request"}</p>

              {/* Meta Chips */}
              <div className="mt-8 flex flex-wrap gap-2">
                {product.shape && (
                  <span className="rounded-full bg-mn-blush px-4 py-1 text-sm">{product.shape}</span>
                )}
                {product.length && (
                  <span className="rounded-full bg-mn-blush px-4 py-1 text-sm">{product.length}</span>
                )}
                {product.finish && (
                  <span className="rounded-full bg-mn-blush px-4 py-1 text-sm">{product.finish}</span>
                )}
              </div>

              {product.description && (
                <p className="mt-8 text-base leading-7 text-mn-ink-soft max-w-prose">
                  {product.description}
                </p>
              )}

              {/* Add to Cart - Desktop */}
              <div className="mt-12 hidden lg:block">
                {product.priceMinor !== null && !product.isFixture ? (
                  <div className="flex flex-col gap-3">
                    <AddToCartButton productId={product.id} />
                    <BuyNowButton productId={product.id} />
                  </div>
                ) : (
                  <div className="rounded-2xl bg-mn-blush/50 p-6 text-center text-sm text-mn-ink-soft max-w-sm">
                    {product.isFixture ? "Sample item — not for purchase." : "Purchasing opens in a later release."}
                  </div>
                )}
              </div>

              {/* Accordions */}
              <div className="mt-12 border-t border-mn-border">
                <details className="group border-b border-mn-border py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    What is included
                    <span className="transition group-open:rotate-180">↓</span>
                  </summary>
                  <div className="mt-4 text-sm text-mn-ink-soft">
                    10 nails, nail glue, prep pad, mini file.
                  </div>
                </details>
                <details className="group border-b border-mn-border py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                    Care & Application
                    <span className="transition group-open:rotate-180">↓</span>
                  </summary>
                  <div className="mt-4 text-sm text-mn-ink-soft">
                    Apply on clean, dry nails. Avoid water for the first hour.
                  </div>
                </details>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      
      {/* Sticky Mobile CTA */}
      <div className="sticky bottom-0 left-0 right-0 z-40 border-t border-mn-border bg-mn-canvas p-4 lg:hidden mt-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-mn-rose-deep">{price}</p>
          </div>
          <div className="w-1/2">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </main>
  );
}