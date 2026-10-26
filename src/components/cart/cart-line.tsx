"use client";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/format";
import { MediaImage } from "@/components/catalogue/media-image";
import type { CartLine } from "@/lib/cart/types";

export function CartLineRow({ line }: { line: CartLine }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isUnavailable = line.status === "unavailable";
  const atCap = line.quantity >= 10;

  function run(fn: () => Promise<{ ok: boolean; reason?: string }>) {
    setError(null);
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) {
        setError(result.reason === "quantity_exceeded" ? "Maximum quantity is 10." : "Could not update cart.");
      }
    });
  }

  const priceLabel =
    line.unitPriceMinor !== null && line.currency
      ? formatPrice(line.unitPriceMinor, line.currency)
      : "Unavailable";

  return (
    <div className={`flex gap-4 py-4 ${isUnavailable ? "opacity-70" : ""}`}>
      <div className="w-20 shrink-0">
        <MediaImage
          media={line.imagePath ? { storagePath: line.imagePath, altText: line.name, width: null, height: null } : undefined}
          isFixture={false}
          className="aspect-[4/5] rounded-lg"
          sizes="80px"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          {line.slug ? (
            <Link href={`/products/${line.slug}`} className="text-sm font-medium underline-offset-4 hover:underline">
              {line.name}
            </Link>
          ) : (
            <span className="text-sm font-medium">{line.name}</span>
          )}
          <span className="text-sm tabular-nums">{priceLabel}</span>
        </div>
        {isUnavailable && (
          <p className="text-xs text-mn-ink-soft">
            {line.reason === "unpublished" && "No longer available."}
            {line.reason === "fixture" && "Sample item — not for purchase."}
            {line.reason === "currency_mismatch" && "Currency mismatch."}
            {line.reason === "unpriced" && "Price unavailable."}
          </p>
        )}
        {!isUnavailable && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => updateQuantity(line.productId, Math.max(0, line.quantity - 1)))}
              aria-label={`Decrease quantity of ${line.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-mn-border-strong hover:bg-mn-blush disabled:opacity-50"
            >−</button>
            <span className="min-w-6 text-center text-sm tabular-nums">{line.quantity}</span>
            <button
              type="button"
              disabled={pending || atCap}
              onClick={() => run(() => updateQuantity(line.productId, line.quantity + 1))}
              aria-label={atCap ? `Maximum quantity reached for ${line.name}` : `Increase quantity of ${line.name}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-mn-border-strong hover:bg-mn-blush disabled:opacity-50"
            >+</button>
          </div>
        )}
        {atCap && !isUnavailable && (
          <p className="text-xs text-mn-ink-soft">Maximum quantity is 10 per set.</p>
        )}
        {error && <p className="text-xs text-mn-error">{error}</p>}
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => removeFromCart(line.productId))}
        aria-label={`Remove ${line.name}`}
        className="self-start text-xs text-mn-ink-soft underline underline-offset-4 hover:text-mn-rose-ink disabled:opacity-50"
      >Remove</button>
    </div>
  );
}