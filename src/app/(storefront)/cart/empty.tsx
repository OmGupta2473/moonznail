import { ButtonLink } from "@/components/ui/button-link";

export function EmptyCart() {
  return (
    <div className="mt-12 py-16 text-center">
      <p className="text-lg">Your cart is empty.</p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/shop">Browse sets</ButtonLink>
      </div>
    </div>
  );
}