"use server";
import { revalidatePath } from "next/cache";
import { createPrivilegedClient } from "@/lib/supabase/admin";
import {
  generateToken, hashToken, readCartCookie, writeCartCookie,
} from "@/lib/cart/cookie";
import { findCartByHash, createCart } from "@/lib/cart/session";
import { EMPTY_CART, type CartView, type CartLine } from "@/lib/cart/types";

export type CartMutationResult =
  | { ok: true; cart: CartView }
  | { ok: false; reason: "invalid_input" | "quantity_exceeded" | "product_unavailable" | "server_error"; message?: string; cap?: number };

async function ensureCart(): Promise<{ cartId: string; currency: string; token: string }> {
  const existingToken = await readCartCookie();
  if (existingToken) {
    const existing = await findCartByHash(hashToken(existingToken));
    if (existing) return { cartId: existing.id, currency: existing.currency, token: existingToken };
  }
  const newToken = generateToken();
  const cart = await createCart(hashToken(newToken), "INR");
  await writeCartCookie(newToken);
  return { cartId: cart.id, currency: cart.currency, token: newToken };
}

export async function getCart(): Promise<CartView> {
  const token = await readCartCookie();
  if (!token) return EMPTY_CART;

  const cart = await findCartByHash(hashToken(token));
  if (!cart) return EMPTY_CART;

  const supabase = createPrivilegedClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      quantity,
      product:products (
        id, name, slug, price_minor, currency, is_published, is_fixture,
        product_media ( storage_path, sort_order )
      )
    `)
    .eq("cart_id", cart.id);
  if (error) throw error;

  const items: CartLine[] = [];
  for (const row of data ?? []) {
    const p = Array.isArray(row.product) ? row.product[0] : row.product;
    if (!p) {
      items.push({
        productId: "unknown",
        name: "Unavailable item",
        slug: "",
        unitPriceMinor: null,
        currency: null,
        quantity: row.quantity,
        imagePath: null,
        status: "unavailable",
        reason: "unpublished",
      });
      continue;
    }
    const media = Array.isArray(p.product_media) ? p.product_media : [];
    const sorted = [...media].sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    );

    if (!p.is_published) {
      items.push({
        productId: p.id, name: p.name, slug: p.slug,
        unitPriceMinor: null, currency: null, quantity: row.quantity,
        imagePath: sorted[0]?.storage_path ?? null,
        status: "unavailable", reason: "unpublished",
      });
      continue;
    }
    if (p.is_fixture) {
      items.push({
        productId: p.id, name: p.name, slug: p.slug,
        unitPriceMinor: p.price_minor, currency: p.currency, quantity: row.quantity,
        imagePath: sorted[0]?.storage_path ?? null,
        status: "unavailable", reason: "fixture",
      });
      continue;
    }
    if (p.currency !== cart.currency) {
      items.push({
        productId: p.id, name: p.name, slug: p.slug,
        unitPriceMinor: p.price_minor, currency: p.currency, quantity: row.quantity,
        imagePath: sorted[0]?.storage_path ?? null,
        status: "unavailable", reason: "currency_mismatch",
      });
      continue;
    }
    if (p.price_minor === null) {
      items.push({
        productId: p.id, name: p.name, slug: p.slug,
        unitPriceMinor: null, currency: p.currency, quantity: row.quantity,
        imagePath: sorted[0]?.storage_path ?? null,
        status: "unavailable", reason: "unpriced",
      });
      continue;
    }
    items.push({
      productId: p.id, name: p.name, slug: p.slug,
      unitPriceMinor: p.price_minor, currency: p.currency, quantity: row.quantity,
      imagePath: sorted[0]?.storage_path ?? null,
      status: "ok",
    });
  }

  const okItems = items.filter((i) => i.status === "ok");
  const subtotalMinor = okItems.reduce(
    (s, i) => s + (i.unitPriceMinor ?? 0) * i.quantity, 0
  );
  const itemCount = okItems.reduce((s, i) => s + i.quantity, 0);
  const hasUnavailable = items.some((i) => i.status === "unavailable");
  return { items, subtotalMinor, currency: "INR", itemCount, hasUnavailable };
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<CartMutationResult> {
  try {
    if (!isUuid(productId)) return { ok: false, reason: "invalid_input" };
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)
      return { ok: false, reason: "invalid_input" };

    const supabase = createPrivilegedClient();
    const { data: product, error: pErr } = await supabase
      .from("products")
      .select("id, price_minor, currency, is_published, is_fixture")
      .eq("id", productId)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!product || !product.is_published || product.is_fixture)
      return { ok: false, reason: "product_unavailable" };
    if (product.price_minor === null || product.currency !== "INR")
      return { ok: false, reason: "product_unavailable" };

    const { cartId, token } = await ensureCart();

    const { error } = await supabase.rpc("add_to_cart_atomic", {
      p_cart_id: cartId,
      p_product_id: productId,
      p_quantity: quantity,
    });
    if (error) {
      if (error.message.includes("quantity_exceeded"))
        return { ok: false, reason: "quantity_exceeded", cap: 10 };
      throw error;
    }
    await writeCartCookie(token);
    revalidatePath("/cart");
    return { ok: true, cart: await getCart() };
  } catch (err) {
    console.error("addToCart failed", err instanceof Error ? err.message : err);
    return { ok: false, reason: "server_error" };
  }
}

export async function updateQuantity(
  productId: string,
  quantity: number
): Promise<CartMutationResult> {
  try {
    if (!isUuid(productId)) return { ok: false, reason: "invalid_input" };
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 10)
      return { ok: false, reason: "invalid_input" };

    const token = await readCartCookie();
    if (!token) return { ok: false, reason: "invalid_input" };
    const cart = await findCartByHash(hashToken(token));
    if (!cart) return { ok: false, reason: "invalid_input" };

    const supabase = createPrivilegedClient();
    if (quantity === 0) {
      const { error } = await supabase
        .from("cart_items").delete()
        .eq("cart_id", cart.id).eq("product_id", productId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("cart_items").update({ quantity })
        .eq("cart_id", cart.id).eq("product_id", productId);
      if (error) throw error;
    }
    await writeCartCookie(token);
    revalidatePath("/cart");
    return { ok: true, cart: await getCart() };
  } catch (err) {
    console.error("updateQuantity failed", err instanceof Error ? err.message : err);
    return { ok: false, reason: "server_error" };
  }
}

export async function removeFromCart(productId: string): Promise<CartMutationResult> {
  try {
    if (!isUuid(productId)) return { ok: false, reason: "invalid_input" };
    const token = await readCartCookie();
    if (!token) return { ok: true, cart: EMPTY_CART };
    const cart = await findCartByHash(hashToken(token));
    if (!cart) return { ok: true, cart: EMPTY_CART };

    const supabase = createPrivilegedClient();
    const { error } = await supabase
      .from("cart_items").delete()
      .eq("cart_id", cart.id).eq("product_id", productId);
    if (error) throw error;
    revalidatePath("/cart");
    return { ok: true, cart: await getCart() };
  } catch (err) {
    console.error("removeFromCart failed", err instanceof Error ? err.message : err);
    return { ok: false, reason: "server_error" };
  }
}

export async function clearCart(): Promise<CartMutationResult> {
  try {
    const token = await readCartCookie();
    if (!token) return { ok: true, cart: EMPTY_CART };
    const cart = await findCartByHash(hashToken(token));
    if (!cart) return { ok: true, cart: EMPTY_CART };
    const supabase = createPrivilegedClient();
    const { error } = await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    if (error) throw error;
    revalidatePath("/cart");
    return { ok: true, cart: await getCart() };
  } catch (err) {
    console.error("clearCart failed", err instanceof Error ? err.message : err);
    return { ok: false, reason: "server_error" };
  }
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}