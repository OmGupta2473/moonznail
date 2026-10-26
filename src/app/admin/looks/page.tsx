import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/cn";

export default async function LooksPage() {
  const supabase = await createServerSupabaseClient();
  const { data: looks } = await supabase
    .from("looks")
    .select("id, title, slug, is_published, sort_order, created_at")
    .order("sort_order")
    .order("title");

  return (
    <div className="py-12 lg:py-24">
      <Container>
        <div className="flex items-end justify-between gap-4 mb-8">
          <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Looks</h1>
          <ButtonLink href="/admin/looks/new" className="hidden sm:inline-flex">
            Add Look
          </ButtonLink>
        </div>

        {looks && looks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-mn-border">
                  <th className="pb-3 font-medium text-mn-ink">Title</th>
                  <th className="pb-3 font-medium text-mn-ink">Status</th>
                  <th className="pb-3 font-medium text-mn-ink">Order</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {looks.map((l) => (
                  <tr key={l.id} className="border-b border-mn-border/50">
                    <td className="py-4">
                      <Link href={`/admin/looks/${l.id}`} className="font-medium text-mn-ink hover:underline">
                        {l.title}
                      </Link>
                      <p className="text-sm text-mn-ink-soft">{l.slug}</p>
                    </td>
                    <td className="py-4">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                        l.is_published ? "bg-mn-success/10 text-mn-success" : "bg-mn-warn-bg text-mn-warn-ink"
                      )}>
                        {l.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 text-mn-ink-soft">{l.sort_order}</td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/looks/${l.id}`}
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
            <p className="text-mn-ink-soft">No looks yet.</p>
            <ButtonLink href="/admin/looks/new" className="mt-6 inline-flex">
              Add Your First Look
            </ButtonLink>
          </div>
        )}
      </Container>
    </div>
  );
}