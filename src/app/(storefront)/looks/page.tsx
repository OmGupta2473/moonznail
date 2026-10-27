import { Container } from "@/components/ui/container";
import { LookCardData } from "@/components/catalogue/look-card-data";
import { EmptyState } from "@/components/catalogue/empty-state";
import { DevelopmentBannerInline } from "@/components/catalogue/development-banner-inline";
import { getLooks } from "@/lib/catalogue/queries";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { MediaImage } from "@/components/catalogue/media-image";

export const revalidate = 300;
export const metadata = { robots: { index: false, follow: false } };

export default async function LooksPage() {
  const looks = await getLooks();
  const hasFixture = looks.some((l) => l.isFixture);
  
  const featured = looks[0];
  const rest = looks.slice(1);

  return (
    <main id="main" className="py-8 lg:py-12">
      <Container>
        {hasFixture && <DevelopmentBannerInline />}
        
        <h1 className="font-display text-5xl tracking-tight lg:text-6xl">Looks</h1>
        <p className="mt-4 max-w-xl text-base text-mn-ink-soft">
          A portfolio of hand-painted designs. Each look is made to order or can be requested for an in-person session.
        </p>

        {looks.length === 0 ? (
          <EmptyState title="No looks yet." body="Portfolio pieces will appear here soon." actionHref="/shop" actionLabel="Browse sets" />
        ) : (
          <>
            {/* Featured Look */}
            {featured && (
              <div className="mt-8 mb-8 lg:mb-12">
                <Reveal>
                  <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[21/9]">
                    <MediaImage
                      media={featured.media[0]}
                      isFixture={featured.isFixture}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mn-ink/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 p-8 lg:p-12">
                      <p className="text-mn-canvas font-medium text-sm tracking-widest uppercase mb-2">Featured</p>
                      <h2 className="text-mn-canvas font-display text-4xl lg:text-5xl">{featured.title}</h2>
                      <div className="mt-6">
                        <ButtonLink href={`/looks/${featured.slug}`} variant="secondary" className="bg-mn-canvas/10 border-mn-canvas/30 text-mn-canvas hover:bg-mn-canvas/20">
                          View Look
                        </ButtonLink>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            )}

            {/* Rest of the looks */}
            {rest.length > 0 && (
              <Reveal>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-12">
                  {rest.map((l) => (
                    <LookCardData key={l.id} look={l} />
                  ))}
                </div>
              </Reveal>
            )}
          </>
        )}
      </Container>
    </main>
  );
}