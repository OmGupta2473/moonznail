import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ui/product-card";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-mn-canvas">
      <SiteHeader />
      <main id="main" className="py-12 lg:py-24">
        <Container>
          <h1 className="font-display text-4xl tracking-tight mb-12">Styleguide</h1>
          <p className="text-mn-ink-soft mb-12 max-w-2xl">Development reference for Lunar Blush tokens and primitive components. All specimens are labelled.</p>

          {/* Colour Tokens */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">Colour tokens</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "mn-canvas", value: "#FFF9F6", text: "mn-ink" },
                { name: "mn-blush", value: "#FBEDEA", text: "mn-ink" },
                { name: "mn-petal", value: "#F3C7CE", text: "mn-ink" },
                { name: "mn-rose", value: "#D9728F", text: "white" },
                { name: "mn-rose-deep", value: "#B23A5C", text: "white" },
                { name: "mn-rose-ink", value: "#8F2744", text: "white" },
                { name: "mn-ink", value: "#2B1F24", text: "mn-canvas" },
                { name: "mn-ink-soft", value: "#6E5A60", text: "mn-canvas" },
                { name: "mn-border", value: "#EAD7D5", text: "mn-ink" },
                { name: "mn-border-strong", value: "#8C7077", text: "mn-canvas" },
                { name: "mn-night", value: "#2A1A24", text: "mn-canvas" },
                { name: "mn-moon", value: "#C8A96A", text: "mn-ink" },
                { name: "mn-success", value: "#2E7D5B", text: "white" },
                { name: "mn-error", value: "#B3261E", text: "white" },
                { name: "mn-warn-bg", value: "#FFF3D6", text: "mn-warn-ink" },
                { name: "mn-warn-ink", value: "#7A5200", text: "mn-canvas" },
              ].map((token) => (
                <div key={token.name} className="rounded-xl overflow-hidden border border-mn-border">
                  <div className={`h-24 ${token.text === "mn-ink" ? "text-mn-ink" : token.text === "white" ? "text-white" : "text-mn-canvas"} flex items-end p-4`} style={{ backgroundColor: token.value }}>
                    <code className="text-xs font-mono bg-black/10 px-2 py-1 rounded">{token.name}</code>
                  </div>
                  <div className="p-3 bg-mn-canvas">
                    <code className="text-sm font-mono text-mn-ink-soft">{token.value}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">Typography</h2>
            <div className="space-y-8 max-w-3xl">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">Display (Fraunces)</p>
                <p className="font-display text-[2.5rem] leading-[3rem] tracking-tight text-mn-ink">Display — 40/48 mobile, 72/76 desktop</p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">H1 (Fraunces)</p>
                <h1 className="font-display text-[2rem] leading-[2.5rem] tracking-tight text-mn-ink">H1 — 32/38 mobile, 52/56 desktop</h1>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">H2 (Fraunces)</p>
                <h2 className="font-display text-[1.625rem] leading-8 tracking-tight text-mn-ink">H2 — 26/32 mobile, 38/44 desktop</h2>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">H3 (Fraunces)</p>
                <h3 className="font-display text-[1.25rem] leading-7 tracking-tight text-mn-ink">H3 — 20/28 mobile, 26/34 desktop</h3>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">Body large (DM Sans)</p>
                <p className="text-base leading-7 text-mn-ink">Body large — 18/28 both breakpoints</p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">Body (DM Sans)</p>
                <p className="text-base leading-6 text-mn-ink">Body — 16/26 both breakpoints. This is the default paragraph size.</p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">Small (DM Sans)</p>
                <p className="text-sm leading-5 text-mn-ink-soft">Small — 14/20 both breakpoints. Used for meta and helper text.</p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-mn-rose-deep mb-2">Caption (DM Sans)</p>
                <p className="text-xs leading-4 text-mn-ink-soft">Caption — 12/16 both breakpoints. Non-essential labels only.</p>
              </div>
            </div>
          </section>

          {/* ButtonLink variants */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">ButtonLink — Specimens only</h2>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/design-preview" variant="primary">Primary</ButtonLink>
              <ButtonLink href="/design-preview" variant="secondary">Secondary</ButtonLink>
              <ButtonLink href="/design-preview" variant="ghost">Ghost</ButtonLink>
            </div>
          </section>

          {/* Input states */}
          <section className="mb-16 max-w-md">
            <h2 className="font-display text-2xl tracking-tight mb-6">Input — Specimens only</h2>
            <div className="space-y-6">
              <Input id="input-default" label="Email address" defaultValue="you@example.com" />
              <Input id="input-hint" label="Phone" hint="We'll never share your number" defaultValue="+1 555 0192" />
              <Input id="input-error" label="Email" error="Enter a valid email address" defaultValue="invalid" />
              <Input id="input-disabled" label="Disabled" disabled defaultValue="Cannot edit" />
            </div>
          </section>

          {/* Chip states */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">Chip — Specimens only</h2>
            <div className="flex flex-wrap gap-3">
              <Chip>Default</Chip>
              <Chip selected>Selected</Chip>
              <Chip unavailable>Unavailable</Chip>
            </div>
          </section>

          {/* Badge */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">Badge — Specimens only</h2>
            <div className="flex flex-wrap gap-3">
              <Badge>New</Badge>
              <Badge>Limited</Badge>
              <Badge>Preview only</Badge>
            </div>
          </section>

          {/* Skeleton */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">Skeleton — Specimens only</h2>
            <div className="space-y-4 max-w-md">
              <Skeleton className="h-48 w-full rounded-3xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </section>

          {/* ProductCard */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">ProductCard — Specimen only</h2>
            <div className="max-w-sm">
              <ProductCard
                name="Rosewater Almond"
                price="$32"
                meta="Almond · Short"
                href="/shop"
              />
            </div>
          </section>

          {/* PlaceholderMedia */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">PlaceholderMedia — Specimen only</h2>
            <div className="max-w-md">
              <PlaceholderMedia className="aspect-[4/5]" label="Hero photography pending" />
            </div>
          </section>

          {/* Forced focus state */}
          <section className="mb-16">
            <h2 className="font-display text-2xl tracking-tight mb-6">Forced focus state — Specimen only</h2>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="/design-preview" variant="primary" className="focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas">Primary (focused)</ButtonLink>
              <ButtonLink href="/design-preview" variant="secondary" className="focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas">Secondary (focused)</ButtonLink>
              <a href="/design-preview" className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-base font-medium text-mn-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas">Ghost (focused)</a>
            </div>
          </section>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}