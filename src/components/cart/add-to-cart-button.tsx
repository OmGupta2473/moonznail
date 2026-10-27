"use client";
import { useTransition, useState } from "react";
import { useCart } from "./cart-context";

export function AddToCartButton({ productId, compact = false }: { productId: string; compact?: boolean }) {
  // Hooks MUST be at the top level
  const { addToCart, openDrawer } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    startTransition(async () => {
      const result = await addToCart(productId, 1);
      if (result.ok) {
        if (!compact) openDrawer();
      } else {
        setError(result.reason === "quantity_exceeded" ? "Max quantity is 10." : "Could not add.");
      }
    });
  };

  if (compact) {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={handleAdd}
        className="mt-3 flex h-10 w-full items-center justify-center rounded-md border border-mn-border-strong bg-transparent text-sm font-medium text-mn-ink transition-colors hover:bg-mn-ink hover:text-white disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add to Cart"}
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={handleAdd}
        className="flex h-14 w-full items-center justify-center rounded-md border-2 border-mn-ink bg-transparent px-6 font-medium text-mn-ink tracking-widest uppercase text-sm transition-colors hover:bg-mn-ink hover:text-white disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to Cart"}
      </button>
      {error && <p className="mt-2 text-sm text-mn-error text-center">{error}</p>}
    </div>
  );
}