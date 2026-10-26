"use client";
import { useTransition, useState } from "react";
import { useCart } from "./cart-context";

export function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart, openDrawer } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await addToCart(productId, 1);
            if (result.ok) openDrawer();
            else setError(result.reason === "quantity_exceeded" ? "Maximum quantity is 10." : "Could not add to cart.");
          });
        }}
        className="flex h-12 w-full items-center justify-center rounded-full bg-mn-rose-deep px-6 font-medium text-white disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add to cart"}
      </button>
      {error && <p className="mt-2 text-sm text-mn-error">{error}</p>}
    </div>
  );
}