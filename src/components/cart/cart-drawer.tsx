"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useCart } from "./cart-context";
import { CartLineRow } from "./cart-line";
import { CartSubtotal } from "./cart-subtotal";

export function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    document.documentElement.setAttribute("data-cart-open", "");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeDrawer(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-cart-open");
      previousFocus.current?.focus();
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-mn-ink/30" onClick={closeDrawer} aria-hidden="true" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-mn-canvas shadow-3 motion-safe:animate-[slide-in_250ms_ease-out]"
      >
        <div className="flex items-center justify-between border-b border-mn-border px-5 py-4">
          <h2 className="font-display text-lg">Your Cart</h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart" className="flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {cart.items.length === 0 ? (
            <p className="py-12 text-center text-sm text-mn-ink-soft">Your cart is empty.</p>
          ) : (
            cart.items.map((line) => <CartLineRow key={line.productId} line={line} />)
          )}
        </div>
        {cart.items.length > 0 && (
          <div className="border-t border-mn-border px-5 py-4">
            <CartSubtotal cart={cart} />
            <Link href="/cart" onClick={closeDrawer} className="mt-3 block text-center text-xs text-mn-ink-soft underline underline-offset-4">
              View full cart
            </Link>
            <Link href="/checkout" onClick={closeDrawer} className="mt-3 flex h-12 items-center justify-center rounded-full bg-mn-rose-deep text-white">
              Proceed to checkout
            </Link>
          </div>
        )}
      </aside>
    </>,
    document.body
  );
}