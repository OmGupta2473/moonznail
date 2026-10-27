import Link from "next/link";
import { MediaImage } from "./media-image";
import { FixtureBadge } from "./fixture-badge";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";

export function ProductCardData({ product, className }: { product: Product; className?: string }) {
  const price = formatPrice(product.priceMinor, product.currency);
  const meta = [product.shape, product.length].filter(Boolean).join(" · ");
  const primaryMedia = product.media[0];
  const isVideo = primaryMedia?.storagePath?.endsWith(".mp4");

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block focus-visible:outline-none",
        className
      )}
    >
      <div className="relative">
        {isVideo ? (
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-mn-blush">
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
            className="aspect-[4/5] rounded-xl shadow-rest motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"
          />
        )}
        {product.isFixture && (
          <div className="absolute left-3 top-3">
            <FixtureBadge />
          </div>
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <h3 className="text-[15px] font-medium leading-tight truncate">{product.name}</h3>
        <p className="text-[13px] text-mn-ink-soft truncate">{meta}</p>
        <p className="text-sm font-medium">{price ?? "Price on request"}</p>
      </div>
    </Link>
  );
}