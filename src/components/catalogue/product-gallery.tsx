"use client";

import { useState, useRef } from "react";
import { MediaImage } from "./media-image";
import type { ProductMedia } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";

export function ProductGallery({ media, isFixture }: { media: ProductMedia[]; isFixture: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const touchStartX = useRef<number | null>(null);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-[4/5] lg:aspect-auto lg:h-[80vh] w-full rounded-lg lg:rounded-r-none overflow-hidden bg-mn-blush">
         <MediaImage media={undefined} isFixture={isFixture} className="h-full w-full" />
      </div>
    );
  }

  const activeMedia = media[activeIndex];
  const isVideo = activeMedia.storagePath?.endsWith(".mp4");

  const handleNext = () => {
    setDirection("right");
    setActiveIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setActiveIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    
    touchStartX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Viewer */}
      <div 
        className="relative aspect-[4/5] lg:aspect-auto lg:h-[80vh] w-full rounded-lg lg:rounded-r-none overflow-hidden bg-mn-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Product gallery. Use arrow keys to navigate."
      >
        <div
          key={activeIndex}
          className={cn(
            "h-full w-full",
            direction === "right" ? "animate-slide-right" : "animate-slide-left"
          )}
        >
          {isVideo ? (
            <video
              src={activeMedia.storagePath!}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <MediaImage
              media={activeMedia}
              isFixture={isFixture}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
          {media.map((m, i) => {
            const thumbIsVideo = m.storagePath?.endsWith(".mp4");
            return (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > activeIndex ? "right" : "left");
                  setActiveIndex(i);
                }}
                className={cn(
                  "relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink",
                  activeIndex === i ? "border-mn-rose-deep" : "border-transparent hover:border-mn-border-strong"
                )}
                aria-label={`View media item ${i + 1}`}
              >
                {thumbIsVideo ? (
                  <div className="flex h-full w-full items-center justify-center bg-mn-ink text-mn-canvas text-xs">Video</div>
                ) : (
                  <MediaImage media={m} isFixture={isFixture} className="h-full w-full object-cover rounded-lg" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}