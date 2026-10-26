"use client";
import { useCart } from "./cart-context";

export function CartIcon() {
  const { cart, openDrawer } = useCart();
  const count = cart.itemCount;
  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={count > 0 ? `Open cart, ${count} items` : "Open cart"}
      className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 8H18L17 20H7L6 8Z" strokeLinejoin="round" />
        <path d="M9 8C9 5.8 10.3 4 12 4C13.7 4 15 5.8 15 8" strokeLinecap="round" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-mn-rose-deep px-1 text-[10px] font-medium text-white tabular-nums">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}