import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createPrivilegedClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RazorpayWebhookEvent = {
  event?: string;
  id?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
    order?: { entity?: { id?: string } };
  };
};

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) return new NextResponse("No signature", { status: 400 });

  const raw = await request.text();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return new NextResponse("Webhook secret not configured", { status: 500 });

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const provided = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (provided.length !== expectedBuf.length || !crypto.timingSafeEqual(provided, expectedBuf)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try { event = JSON.parse(raw); } catch { return new NextResponse("Bad JSON", { status: 400 }); }
  if (!event.id || !event.event) return new NextResponse("Missing event fields", { status: 400 });

  const supabase = createPrivilegedClient();

  // Idempotency: insert event id; on conflict, return 200 (already processed).
  const { error: insErr } = await supabase.from("razorpay_events").insert({ event_id: event.id, event_type: event.event });
  if (insErr) {
    if (insErr.code === "23505") return new NextResponse("Already processed", { status: 200 });
    console.error("razorpay_events insert failed", insErr);
    return new NextResponse("Store error", { status: 500 });
  }

  // Extract razorpay order id from event.payload.
  const rzpOrderId =
    event.payload?.payment?.entity?.order_id ??
    event.payload?.order?.entity?.id;

  if (!rzpOrderId) return new NextResponse("No order id in payload", { status: 200 });

  if (event.event === "payment.captured" || event.event === "payment.authorized") {
    const paymentId = event.payload?.payment?.entity?.id;
    await supabase
      .from("orders")
      .update({ payment_status: "paid", razorpay_payment_id: paymentId ?? null })
      .eq("razorpay_order_id", rzpOrderId)
      .eq("payment_status", "pending");
  } else if (event.event === "payment.failed") {
    // Do not overwrite a paid order.
    await supabase
      .from("orders")
      .update({ payment_status: "failed" })
      .eq("razorpay_order_id", rzpOrderId)
      .eq("payment_status", "pending");
  }

  return new NextResponse("OK", { status: 200 });
}