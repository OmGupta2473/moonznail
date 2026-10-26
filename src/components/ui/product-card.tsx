import Link from "next/link";
import { PlaceholderMedia } from "./placeholder-media";
import { cn } from "@/lib/cn";

export function ProductCard({
  name,
  price,
  meta,
  href,
  className,
}: {
  name: string;
  price: string;
  meta: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
        className
      )}
    >
      <PlaceholderMedia className="aspect-[4/5] shadow-1 motion-safe:transition-transform motion-safe:group-hover:-translate-y-1" />
      <div className="mt-4 space-y-1">
        <h3 className="text-base font-medium leading-6">{name}</h3>
        <p className="text-sm leading-5 text-mn-ink-soft">{meta}</p>
        <p className="text-base leading-6">{price}</p>
      </div>
    </Link>
  );
}