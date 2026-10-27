import Link from "next/link";
import { MediaImage } from "./media-image";
import { FixtureBadge } from "./fixture-badge";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

export function ProductCardData({ product, className }: { product: Product; className?: string }) {
  const price = formatPrice(product.priceMinor, product.currency);
  const meta = [product.shape, product.length].filter(Boolean).join(" · ");
  const primaryMedia = product.media[0];
  const isVideo = primaryMedia?.storagePath?.endsWith(".mp4");

  return (
    <div className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} prefetch className="block relative">
        <div className="relative">
          {isVideo ? (
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-mn-blush">
              <video
                src={primaryMedia.storagePath!}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <MediaImage
              media={primaryMedia}
              isFixture={product.isFixture}
              className="aspect-[4/5] rounded-lg shadow-rest motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"
            />
          )}
          {product.isFixture && (
            <div className="absolute left-3 top-3">
              <FixtureBadge />
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3">
        <h3 className="text-[15px] font-medium leading-tight line-clamp-1">{product.name}</h3>
        <p className="text-[13px] text-mn-ink-soft line-clamp-1">{meta}</p>
        <p className="text-sm font-medium text-mn-rose-deep">{price ?? "Price on request"}</p>
        {product.priceMinor !== null && !product.isFixture && (
          <AddToCartButton productId={product.id} compact />
        )}
      </div>
    </div>
  );
}