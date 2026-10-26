"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createEnquiry } from "@/app/actions/enquiries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EnquiryForm({
  serviceSlug,
  serviceTitle,
  lookSlug,
  lookTitle,
}: {
  serviceSlug?: string;
  serviceTitle?: string;
  lookSlug?: string;
  lookTitle?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const idempotencyKeyRef = useRef<string | null>(null);
  const formStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    idempotencyKeyRef.current = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    formStartedAtRef.current = Date.now();
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const local: Record<string, string> = {};
    if (name.trim().length < 2) local.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) local.email = "Please enter a valid email.";
    if (message.trim().length < 10) local.message = "Please write at least a few words (10+ characters).";
    if (message.trim().length > 2000) local.message = "Please keep your message under 2000 characters.";

    if (Object.keys(local).length > 0) {
      setFieldErrors(local);
      return;
    }

    startTransition(async () => {
      const result = await createEnquiry({
        name,
        email,
        phone: phone || undefined,
        message,
        serviceSlug,
        serviceTitle,
        lookSlug,
        lookTitle,
        idempotencyKey: idempotencyKeyRef.current ?? undefined,
        honeypot,
        formStartedAt: formStartedAtRef.current ?? undefined,
      });
      if (result.ok) {
        setReference(result.referenceNumber);
      } else {
        setError(result.message);
      }
    });
  }

  if (reference) {
    return (
      <div className="mt-8 rounded-2xl border border-mn-border bg-mn-blush/40 p-6">
        <h2 className="font-display text-2xl">Thank you — your enquiry has been received.</h2>
        <p className="mt-3 text-sm text-mn-ink-soft">
          Your reference number is <strong className="font-mono text-mn-ink">{reference}</strong>.
          I read every enquiry myself and reply within a few business days.
        </p>
        <p className="mt-3 text-sm text-mn-ink-soft">
          <strong>Please save your reference number.</strong> No confirmation email will be sent.
          If you do not hear back, reply to the address or phone number you provided, quoting this
          reference.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
      {(serviceTitle || lookTitle) && (
        <div className="rounded-xl border border-mn-border bg-mn-blush/30 p-4 text-sm">
          <p className="font-medium text-mn-ink">About this enquiry</p>
          {serviceTitle && <p className="mt-1 text-mn-ink-soft">Service: {serviceTitle}</p>}
          {lookTitle && <p className="mt-1 text-mn-ink-soft">Look: {lookTitle}</p>}
        </div>
      )}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website (leave empty)</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <Input
        id="name"
        label="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={fieldErrors.name}
        disabled={pending}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        disabled={pending}
      />
      <Input
        id="phone"
        label="Phone (optional)"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={fieldErrors.phone}
        disabled={pending}
      />
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-mn-ink">
          Your message
        </label>
        <textarea
          id="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={pending}
          aria-invalid={Boolean(fieldErrors.message)}
          className={`w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas ${fieldErrors.message ? "border-mn-error" : "border-mn-border-strong"}`}
          placeholder="Tell me about the set or service you have in mind, any inspo you have, and your timeline."
        />
        {fieldErrors.message && (
          <p className="text-sm text-mn-error">{fieldErrors.message}</p>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-mn-error/10 px-3 py-2 text-sm text-mn-error">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full h-12">
        {pending ? "Sending…" : "Send enquiry"}
      </Button>
      <p className="text-xs text-mn-ink-soft">
        No confirmation email will be sent. Save the reference number you receive after sending.
      </p>
    </form>
  );
}