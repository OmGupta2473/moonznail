import Link from "next/link";
import { createPrivilegedClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  email: string;
  total_minor: number;
  currency: string;
  payment_status: string;
  fulfilment_status: string;
  created_at: string;
};

export default async function AdminOrdersPage() {
  const supabase = createPrivilegedClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, email, total_minor, currency, payment_status, fulfilment_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main id="main">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-tight">Orders</h1>
      </div>
      {(!orders || orders.length === 0) ? (
        <p className="mt-8 text-mn-ink-soft">No orders yet.</p>
      ) : (
        <div className="mt-8 border border-mn-border rounded-xl overflow-hidden bg-mn-canvas">
          <table className="w-full text-left text-sm">
            <thead className="bg-mn-surface-3 border-b border-mn-border">
              <tr>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Order</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Customer</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Total</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Status</th>
                <th className="px-4 py-3 font-medium text-mn-ink-soft">Fulfilment</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mn-border">
              {(orders as OrderRow[]).map((o) => (
                <tr key={o.id} className="hover:bg-mn-surface-3/50">
                  <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                  <td className="px-4 py-3">{o.customer_name}</td>
                  <td className="px-4 py-3">{formatPrice(o.total_minor, o.currency)}</td>
                  <td className="px-4 py-3">{o.payment_status}</td>
                  <td className="px-4 py-3">{o.fulfilment_status}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/orders/${o.id}`} className="text-mn-rose-deep underline text-xs">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}