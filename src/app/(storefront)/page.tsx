import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ProductCardData } from "@/components/catalogue/product-card-data";
import { LookCardData } from "@/components/catalogue/look-card-data";
import { ServiceCardData } from "@/components/catalogue/service-card-data";
import { DevelopmentBanner } from "@/components/catalogue/development-banner";
import { getProducts, getLooks, getServices } from "@/lib/catalogue/queries";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { Reveal } from "@/components/ui/reveal";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function HomePage() {
  const [products, looks, services] = await Promise.all([
    getProducts(),
    getLooks(),
    getServices(),
  ]);

  const hasFixture =
    products.some((p) => p.isFixture) ||
    looks.some((l) => l.isFixture) ||
    services.some((s) => s.isFixture);

  return (
    <main id="main">
      {hasFixture && <DevelopmentBanner />}

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-12 pt-8 lg:pb-24 lg:pt-12">
        <Container>
          <div className="grid grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="col-span-12 lg:col-span-5 relative z-10">
              <p className="hero-enter text-[13px] font-medium uppercase tracking-[0.16em] text-mn-rose-deep">
                Independent nail artist
              </p>
              <h1 className="hero-enter hero-enter-delay-1 mt-5 font-display text-[3rem] leading-[1.05] tracking-tight lg:text-[5.5rem] lg:leading-[0.95]">
                Nail art, made <span className="italic text-mn-rose-deep">by hand</span>.
              </h1>
              <p className="hero-enter hero-enter-delay-2 mt-6 max-w-md text-[1.125rem] leading-7 text-mn-ink-soft">
                Press-on sets and nail services by [Artist name]. A small studio practice, made slowly and finished by hand.
              </p>
              <div className="hero-enter hero-enter-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/shop">Shop sets</ButtonLink>
                <ButtonLink href="/looks" variant="ghost" className="inline-flex items-center gap-2">
                  See the looks
                  <span aria-hidden="true">→</span>
                </ButtonLink>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-7 relative lg:-mr-12 xl:-mr-24">
              <div className="hero-image-enter relative aspect-[4/5] lg:aspect-auto lg:h-[65vh] lg:max-h-[700px] overflow-hidden rounded-[2rem] lg:rounded-l-[2rem] lg:rounded-r-none shadow-float">
                <PlaceholderMedia
                  className="absolute inset-0 h-full w-full"
                  label="Hero photography pending"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-mn-canvas/90 to-transparent"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Products Section */}
      {products.length > 0 && (
        <section className="border-t border-mn-border py-12 lg:py-24">
          <Reveal>
            <Container>
              <div className="flex items-end justify-between gap-6">
                <h2 className="font-display text-[1.625rem] leading-8 tracking-tight lg:text-[2.375rem] lg:leading-[2.75rem]">
                  New and favourites
                </h2>
                <ButtonLink href="/shop" variant="ghost" className="hidden sm:inline-flex">
                  View all
                </ButtonLink>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
                {products.slice(0, 4).map((p) => (
                  <ProductCardData key={p.id} product={p} />
                ))}
              </div>
            </Container>
          </Reveal>
        </section>
      )}

      {/* Looks Section */}
      {looks.length > 0 && (
        <section className="border-t border-mn-border bg-mn-surface-3 py-12 lg:py-24">
          <Reveal>
            <Container>
              <div className="flex items-end justify-between gap-6">
                <h2 className="font-display text-[1.625rem] leading-8 tracking-tight lg:text-[2.375rem] lg:leading-[2.75rem]">
                  Recent looks
                </h2>
                <ButtonLink href="/looks" variant="ghost" className="hidden sm:inline-flex">
                  See all looks
                </ButtonLink>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
                {looks.slice(0, 4).map((l) => (
                  <LookCardData key={l.id} look={l} />
                ))}
              </div>
            </Container>
          </Reveal>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="border-t border-mn-border py-12 lg:py-24">
          <Reveal>
            <Container>
              <h2 className="font-display text-[1.625rem] leading-8 tracking-tight lg:text-[2.375rem] lg:leading-[2.75rem]">
                Services
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {services.map((s) => (
                  <ServiceCardData key={s.id} service={s} />
                ))}
              </div>
            </Container>
          </Reveal>
        </section>
      )}
    </main>
  );
}