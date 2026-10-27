"use client";

import { useState, useEffect } from "react";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";

const artistImages = [
  { label: "Artist at work (pending)" },
  { label: "Close up of nails (pending)" },
  { label: "Studio space (pending)" }
];

export function ArtistCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (artistImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % artistImages.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused]);

  if (artistImages.length === 1) {
    return <PlaceholderMedia className="aspect-[4/5] rounded-2xl" label={artistImages[0].label} />;
  }

  return (
    <div 
      className="relative h-full min-h-[400px] lg:min-h-[600px] w-full rounded-2xl overflow-hidden bg-mn-blush"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {artistImages.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <PlaceholderMedia className="h-full w-full rounded-none" label={img.label} />
        </div>
      ))}
      
      {/* Dot indicators */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {artistImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === index ? "bg-mn-ink" : "bg-mn-ink/30"
            }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}