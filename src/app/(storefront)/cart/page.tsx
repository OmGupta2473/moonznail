import { Container } from "@/components/ui/container";
import { CartPageView } from "@/components/cart/cart-page-view";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default function CartPage() {
  return (
    <main id="main" className="py-12 lg:py-24">
      <Container>
        <CartPageView />
      </Container>
    </main>
  );
}