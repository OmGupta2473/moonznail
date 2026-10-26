import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/cn";

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price_minor, currency, is_published, sort_order, created_at")
    .order("sort_order")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-tight">Products</h1>
        <ButtonLink href="/admin/products/new">Add Product</ButtonLink>
      </div>

      {products && products.length > 0 ? (
        <div className="border border-mn-border rounded-xl overflow-hidden bg-mn-canvas">
          <table className="w-full text-left text-sm">
            <thead className="bg-mn-surface-3 border-b border-mn-border">
              <tr>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Name</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Price</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Status</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Order</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mn-border">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-mn-surface-3/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-mn-ink hover:underline">
                      {p.name}
                    </Link>
                    <p className="text-sm text-mn-ink-soft">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-mn-ink">
                    {p.price_minor !== null && p.currency
                      ? new Intl.NumberFormat("en", { style: "currency", currency: p.currency }).format(p.price_minor / 100)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                      p.is_published ? "bg-mn-success/10 text-mn-success" : "bg-mn-warn-bg text-mn-warn-ink"
                    )}>
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-mn-ink-soft">{p.sort_order}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
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
          <p className="text-mn-ink-soft">No products yet.</p>
          <ButtonLink href="/admin/products/new" className="mt-6 inline-flex">
            Add Your First Product
          </ButtonLink>
        </div>
      )}
    </div>
  );
}