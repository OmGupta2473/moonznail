import { cn } from "@/lib/cn";

export function Chip({
  children,
  selected,
  unavailable,
}: {
  children: React.ReactNode;
  selected?: boolean;
  unavailable?: boolean;
}) {
  return (
    <span
      aria-disabled={unavailable || undefined}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium",
        selected
          ? "border-2 border-mn-rose-deep bg-mn-blush text-mn-ink"
          : "border-mn-border-strong bg-transparent text-mn-ink",
        unavailable && "border-mn-border text-mn-ink-soft line-through opacity-70"
      )}
    >
      {selected ? (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
          <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {children}
    </span>
  );
}