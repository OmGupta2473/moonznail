import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ProductCardData } from "@/components/catalogue/product-card-data";
import { LookCardData } from "@/components/catalogue/look-card-data";
import { ServiceCardData } from "@/components/catalogue/service-card-data";
import { DevelopmentBanner } from "@/components/catalogue/development-banner";
import { getProducts, getLooks, getServices } from "@/lib/catalogue/queries";
import { Reveal } from "@/components/ui/reveal";
import { Carousel } from "@/components/ui/carousel";
import { ArtistCarousel } from "@/components/catalogue/artist-carousel";

export const revalidate = 300;
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

      {/* NEW: Video Hero */}
      <section className="relative w-full h-[calc(100svh-4rem)] lg:h-[calc(100svh-5rem)] overflow-hidden bg-mn-ink">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* Mobile Video (< 1024px) */}
          <source src="/videos/hero-mobile.mp4" type="video/mp4" media="(max-width: 1023px)" />
          {/* Desktop Video (>= 1024px) */}
          <source src="/videos/hero-desktop.mp4" type="video/mp4" media="(min-width: 1024px)" />
        </video>

        {/* Dark overlay to ensure text/button readability */}
        <div className="absolute inset-0 bg-mn-ink/30" aria-hidden="true" />

        {/* Centered CTA - moved slightly down */}
        <div className="absolute inset-0 flex items-center justify-center pt-24">
          <div className="text-center animate-hero-text">
            <h1 className="font-display text-[3.5rem] leading-none tracking-tight text-white mb-8 lg:text-[6rem]">
              Nail art, <br className="sm:hidden" /> made by hand.
            </h1>
            <ButtonLink
              href="/shop"
              className="border border-white bg-transparent text-white hover:bg-white hover:text-mn-ink px-10 py-4 text-sm tracking-[0.1em] uppercase font-medium transition-colors"
            >
              Shop Now
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Original Hero Section */}
      <section className="relative overflow-hidden pb-10 pt-6 lg:pb-16 lg:pt-10">
        <Container>
                <div className="grid grid-cols-12 gap-8 items-stretch relative">
            <div className="col-span-12 lg:col-span-5 relative z-10">
              <p className="hero-enter text-[13px] font-medium uppercase tracking-[0.16em] text-mn-rose-deep">
                Independent nail artist
              </p>
              <h1 className="hero-enter hero-enter-delay-1 mt-5 font-display text-[3rem] leading-[1.05] tracking-tight lg:text-[5.5rem] lg:leading-[0.95]">
                Nail art, made <span className="italic text-mn-rose-deep">by hand</span>.
              </h1>
              <p className="hero-enter hero-enter-delay-2 mt-6 max-w-md text-[1.125rem] leading-7 text-mn-ink-soft">
                Press-on sets and nail services by Nisha Gupta. A small studio practice, made slowly and finished by hand.
              </p>
              <div className="hero-enter hero-enter-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/shop">Shop sets</ButtonLink>
                <ButtonLink href="/looks" variant="ghost" className="inline-flex items-center gap-2">
                  See the looks
                  <span aria-hidden="true">→</span>
                </ButtonLink>
              </div>
            </div>

            <div className="col-span-12 relative z-0 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mt-0 h-full">
              <div className="hero-image-enter relative aspect-[4/5] lg:aspect-auto lg:h-[65vh] lg:max-h-[700px] overflow-hidden rounded-[2rem] lg:rounded-l-[2rem] lg:rounded-r-none shadow-float">
                <ArtistCarousel />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-mn-canvas/90 to-transparent"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Products Carousel */}
      {products.length > 0 && (
        <section className="border-t border-mn-border">
          <Carousel title="New and Favourites" href="/shop">
            {products.map((p) => (
              <ProductCardData key={p.id} product={p} />
            ))}
          </Carousel>
        </section>
      )}

      {/* Looks Carousel */}
      {looks.length > 0 && (
        <section className="border-t border-mn-border bg-mn-surface-3">
          <Carousel title="Recent Looks" href="/looks">
            {looks.map((l) => (
              <LookCardData key={l.id} look={l} />
            ))}
          </Carousel>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="border-t border-mn-border py-8 lg:py-16">
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