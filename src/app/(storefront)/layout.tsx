import { getCart } from "@/app/actions/cart";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const cart = await getCart();
  return (
    <CartProvider initialCart={cart}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
      <CartDrawer />
    </CartProvider>
  );
}