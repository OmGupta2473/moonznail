import { formatPrice } from "@/lib/format";
import type { CartView } from "@/lib/cart/types";

export function CartSubtotal({ cart }: { cart: CartView }) {
  const sub = formatPrice(cart.subtotalMinor, cart.currency) ?? formatPrice(0, cart.currency);
  return (
    <div className="space-y-4">
      {cart.hasUnavailable && (
        <p className="rounded-lg bg-mn-warn-bg px-3 py-2 text-xs text-mn-warn-ink">
          Some items are unavailable and are not included in the total.
        </p>
      )}
      <div className="flex items-center justify-between text-lg font-medium">
        <span>Subtotal</span>
        <span className="tabular-nums">{sub}</span>
      </div>
      <p className="text-xs text-mn-ink-soft">Taxes and shipping calculated at checkout.</p>
    </div>
  );
}