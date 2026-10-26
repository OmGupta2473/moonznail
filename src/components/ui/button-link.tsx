import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-base font-medium transition-colors motion-safe:transition-transform motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas";

const variants: Record<Variant, string> = {
  primary: "bg-mn-rose-deep text-white hover:bg-mn-rose-ink",
  secondary:
    "border-[1.5px] border-mn-rose-deep bg-transparent text-mn-rose-deep hover:bg-mn-blush",
  ghost: "text-mn-ink underline-offset-4 hover:underline",
};

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}