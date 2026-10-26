import { redirect } from "next/navigation";
import { getCart } from "@/app/actions/cart";
import { Container } from "@/components/ui/container";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.items.length === 0) redirect("/cart");
  if (cart.items.some((i) => i.status === "unavailable")) redirect("/cart");

  return (
    <main id="main" className="py-12 lg:py-24">
      <Container>
        <CheckoutForm cart={cart} />
      </Container>
    </main>
  );
}
