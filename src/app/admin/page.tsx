import { Container } from "@/components/ui/container";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";

export default function AdminDashboard() {
  return (
    <div className="py-12 lg:py-24">
      <Container>
        <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-mn-ink-soft">
          Manage your catalogue, looks, services, and collections.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/products">
            <div className="rounded-2xl border border-mn-border bg-mn-canvas p-6 hover:bg-mn-blush/50 transition-colors">
              <h2 className="font-display text-2xl">Products</h2>
              <p className="mt-2 text-mn-ink-soft">Manage press-on nail sets</p>
              <ButtonLink href="/admin/products" variant="secondary" className="mt-6 inline-block">
                View Products
              </ButtonLink>
            </div>
          </Link>
          <Link href="/admin/looks">
            <div className="rounded-2xl border border-mn-border bg-mn-canvas p-6 hover:bg-mn-blush/50 transition-colors">
              <h2 className="font-display text-2xl">Looks</h2>
              <p className="mt-2 text-mn-ink-soft">Manage portfolio looks</p>
              <ButtonLink href="/admin/looks" variant="secondary" className="mt-6 inline-block">
                View Looks
              </ButtonLink>
            </div>
          </Link>
          <Link href="/admin/services">
            <div className="rounded-2xl border border-mn-border bg-mn-canvas p-6 hover:bg-mn-blush/50 transition-colors">
              <h2 className="font-display text-2xl">Services</h2>
              <p className="mt-2 text-mn-ink-soft">Manage nail services</p>
              <ButtonLink href="/admin/services" variant="secondary" className="mt-6 inline-block">
                View Services
              </ButtonLink>
            </div>
          </Link>
          <Link href="/admin/collections">
            <div className="rounded-2xl border border-mn-border bg-mn-canvas p-6 hover:bg-mn-blush/50 transition-colors">
              <h2 className="font-display text-2xl">Collections</h2>
              <p className="mt-2 text-mn-ink-soft">Manage product collections</p>
              <ButtonLink href="/admin/collections" variant="secondary" className="mt-6 inline-block">
                View Collections
              </ButtonLink>
            </div>
          </Link>
        </div>
      </Container>
    </div>
  );
}