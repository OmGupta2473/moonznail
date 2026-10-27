import { PlaceholderMedia } from "@/components/ui/placeholder-media";

const images = [
  { label: "Artist at work (pending)" },
  { label: "Close up of nails (pending)" },
  { label: "Studio space (pending)" },
];

export function ArtistCarousel() {
  return (
    <div className="relative h-full min-h-[400px] lg:min-h-[600px] w-full rounded-2xl overflow-hidden bg-mn-blush">
      {images.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 animate-carousel-fade"
          style={{ animationDelay: `${i * 4}s` }}
        >
          <PlaceholderMedia className="h-full w-full rounded-none" label={img.label} />
        </div>
      ))}
    </div>
  );
}