import { Container } from "@/components/ui/container";
import { ProductCardData } from "@/components/catalogue/product-card-data";
import { EmptyState } from "@/components/catalogue/empty-state";
import { DevelopmentBannerInline } from "@/components/catalogue/development-banner-inline";
import { Reveal } from "@/components/ui/reveal";
import { getProducts } from "@/lib/catalogue/queries";
import { MediaImage } from "@/components/catalogue/media-image";
import { formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button-link";
import Link from "next/link";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function buildFilterHref(current: { shape?: string; length?: string }, patch: { shape?: string; length?: string }) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (next.shape) params.set("shape", next.shape);
  if (next.length) params.set("length", next.length);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ shape?: string | string[]; length?: string | string[] }>;
}) {
  const sp = await searchParams;
  const filters = { shape: first(sp.shape), length: first(sp.length) };

  const [allProducts, products] = await Promise.all([
    getProducts(),
    getProducts(filters),
  ]);

  const shapes = Array.from(new Set(allProducts.map((p) => p.shape).filter((s): s is string => Boolean(s)))).sort();
  const lengths = Array.from(new Set(allProducts.map((p) => p.length).filter((s): s is string => Boolean(s)))).sort();
  const hasFixture = products.some((p) => p.isFixture) || allProducts.some((p) => p.isFixture);
  const hasActiveFilters = Boolean(filters.shape || filters.length);

  return (
    <main id="main" className="py-8 lg:py-12">
      <Container>
        {hasFixture && <DevelopmentBannerInline />}
        
        <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Shop Sets</h1>

        {allProducts.length > 0 && (
          <div className="mt-8 mb-8 lg:mb-12">
            <Reveal>
              <div className="grid md:grid-cols-2 gap-8 items-center bg-mn-blush/30 p-6 sm:p-10 rounded-2xl">
                <div className="aspect-[4/5] md:aspect-auto md:h-[50vh] relative rounded-xl overflow-hidden">
                  <MediaImage
                    media={allProducts[0].media[0]}
                    isFixture={allProducts[0].isFixture}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="py-8 md:py-0">
                  <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-mn-rose-deep">Featured Set</p>
                  <h2 className="mt-4 font-display text-3xl lg:text-4xl">{allProducts[0].name}</h2>
                  <p className="mt-2 text-mn-ink-soft">{formatPrice(allProducts[0].priceMinor, allProducts[0].currency)}</p>
                  <div className="mt-8">
                    <ButtonLink href={`/products/${allProducts[0].slug}`}>View set</ButtonLink>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-6 border-b border-mn-border pb-4">
          <Link
            href="/shop"
            className={cn("text-sm pb-4 -mb-[1px] border-b-2 transition-colors", !hasActiveFilters ? "border-mn-rose-deep text-mn-ink font-medium" : "border-transparent text-mn-ink-soft hover:text-mn-ink")}
          >
            All
          </Link>
          {shapes.map((s) => {
            const selected = filters.shape === s;
            return (
              <Link
                key={s}
                href={buildFilterHref(filters, { shape: selected ? undefined : s })}
                aria-pressed={selected}
                className={cn("text-sm pb-4 -mb-[1px] border-b-2 transition-colors", selected ? "border-mn-rose-deep text-mn-ink font-medium" : "border-transparent text-mn-ink-soft hover:text-mn-ink")}
              >
                {s}
              </Link>
            );
          })}
          {lengths.map((l) => {
            const selected = filters.length === l;
            return (
              <Link
                key={l}
                href={buildFilterHref(filters, { length: selected ? undefined : l })}
                aria-pressed={selected}
                className={cn("text-sm pb-4 -mb-[1px] border-b-2 transition-colors", selected ? "border-mn-rose-deep text-mn-ink font-medium" : "border-transparent text-mn-ink-soft hover:text-mn-ink")}
              >
                {l}
              </Link>
            );
          })}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <EmptyState
            title="No sets match these filters."
            actionHref="/shop"
            actionLabel="Clear filters"
          />
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            {products.map((p) => (
              <ProductCardData key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}