export type CartLineStatus = "ok" | "unavailable";

export type CartLine = {
  productId: string;
  name: string;
  slug: string;
  unitPriceMinor: number | null;
  currency: string | null;
  quantity: number;
  imagePath: string | null;
  status: CartLineStatus;
  reason?: "unpublished" | "fixture" | "currency_mismatch" | "unpriced";
};

export type CartView = {
  items: CartLine[];
  subtotalMinor: number;
  currency: "INR";
  itemCount: number;
  hasUnavailable: boolean;
};

export const EMPTY_CART: CartView = {
  items: [],
  subtotalMinor: 0,
  currency: "INR",
  itemCount: 0,
  hasUnavailable: false,
};