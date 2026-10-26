import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-mn-blush motion-reduce:animate-none",
        className
      )}
    />
  );
}