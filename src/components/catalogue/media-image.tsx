import Image from "next/image";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { publicMediaUrl } from "@/lib/supabase/media";
import { ProductMedia } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";

export function MediaImage({
  media,
  isFixture,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: {
  media: ProductMedia | undefined;
  isFixture: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const url = media ? publicMediaUrl(media.storagePath) : null;

  if (!url) {
    // Fixture rows have no media yet; real rows without media are labelled honestly.
    return (
      <PlaceholderMedia
        className={className}
        label={isFixture ? "Development image" : "Image unavailable"}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={url}
        alt={media?.altText || ""}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}