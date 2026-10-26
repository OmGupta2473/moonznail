import Link from "next/link";
import { Container } from "./ui/container";
import { MobileMenu } from "./mobile-menu";
import { CartIcon } from "./cart/cart-icon";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/looks", label: "Looks" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-mn-border">
      <Container className="flex h-16 items-center justify-between lg:h-20">
        <Link
          href="/design-preview"
          className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-mn-moon" fill="none">
            <path
              d="M16 4C10 5 6 10 7 16C8 20 12 22 17 21C13 19 11 14 13 9C14 7 15 5 16 4Z"
              fill="currentColor"
            />
          </svg>
          <span className="font-display text-xl tracking-tight">MoonzNails</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-mn-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <CartIcon />
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}