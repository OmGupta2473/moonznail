import { cn } from "@/lib/cn";
import { ReactNode } from "react";

export function Button({
  children,
  variant = "primary",
  className,
  disabled,
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" && "bg-mn-rose-deep text-white hover:bg-mn-rose-mid",
        variant === "secondary" && "border border-mn-border-strong text-mn-ink hover:bg-mn-blush",
        variant === "ghost" && "text-mn-ink hover:bg-mn-blush",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
