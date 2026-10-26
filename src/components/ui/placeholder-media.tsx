import { cn } from "@/lib/cn";

export function PlaceholderMedia({
  className,
  label = "Development image",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="img"
      aria-label="Development placeholder for nail photography"
      className={cn(
        "relative flex items-end overflow-hidden rounded-3xl bg-mn-blush p-4",
        className
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="absolute right-4 top-4 h-8 w-8 text-mn-moon/60"
        fill="none"
      >
        <path
          d="M33 10C23 12 16 21 18 31C20 39 28 43 36 41C29 37 25 28 29 19C31 15 33 12 33 10Z"
          fill="currentColor"
        />
      </svg>
      <span className="relative rounded-full bg-mn-canvas/80 px-3 py-1 text-xs font-medium text-mn-ink-soft">
        {label}
      </span>
    </div>
  );
}