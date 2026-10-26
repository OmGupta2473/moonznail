import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { DevelopmentBannerInline } from "@/components/catalogue/development-banner-inline";
import { formatPrice, formatDuration } from "@/lib/format";
import { getServiceBySlug } from "@/lib/catalogue/queries";
import { Reveal } from "@/components/ui/reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  return {
    title: service ? `${service.title} — MoonzNails` : "Service not found — MoonzNails",
    robots: { index: false, follow: false },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const paramsResolved = await params;
  const slug = Array.isArray(paramsResolved.slug) ? paramsResolved.slug[0] : paramsResolved.slug;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const price = formatPrice(service.fromPriceMinor, service.currency);
  const duration = formatDuration(service.durationMinutes);

  return (
    <main id="main" className="py-12 lg:py-24">
      <Container className="max-w-3xl">
        {service.isFixture && <DevelopmentBannerInline />}
        
        <Reveal>
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-mn-rose-deep">Service</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight lg:text-6xl">
            {service.title}
          </h1>
          
          <div className="mt-6 flex gap-4 text-lg text-mn-ink-soft font-medium">
            {price && <span>From {price}</span>}
            {duration && <span>• {duration}</span>}
          </div>

          {service.summary && (
            <p className="mt-8 text-xl leading-relaxed text-mn-ink">
              {service.summary}
            </p>
          )}
          
          {service.description && (
            <div className="mt-8 prose prose-mn max-w-none text-mn-ink-soft whitespace-pre-line">
              {service.description}
            </div>
          )}

          <div className="mt-16 border-t border-mn-border pt-12 pb-24 lg:pb-0">
            <h2 className="font-display text-2xl">Request an appointment</h2>
            <p className="mt-2 text-mn-ink-soft">
              I read every enquiry personally and reply within a few business days.
            </p>
            <div className="mt-6">
              <ButtonLink href={`/services/enquire?service=${encodeURIComponent(service.slug)}&serviceTitle=${encodeURIComponent(service.title)}`}>
                Enquire about this service
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}