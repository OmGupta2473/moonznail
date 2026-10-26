"use server";

import { verifyOwner } from "@/lib/admin-auth";
import { createPrivilegedClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { AdminResult } from "./admin";

export async function updateFulfilment(
  orderId: string,
  status: "processing" | "shipped" | "delivered" | "cancelled",
  trackingNumber?: string
): Promise<AdminResult> {
  try {
    await verifyOwner();
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  if (!orderId) {
    return { ok: false, reason: "invalid_input", message: "Invalid order ID." };
  }

  if (status === "shipped") {
    if (!trackingNumber || trackingNumber.trim().length < 2) {
      return { ok: false, reason: "invalid_input", message: "Tracking number is required for shipped status." };
    }
  }

  const supabase = createPrivilegedClient();
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("id, fulfilment_status, shipping_address")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) {
      return { ok: false, reason: "invalid_input", message: "Order not found." };
    }

    const allowed: Record<string, string[]> = {
      unfulfilled: ["processing"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered", "cancelled"],
      delivered: ["cancelled"],
    };

    if (!allowed[order.fulfilment_status]?.includes(status)) {
      return { ok: false, reason: "invalid_input", message: `Cannot transition from ${order.fulfilment_status} to ${status}.` };
    }

    const existing = (order.shipping_address ?? {}) as Record<string, unknown>;
    const updates: Record<string, unknown> = {
      fulfilment_status: status,
      ...(status === "shipped"
        ? { shipping_address: { ...existing, tracking_number: trackingNumber!.trim() } }
        : {}),
    };

    const { error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId);

    if (error) throw error;

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { ok: true };
  } catch (err) {
    console.error("updateFulfilment failed", err);
    return { ok: false, reason: "server_error", message: "Could not update order. Please try again." };
  }
}