import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ProductCardData } from "@/components/catalogue/product-card-data";
import { EmptyState } from "@/components/catalogue/empty-state";
import { DevelopmentBannerInline } from "@/components/catalogue/development-banner-inline";
import { getCollectionByHandle } from "@/lib/catalogue/queries";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);
  return {
    title: collection ? `${collection.title} — MoonzNails` : "Collection not found — MoonzNails",
    robots: { index: false, follow: false },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string | string[] }>;
}) {
  const paramsResolved = await params;
  const handle = Array.isArray(paramsResolved.handle) ? paramsResolved.handle[0] : paramsResolved.handle;
  const collection = await getCollectionByHandle(handle);
  if (!collection) notFound();

  const hasFixture =
    collection.isFixture || collection.products.some((p) => p.isFixture);

  return (
    <main id="main" className="py-12 lg:py-24">
      <Container>
        {hasFixture && <DevelopmentBannerInline />}
        <h1 className="font-display text-4xl tracking-tight lg:text-5xl">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-mn-ink-soft">
            {collection.description}
          </p>
        )}

        {collection.products.length === 0 ? (
          <EmptyState
            title="This collection is empty."
            actionHref="/shop"
            actionLabel="Browse all sets"
          />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            {collection.products.map((p) => (
              <ProductCardData key={p.id} product={p} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}