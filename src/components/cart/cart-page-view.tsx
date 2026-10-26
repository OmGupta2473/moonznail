"use client";
import { useCart } from "./cart-context";
import { CartLineRow } from "./cart-line";
import { CartSubtotal } from "./cart-subtotal";
import { ButtonLink } from "@/components/ui/button-link";

export function CartPageView() {
  const { cart } = useCart();
  
  if (cart.items.length === 0) {
    return (
      <div className="mt-12 py-24 text-center">
        <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Your cart is empty.</h1>
        <p className="mt-4 text-mn-ink-soft">Looks like you haven&apos;t added any sets yet.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/shop">Browse sets</ButtonLink>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <h1 className="font-display text-4xl tracking-tight lg:text-6xl">Your Cart</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] items-start">
        {/* Left: Line Items */}
        <div className="divide-y divide-mn-border border-t border-mn-border">
          {cart.items.map((line) => (
            <CartLineRow key={line.productId} line={line} />
          ))}
        </div>
        
        {/* Right: Summary */}
        <aside className="bg-mn-surface-3 p-6 lg:p-8 rounded-2xl lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Order Summary</h2>
          <div className="mt-6">
            <CartSubtotal cart={cart} />
          </div>
          <ButtonLink href="/checkout" className="mt-8 w-full">Proceed to checkout</ButtonLink>
          <p className="mt-4 text-center text-xs text-mn-ink-soft">Secure checkout</p>
        </aside>
      </div>
    </>
  );
}