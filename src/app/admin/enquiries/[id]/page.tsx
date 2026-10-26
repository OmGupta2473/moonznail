import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { EnquiryActions } from "./EnquiryActions";

export const dynamic = "force-dynamic";

type EnquiryDetailRow = {
  id: string;
  reference_number: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  service_slug: string | null;
  service_title: string | null;
  look_slug: string | null;
  look_title: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export default async function AdminEnquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: enquiry, error } = await supabase
    .from("enquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !enquiry) notFound();

  const e = enquiry as EnquiryDetailRow;
  const mailtoSubject = encodeURIComponent(`Re: your enquiry ${e.reference_number}`);
  const mailtoHref = e.email
    ? `mailto:${e.email}?subject=${mailtoSubject}`
    : null;

  return (
    <main id="main" className="py-12">
      <Container className="max-w-3xl">
        <Link href="/admin/enquiries" className="text-sm text-mn-ink-soft underline">
          ← All enquiries
        </Link>
        <h1 className="mt-4 font-display text-3xl tracking-tight">
          {e.reference_number}
        </h1>
        <p className="mt-1 text-sm text-mn-ink-soft">
          Received {new Date(e.created_at).toLocaleString()}
        </p>

        <div className="mt-8 rounded-xl border border-mn-border p-6 space-y-3">
          <div>
            <p className="text-sm text-mn-ink-soft">From</p>
            <p className="font-medium text-mn-ink">{e.name}</p>
          </div>
          <div>
            <p className="text-sm text-mn-ink-soft">Contact</p>
            <p className="text-mn-ink">{e.email ?? "—"}</p>
            {e.phone && <p className="text-mn-ink">{e.phone}</p>}
          </div>
          {(e.service_title || e.look_title) && (
            <div>
              <p className="text-sm text-mn-ink-soft">About</p>
              {e.service_title && (
                <p className="text-mn-ink">
                  Service:{" "}
                  {e.service_slug ? (
                    <a
                      href={`/services/${e.service_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {e.service_title}
                    </a>
                  ) : (
                    e.service_title
                  )}
                </p>
              )}
              {e.look_title && (
                <p className="text-mn-ink">
                  Look:{" "}
                  {e.look_slug ? (
                    <a
                      href={`/looks/${e.look_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {e.look_title}
                    </a>
                  ) : (
                    e.look_title
                  )}
                </p>
              )}
            </div>
          )}
          <div>
            <p className="text-sm text-mn-ink-soft">Message</p>
            <p className="mt-1 whitespace-pre-line text-mn-ink">{e.message}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {mailtoHref && (
            <a
              href={mailtoHref}
              className="inline-flex items-center rounded-full border border-mn-border-strong px-5 py-2 text-sm hover:bg-mn-blush"
            >
              Reply by email
            </a>
          )}
          <EnquiryActions enquiryId={e.id} currentStatus={e.status as "new" | "replied" | "archived"} />
        </div>
      </Container>
    </main>
  );
}