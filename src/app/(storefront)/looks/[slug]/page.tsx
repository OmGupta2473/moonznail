import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { MediaImage } from "@/components/catalogue/media-image";
import { ProductCardData } from "@/components/catalogue/product-card-data";
import { ServiceCardData } from "@/components/catalogue/service-card-data";
import { DevelopmentBannerInline } from "@/components/catalogue/development-banner-inline";
import { Reveal } from "@/components/ui/reveal";
import { getLookBySlug } from "@/lib/catalogue/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const look = await getLookBySlug(slug);
  return {
    title: look ? `${look.title} — MoonzNails` : "Look not found — MoonzNails",
    robots: { index: false, follow: false },
  };
}

export default async function LookPage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const paramsResolved = await params;
  const slug = Array.isArray(paramsResolved.slug) ? paramsResolved.slug[0] : paramsResolved.slug;
  const look = await getLookBySlug(slug);
  if (!look) notFound();

  const hasFixture =
    look.isFixture ||
    look.products.some((p) => p.isFixture) ||
    look.services.some((s) => s.isFixture);

  return (
    <main id="main" className="py-12 lg:py-24">
      <div className="mx-auto max-w-[1600px]">
        {hasFixture && <Container><DevelopmentBannerInline /></Container>}

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-start">
          
          {/* Image Column - Bleeds right */}
          <div className="relative pl-5 sm:pl-8 lg:pl-12">
            <Reveal>
              <div className="aspect-[4/5] lg:aspect-auto lg:h-[80vh] w-full rounded-2xl lg:rounded-r-none overflow-hidden">
                <MediaImage
                  media={look.media[0]}
                  isFixture={look.isFixture}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </Reveal>
          </div>

          {/* Details Column */}
          <div className="px-5 sm:px-8 lg:px-0 lg:pr-24 lg:pt-12 pb-24 lg:pb-0">
            <Reveal>
              <h1 className="font-display text-4xl tracking-tight lg:text-6xl">
                {look.title}
              </h1>
              
              {look.story && (
                <p className="mt-6 text-base leading-7 text-mn-ink-soft max-w-prose">
                  {look.story}
                </p>
              )}

              {look.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {look.tags.map(t => <span key={t} className="rounded-full bg-mn-blush px-3 py-1 text-xs text-mn-ink-soft">{t}</span>)}
                </div>
              )}

              <div className="mt-12">
                <ButtonLink href={`/services/enquire?look=${encodeURIComponent(look.slug)}&lookTitle=${encodeURIComponent(look.title)}`}>
                  Request this look
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Linked Products & Services below, keep existing logic */}
        <div className="mt-24">
          <Container>
            {look.products.length > 0 && (
              <section className="border-t border-mn-border pt-12">
                <Reveal>
                  <h2 className="font-display text-2xl">Sets in this look</h2>
                  <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
                    {look.products.map((p) => (
                      <ProductCardData key={p.id} product={p} />
                    ))}
                  </div>
                </Reveal>
              </section>
            )}

            {look.services.length > 0 && (
              <section className="mt-16 border-t border-mn-border pt-12">
                <Reveal>
                  <h2 className="font-display text-2xl">Services</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {look.services.map((s) => (
                      <ServiceCardData key={s.id} service={s} />
                    ))}
                  </div>
                </Reveal>
              </section>
            )}
          </Container>
        </div>
      </div>
    </main>
  );
}