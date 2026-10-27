"use client";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";

export function BuyNowButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full">
      <Button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await addToCart(productId, 1);
            if (result.ok) {
              router.push("/checkout");
            } else {
              setError(result.reason === "quantity_exceeded" ? "Maximum quantity is 10." : "Could not process request.");
            }
          });
        }}
        className="w-full h-14 bg-mn-ink text-white hover:bg-mn-ink/90 text-lg"
      >
        {pending ? "Processing…" : "Buy It Now"}
      </Button>
      {error && <p className="mt-2 text-sm text-mn-error text-center">{error}</p>}
    </div>
  );
}