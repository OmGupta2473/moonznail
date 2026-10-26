import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/cn";

export default async function ServicesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, title, slug, from_price_minor, currency, is_published, sort_order, created_at")
    .order("sort_order")
    .order("title");

  return (
    <div className="py-12 lg:py-24">
      <Container>
        <div className="flex items-end justify-between gap-4 mb-8">
          <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Services</h1>
          <ButtonLink href="/admin/services/new" className="hidden sm:inline-flex">
            Add Service
          </ButtonLink>
        </div>

        {services && services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-mn-border">
                  <th className="pb-3 font-medium text-mn-ink">Title</th>
                  <th className="pb-3 font-medium text-mn-ink">From Price</th>
                  <th className="pb-3 font-medium text-mn-ink">Status</th>
                  <th className="pb-3 font-medium text-mn-ink">Order</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} className="border-b border-mn-border/50">
                    <td className="py-4">
                      <Link href={`/admin/services/${s.id}`} className="font-medium text-mn-ink hover:underline">
                        {s.title}
                      </Link>
                      <p className="text-sm text-mn-ink-soft">{s.slug}</p>
                    </td>
                    <td className="py-4 text-mn-ink">
                      {s.from_price_minor !== null && s.currency
                        ? new Intl.NumberFormat("en", { style: "currency", currency: s.currency }).format(s.from_price_minor / 100)
                        : "—"}
                    </td>
                    <td className="py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        s.is_published ? "bg-mn-success/10 text-mn-success" : "bg-mn-warn-bg text-mn-warn-ink"
                      )}>
                        {s.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 text-mn-ink-soft">{s.sort_order}</td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/services/${s.id}`}
                        className="text-sm font-medium text-mn-rose-deep underline-offset-2 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-mn-ink-soft">No services yet.</p>
            <ButtonLink href="/admin/services/new" className="mt-6 inline-flex">
              Add Your First Service
            </ButtonLink>
          </div>
        )}
      </Container>
    </div>
  );
}