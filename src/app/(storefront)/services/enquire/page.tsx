import { Container } from "@/components/ui/container";
import { EnquiryForm } from "./EnquiryForm";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[]; serviceTitle?: string | string[]; look?: string | string[]; lookTitle?: string | string[] }>;
}) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  return (
    <main id="main" className="py-12 lg:py-24">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Send an enquiry</h1>
        <p className="mt-4 text-base leading-7 text-mn-ink-soft">
          Tell me about the set or service you are interested in. I read every enquiry myself and reply
          within a few business days.
        </p>
        <EnquiryForm
          serviceSlug={first(sp.service)}
          serviceTitle={first(sp.serviceTitle)}
          lookSlug={first(sp.look)}
          lookTitle={first(sp.lookTitle)}
        />
      </Container>
    </main>
  );
}