import Link from "next/link";
import { MediaImage } from "./media-image";
import { FixtureBadge } from "./fixture-badge";
import { Look } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";

export function LookCardData({ look, className }: { look: Look; className?: string }) {
  const primaryMedia = look.media[0];
  const isVideo = primaryMedia?.storagePath?.endsWith(".mp4");

  return (
    <Link
      href={`/looks/${look.slug}`}
      prefetch
      className={cn(
        "group block focus-visible:outline-none",
        className
      )}
    >
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
            isFixture={look.isFixture}
            className="aspect-[4/5] rounded-lg shadow-rest motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"
          />
        )}
        {look.isFixture && (
          <div className="absolute left-3 top-3">
            <FixtureBadge />
          </div>
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <h3 className="text-[15px] font-medium leading-tight truncate">{look.title}</h3>
        <p className="text-[13px] text-mn-ink-soft truncate">{look.tags.slice(0, 2).join(" · ")}</p>
      </div>
    </Link>
  );
}