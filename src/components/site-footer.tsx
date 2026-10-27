import Link from "next/link";
import { Container } from "./ui/container";

const groups = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All sets" },
      { href: "/looks", label: "Looks" },
      { href: "/cart", label: "Cart" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/services", label: "Services" },
      { href: "/about", label: "About" },
      { href: "/shop", label: "Enquire" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-mn-night text-mn-canvas">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-2xl">MoonzNails</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-mn-canvas/70">
              Development preview. Nail art by Nisha Gupta. Placeholder content — not final products, prices, or policies.
            </p>
          </div>
          {groups.map((group) => (
            <div key={group.title} className="lg:col-span-3">
              <p className="text-sm font-medium text-mn-canvas">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-mn-canvas/70 underline-offset-4 hover:text-mn-canvas hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-moon focus-visible:ring-offset-2 focus-visible:ring-offset-mn-night"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-mn-canvas/50">
          © 2026 MoonzNails. Development foundation build.
        </p>
      </Container>
    </footer>
  );
}