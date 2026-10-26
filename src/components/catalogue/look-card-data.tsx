import Link from "next/link";
import { MediaImage } from "./media-image";
import { FixtureBadge } from "./fixture-badge";
import { Look } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";

export function LookCardData({ look, className }: { look: Look; className?: string }) {
  return (
    <Link
      href={`/looks/${look.slug}`}
      className={cn(
        "group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
        className
      )}
    >
      <div className="relative">
        <MediaImage
          media={look.media[0]}
          isFixture={look.isFixture}
          className="aspect-[4/5] rounded-3xl shadow-1 motion-safe:transition-transform motion-safe:group-hover:-translate-y-1"
        />
        {look.isFixture && (
          <div className="absolute left-3 top-3">
            <FixtureBadge />
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-base font-medium leading-6">{look.title}</h3>
        {look.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {look.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-mn-blush px-2 py-1 text-xs text-mn-ink-soft"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}