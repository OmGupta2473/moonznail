import Link from "next/link";
import { MediaImage } from "./media-image";
import { FixtureBadge } from "./fixture-badge";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";

export function ProductCardData({ product, className }: { product: Product; className?: string }) {
  const price = formatPrice(product.priceMinor, product.currency);
  const meta = [product.shape, product.length].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
        className
      )}
    >
      <div className="relative">
        <MediaImage
          media={product.media[0]}
          isFixture={product.isFixture}
          className="aspect-[4/5] rounded-3xl shadow-1 motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"
        />
        {product.isFixture && (
          <div className="absolute left-3 top-3">
            <FixtureBadge />
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-base font-medium leading-6">{product.name}</h3>
        {meta && <p className="text-sm leading-5 text-mn-ink-soft">{meta}</p>}
        <p className="text-base leading-6">{price ?? "Price on request"}</p>
      </div>
    </Link>
  );
}