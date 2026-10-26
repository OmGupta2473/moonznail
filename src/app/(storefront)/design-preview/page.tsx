import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { ProductCard } from "@/components/ui/product-card";

const products = [
  { name: "Rosewater Almond", price: "$32", meta: "Almond · Short", href: "/shop" },
  { name: "Moonlit Chrome", price: "$38", meta: "Square · Medium", href: "/shop" },
  { name: "Blush Square", price: "$30", meta: "Square · Short", href: "/shop" },
  { name: "Pearl Round", price: "$34", meta: "Round · Medium", href: "/shop" },
];

export const metadata = {
  robots: { index: false, follow: false },
};

export default function DesignPreviewPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-mn-warn-bg px-5 py-2 text-center text-xs font-medium text-mn-warn-ink">
        Development preview — placeholder content, not final products, prices, or photography.
      </div>
      <main id="main">
        <section className="pb-12 pt-8 lg:pb-24 lg:pt-16">
          <Container>
            <div className="grid grid-cols-12 gap-8 items-center relative">
              <div className="col-span-12 relative z-20 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:pt-8">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep">
                  Independent nail artist
                </p>
                <h1 className="mt-4 max-w-xl font-display text-[2.5rem] leading-[3rem] tracking-tight lg:text-[4.5rem] lg:leading-[4.75rem]">
                  Nail art, made by hand.
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-mn-ink-soft">
                  Press-on sets and nail services by [Artist name]. A small studio practice, made slowly and finished by hand.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/shop">Shop sets</ButtonLink>
                  <ButtonLink href="/looks" variant="secondary">
                    See the looks
                  </ButtonLink>
                </div>
              </div>
              <div className="col-span-12 relative z-0 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mt-12">
                <PlaceholderMedia className="aspect-[4/5] lg:aspect-[3/2]" label="Hero photography pending" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-mn-canvas via-mn-canvas/70 to-transparent lg:block rounded-3xl"
                />
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-mn-border py-12 lg:py-24">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-[1.625rem] leading-8 tracking-tight lg:text-[2.375rem] lg:leading-[2.75rem]">
                  New and favourites
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-mn-ink-soft">
                  Development cards. Real catalogue data will replace these names and prices.
                </p>
              </div>
              <ButtonLink href="/shop" variant="ghost" className="hidden sm:inline-flex">
                View all
              </ButtonLink>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.name} {...product} />
              ))}
            </div>
            <div className="mt-6 sm:hidden">
              <ButtonLink href="/shop" variant="secondary" className="w-full">
                View all sets
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}