import { cn } from "@/lib/cn";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-mn-blush px-3 py-1 text-xs font-medium text-mn-ink",
        className
      )}
    >
      {children}
    </span>
  );
}