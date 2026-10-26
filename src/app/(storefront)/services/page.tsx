import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/catalogue/empty-state";
import { DevelopmentBannerInline } from "@/components/catalogue/development-banner-inline";
import { getServices } from "@/lib/catalogue/queries";
import { formatPrice, formatDuration } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function ServicesPage() {
  const services = await getServices();
  const hasFixture = services.some((s) => s.isFixture);

  return (
    <main id="main" className="py-12 lg:py-24">
      <Container className="max-w-4xl">
        {hasFixture && <DevelopmentBannerInline />}
        
        <h1 className="font-display text-5xl tracking-tight lg:text-6xl">Services</h1>
        <p className="mt-4 text-lg text-mn-ink-soft">
          One-on-one nail services by appointment. Send an enquiry to check availability and discuss your ideas.
        </p>

        {services.length === 0 ? (
          <EmptyState title="No services listed yet." actionHref="/looks" actionLabel="Browse the looks" />
        ) : (
          <div className="mt-16 divide-y divide-mn-border">
            {services.map((s) => {
              const price = formatPrice(s.fromPriceMinor, s.currency);
              const duration = formatDuration(s.durationMinutes);
              return (
                <Reveal key={s.id}>
                  <div className="py-12 flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="flex-1">
                      <h2 className="font-display text-3xl">{s.title}</h2>
                      {s.summary && <p className="mt-4 text-mn-ink-soft max-w-xl">{s.summary}</p>}
                      <div className="mt-6 flex gap-4 text-sm font-medium text-mn-ink">
                        {price && <span>From {price}</span>}
                        {duration && <span>• {duration}</span>}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ButtonLink href={`/services/${s.slug}`} variant="secondary">View details</ButtonLink>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-24 rounded-2xl bg-mn-blush/30 p-12 text-center">
          <h2 className="font-display text-3xl">Not sure what you need?</h2>
          <p className="mt-4 text-mn-ink-soft max-w-md mx-auto">
            Send me a message with your ideas, shape preferences, and inspiration. I will guide you from there.
          </p>
          <div className="mt-8">
            <ButtonLink href="/services/enquire">Send an enquiry</ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}