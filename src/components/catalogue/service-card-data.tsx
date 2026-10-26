import Link from "next/link";
import { FixtureBadge } from "./fixture-badge";
import { formatPrice, formatDuration } from "@/lib/format";
import { Service } from "@/lib/catalogue/types";
import { cn } from "@/lib/cn";

export function ServiceCardData({ service, className }: { service: Service; className?: string }) {
  const price = formatPrice(service.fromPriceMinor, service.currency);
  const duration = formatDuration(service.durationMinutes);

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group block rounded-2xl border border-mn-border bg-mn-canvas p-6 transition-colors hover:bg-mn-blush/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-medium leading-7">{service.title}</h3>
        {service.isFixture && <FixtureBadge />}
      </div>
      {service.summary && (
        <p className="mt-2 text-sm leading-6 text-mn-ink-soft">{service.summary}</p>
      )}
      <div className="mt-4 flex items-center justify-between text-sm text-mn-ink-soft">
        <span>{price ? `From ${price}` : "Price confirmed on enquiry"}</span>
        {duration && <span>{duration}</span>}
      </div>
    </Link>
  );
}