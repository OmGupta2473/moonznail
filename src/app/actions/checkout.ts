"use server";

import { createPrivilegedClient } from "@/lib/supabase/admin";
import { getCart } from "./cart";
import crypto from "node:crypto";
import { clearCart } from "./cart";

type CheckoutInput = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal: string;
};

export type CreateOrderResult =
  | { ok: true; accessToken: string; orderNumber: string }
  | { ok: false; reason: "empty_cart" | "invalid_input" | "server_error"; message: string };

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli",
  "Daman and Diu", "Lakshadweep", "Delhi", "Puducherry",
];

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  // Server-side validation
  if (!input.name || input.name.trim().length < 2) {
    return { ok: false, reason: "invalid_input", message: "Name must be at least 2 characters." };
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { ok: false, reason: "invalid_input", message: "Please enter a valid email address." };
  }
  const phoneDigits = input.phone.replace(/\D/g, "");
  if (!phoneDigits || phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits)) {
    return { ok: false, reason: "invalid_input", message: "Please enter a valid 10-digit Indian phone number." };
  }
  if (!input.line1 || !input.city || !input.state || !input.postal) {
    return { ok: false, reason: "invalid_input", message: "All address fields are required." };
  }
  if (input.postal.length !== 6 || !/^\d{6}$/.test(input.postal)) {
    return { ok: false, reason: "invalid_input", message: "Please enter a valid 6-digit postal code." };
  }
  if (!INDIAN_STATES.includes(input.state)) {
    return { ok: false, reason: "invalid_input", message: "Please select a valid Indian state." };
  }

  // Read cart server-side
  const cart = await getCart();
  if (cart.items.length === 0) {
    return { ok: false, reason: "empty_cart", message: "Your cart is empty." };
  }
  if (cart.items.some((i) => i.status === "unavailable")) {
    return { ok: false, reason: "empty_cart", message: "Some items in your cart are unavailable." };
  }

  // Recompute subtotal
  const subtotalMinor = cart.items
    .filter((i) => i.status === "ok")
    .reduce((sum, i) => sum + (i.unitPriceMinor ?? 0) * i.quantity, 0);

  // Generate order number and token
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomHex = crypto.randomBytes(2).toString("hex").toUpperCase();
  const orderNumber = `MN-${dateStr}-${randomHex}`;
  const accessToken = crypto.randomBytes(32).toString("base64url");
  const accessTokenHash = crypto.createHash("sha256").update(accessToken).digest("hex");

  // Create shipping address (phone inside address, not top-level)
  const shippingAddress = {
    line1: input.line1,
    line2: input.line2 || undefined,
    city: input.city,
    state: input.state,
    postal: input.postal,
    country: "India",
    phone: input.phone,
  };

  const supabase = createPrivilegedClient();

  try {
    // Insert order first. If items fail, delete the order (compensating rollback).
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        access_token_hash: accessTokenHash,
        order_number: orderNumber,
        customer_name: input.name,
        email: input.email,
        shipping_address: shippingAddress,
        subtotal_minor: subtotalMinor,
        total_minor: subtotalMinor,
        currency: "INR",
        payment_status: "pending",
        fulfilment_status: "unfulfilled",
        razorpay_env: "test",
      })
      .select("id")
      .single();

    if (orderError) throw orderError;
    if (!orderData) throw new Error("Order insert returned no data");

    const itemsToInsert = cart.items
      .filter((i) => i.status === "ok")
      .map((i) => ({
        order_id: orderData.id,
        product_id: i.productId,
        product_name: i.name,
        unit_price_minor: i.unitPriceMinor ?? 0,
        quantity: i.quantity,
        line_total_minor: (i.unitPriceMinor ?? 0) * i.quantity,
      }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemsToInsert);

    if (itemsError) {
      // Compensating delete — best effort. The order will be orphaned but not orphaned with items.
      await supabase.from("orders").delete().eq("id", orderData.id);
      throw itemsError;
    }

    await clearCart();

    return { ok: true, accessToken, orderNumber };
  } catch (err) {
    console.error("createOrder failed", err);
    return { ok: false, reason: "server_error", message: "Could not process your order. Please try again." };
  }
}