import { notFound } from "next/navigation";
import { createPrivilegedClient } from "@/lib/supabase/admin";
import { Container } from "@/components/ui/container";
import { formatPrice } from "@/lib/format";
import { OrderActions } from "./OrderActions";

export const dynamic = "force-dynamic";

type OrderItemRow = {
  product_name: string;
  unit_price_minor: number;
  quantity: number;
  line_total_minor: number;
};

type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  phone?: string;
  tracking_number?: string;
};

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createPrivilegedClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, email, shipping_address, subtotal_minor, total_minor, currency, payment_status, fulfilment_status, razorpay_order_id, razorpay_payment_id, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, unit_price_minor, quantity, line_total_minor")
    .eq("order_id", id);

  const addr = order.shipping_address as ShippingAddress;

  return (
    <main id="main" className="py-12">
      <Container>
        <div className="rounded-xl border border-mn-border p-6">
          <h1 className="font-display text-3xl tracking-tight">Order {order.order_number}</h1>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-xl">Customer</h2>
              <p className="mt-1 text-sm text-mn-ink-soft">{order.customer_name}</p>
              <p className="mt-1 text-sm text-mn-ink-soft">{order.email}</p>
              {addr.phone && <p className="mt-1 text-sm text-mn-ink-soft">{addr.phone}</p>}
            </div>
            <div>
              <h2 className="font-display text-xl">Payment & Fulfilment</h2>
              <p className="mt-1 text-sm text-mn-ink-soft"><strong>Payment:</strong> {order.payment_status}</p>
              <p className="mt-1 text-sm text-mn-ink-soft"><strong>Fulfilment:</strong> {order.fulfilment_status}</p>
              {order.razorpay_order_id && (
                <p className="mt-1 text-xs text-mn-ink-soft">Razorpay order: {order.razorpay_order_id}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-xl">Shipping Address</h2>
            <div className="mt-2 rounded-xl border border-mn-border p-4 space-y-1 text-sm">
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>{addr.city}, {addr.state}, {addr.postal}</p>
              <p>{addr.country}</p>
              {addr.tracking_number && <p className="font-medium">Tracking: {addr.tracking_number}</p>}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-xl">Items</h2>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mn-border">
                    <th className="py-2 text-left">Product</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Unit price</th>
                    <th className="py-2 text-right">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {(items as OrderItemRow[] | null)?.map((item, i) => (
                    <tr key={i} className="border-b border-mn-border">
                      <td className="py-2">{item.product_name}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{formatPrice(item.unit_price_minor, order.currency)}</td>
                      <td className="py-2 text-right font-medium">{formatPrice(item.line_total_minor, order.currency)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="py-2 text-right font-medium">Total</td>
                    <td className="py-2 text-right font-medium">{formatPrice(order.total_minor, order.currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-display text-xl">Timeline</h2>
            <p className="mt-2 text-sm text-mn-ink-soft">Order placed: {new Date(order.created_at).toLocaleString()}</p>
            <p className="mt-1 text-sm text-mn-ink-soft">Last updated: {new Date(order.updated_at).toLocaleString()}</p>
          </div>

          <div className="mt-6">
            <OrderActions orderId={order.id} currentFulfilment={order.fulfilment_status} />
          </div>
        </div>
      </Container>
    </main>
  );
}