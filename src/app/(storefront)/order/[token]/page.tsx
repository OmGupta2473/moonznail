import { notFound } from "next/navigation";
import crypto from "node:crypto";
import { createPrivilegedClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/container";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

type OrderItemRow = {
  id: string;
  product_name: string;
  unit_price_minor: number;
  quantity: number;
  line_total_minor: number;
};

export default async function OrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const supabase = createPrivilegedClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, email, shipping_address, currency, subtotal_minor, total_minor, payment_status, fulfilment_status, created_at")
    .eq("access_token_hash", hash)
    .maybeSingle();

  if (error || !order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("id, product_name, unit_price_minor, quantity, line_total_minor")
    .eq("order_id", order.id);

  const statusMessage =
    order.payment_status === "pending"
      ? "Order recorded. Payment not yet enabled — no charge has been made. I will contact you to arrange payment."
      : order.payment_status === "paid"
      ? "Payment received."
      : order.payment_status === "failed" || order.payment_status === "cancelled"
      ? "This order could not be completed."
      : "Unknown status.";

  const orderItems = (items ?? []) as OrderItemRow[];

  return (
    <main id="main" className="py-12 lg:py-24">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Moon Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mn-blush text-mn-moon mb-8">
             <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
               <path d="M16 4C10 5 6 10 7 16C8 20 12 22 17 21C13 19 11 14 13 9C14 7 15 5 16 4Z" fill="currentColor" />
             </svg>
          </div>

          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-mn-rose-deep">Order Received</p>
          <h1 className="mt-4 font-display text-4xl tracking-tight lg:text-5xl">
            {order.order_number}
          </h1>
          <p className="mt-4 text-lg text-mn-ink-soft max-w-lg mx-auto">
            {statusMessage}
          </p>
        </div>

        <div className="mt-16 max-w-2xl mx-auto space-y-8">
          <div className="bg-mn-surface-3 rounded-2xl p-6 lg:p-8">
            <h2 className="font-display text-2xl border-b border-mn-border pb-4">Order Summary</h2>
            <div className="mt-6 space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-mn-ink-soft">{item.quantity} × {item.product_name}</span>
                  <span className="tabular-nums text-mn-rose-deep">{formatPrice(item.line_total_minor, order.currency)}</span>
                </div>
              ))}
              <div className="border-t border-mn-border pt-4 flex justify-between text-lg font-medium text-mn-rose-deep">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(order.total_minor, order.currency)}</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-xl border-b border-mn-border pb-2">Delivery Address</h3>
              <div className="mt-4 text-sm text-mn-ink-soft space-y-1">
                <p>{order.shipping_address.line1}</p>
                {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.postal}</p>
                <p>{order.shipping_address.country}</p>
                {order.shipping_address.phone && <p>{order.shipping_address.phone}</p>}
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl border-b border-mn-border pb-2">Contact</h3>
              <div className="mt-4 text-sm text-mn-ink-soft space-y-1">
                <p>{order.customer_name}</p>
                <p>{order.email}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center border-t border-mn-border">
            <p className="text-sm text-mn-ink-soft">
              Questions? Reply to this email or contact me with your order number: <strong>{order.order_number}</strong>.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}