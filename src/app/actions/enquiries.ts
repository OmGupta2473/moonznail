"use server";

import crypto from "node:crypto";
import { createPrivilegedClient } from "@/lib/supabase/admin";
import { verifyOwner } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

export type EnquiryInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  serviceSlug?: string;
  serviceTitle?: string;
  lookSlug?: string;
  lookTitle?: string;
  idempotencyKey?: string;
  honeypot?: string;        // must be empty
  formStartedAt?: number;   // epoch ms from the client form
};

export type EnquiryResult =
  | { ok: true; referenceNumber: string }
  | { ok: false; reason: "invalid_input" | "spam" | "server_error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateReference(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `ENQ-${date}-${rand}`;
}

export async function createEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  // 1. Honeypot — silently drop, but return success so bots cannot probe.
  if (input.honeypot && input.honeypot.trim().length > 0) {
    return { ok: true, referenceNumber: generateReference() };
  }

  // 2. Time gate — humans need at least ~2 seconds to fill the form.
  if (!input.formStartedAt || Date.now() - input.formStartedAt < 2000) {
    return {
      ok: false,
      reason: "spam",
      message: "Please take a moment to review your message before submitting.",
    };
  }

  // 3. Validate.
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const phone = input.phone?.trim() ?? "";
  const message = input.message.trim();

  if (name.length < 2 || name.length > 100) {
    return { ok: false, reason: "invalid_input", message: "Please enter your name (2–100 characters)." };
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { ok: false, reason: "invalid_input", message: "Please enter a valid email address." };
  }
  if (phone && !/^[0-9 +()-]{7,20}$/.test(phone)) {
    return { ok: false, reason: "invalid_input", message: "Phone number format looks invalid." };
  }
  if (message.length < 10 || message.length > 2000) {
    return { ok: false, reason: "invalid_input", message: "Please write a message between 10 and 2000 characters." };
  }

  const supabase = createPrivilegedClient();

  // 4. Idempotency — if the caller provided a key, return the existing enquiry.
  if (input.idempotencyKey) {
    const { data: existing } = await supabase
      .from("enquiries")
      .select("reference_number")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing) {
      return { ok: true, referenceNumber: existing.reference_number };
    }
  }

  // 5. Insert.
  const referenceNumber = generateReference();
  const { error } = await supabase.from("enquiries").insert({
    reference_number: referenceNumber,
    name,
    email,
    phone: phone || null,
    message,
    service_slug: input.serviceSlug ?? null,
    service_title: input.serviceTitle ?? null,
    look_slug: input.lookSlug ?? null,
    look_title: input.lookTitle ?? null,
    idempotency_key: input.idempotencyKey ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      // Unique constraint — likely reference collision or idempotency race.
      console.error("createEnquiry unique violation", error);
      return {
        ok: false,
        reason: "server_error",
        message: "There was a problem saving your enquiry. Please try again.",
      };
    }
    console.error("createEnquiry failed", error);
    return {
      ok: false,
      reason: "server_error",
      message: "There was a problem saving your enquiry. Please try again.",
    };
  }

  revalidatePath("/admin/enquiries");
  return { ok: true, referenceNumber };
}

export type EnquiryStatus = "new" | "replied" | "archived";

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await verifyOwner();
  } catch {
    return { ok: false, message: "Not authorized" };
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { ok: false, message: "Invalid enquiry id." };
  }
  if (!["new", "replied", "archived"].includes(status)) {
    return { ok: false, message: "Invalid status." };
  }

  const supabase = createPrivilegedClient();
  const { error } = await supabase
    .from("enquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("updateEnquiryStatus failed", error);
    return { ok: false, message: "Could not update status. Please try again." };
  }
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  return { ok: true };
}