"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/checkout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { INDIAN_STATES } from "./checkout-utils";
import type { CartView } from "@/lib/cart/types";

export function CheckoutForm({ cart }: { cart: CartView }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10 || !/^[6-9]/.test(phoneDigits))
      next.phone = "Enter a valid 10-digit Indian phone number.";
    if (line1.trim().length < 5) next.line1 = "Enter a valid address line 1.";
    if (city.trim().length < 2) next.city = "Enter your city.";
    if (!INDIAN_STATES.includes(state)) next.state = "Select your state.";
    if (!/^\d{6}$/.test(postal)) next.postal = "Enter a valid 6-digit postal code.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setServerError(null);
    startTransition(async () => {
      const result = await createOrder({
        name, email, phone, line1,
        line2: line2 || undefined,
        city, state, postal,
      });
      if (result.ok) {
        router.push(`/order/${result.accessToken}`);
      } else {
        setServerError(result.message);
      }
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-4xl tracking-tight lg:text-5xl">Checkout</h1>
      <p className="mt-4 text-mn-ink-soft max-w-xl">
        Payment is not yet enabled. Your order will be recorded and I will contact you to arrange payment and shipping.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] items-start">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <div className="space-y-6">
            <h2 className="font-display text-2xl border-b border-mn-border pb-2">Contact Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} disabled={pending} />
              <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} disabled={pending} />
            </div>
            <Input id="phone" label="Phone (10-digit Indian number)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} disabled={pending} />
          </div>

          <div className="space-y-6 pt-6">
            <h2 className="font-display text-2xl border-b border-mn-border pb-2">Shipping Address</h2>
            <Input id="line1" label="Address line 1" value={line1} onChange={(e) => setLine1(e.target.value)} error={errors.line1} disabled={pending} />
            <Input id="line2" label="Address line 2 (optional)" value={line2} onChange={(e) => setLine2(e.target.value)} disabled={pending} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input id="city" label="City" value={city} onChange={(e) => setCity(e.target.value)} error={errors.city} disabled={pending} />
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-mn-ink">State</label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={pending}
                  className={`h-12 w-full rounded-xl border bg-mn-canvas px-4 text-base ${errors.state ? "border-mn-error" : "border-mn-border-strong"}`}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-sm text-mn-error">{errors.state}</p>}
              </div>
              <Input id="postal" label="Postal code" value={postal} onChange={(e) => setPostal(e.target.value)} error={errors.postal} disabled={pending} />
            </div>
            <p className="text-sm text-mn-ink-soft">Country: India</p>
          </div>

          {serverError && (
            <p role="alert" className="rounded-lg bg-mn-error/10 px-3 py-2 text-sm text-mn-error">
              {serverError}
            </p>
          )}

          <div className="pt-6">
            <Button type="submit" disabled={pending} className="w-full h-14 text-lg">
              {pending ? "Placing order…" : "Place order"}
            </Button>
            <p className="mt-4 text-center text-xs text-mn-ink-soft">
              No payment will be taken. I will contact you to arrange payment.
            </p>
          </div>
        </form>

        {/* Right: Summary */}
        <aside className="bg-mn-surface-3 p-6 lg:p-8 rounded-2xl lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Your Order</h2>
          <div className="mt-6 space-y-4 divide-y divide-mn-border/50">
            {cart.items.map((i) => (
              <div key={i.productId} className="flex justify-between pt-4 text-sm">
                <span className="text-mn-ink-soft">{i.quantity} × {i.name}</span>
                <span className="tabular-nums">{formatPrice((i.unitPriceMinor ?? 0) * i.quantity, i.currency) ?? "—"}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-mn-border pt-4 flex justify-between text-lg font-medium">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatPrice(cart.subtotalMinor, cart.currency) ?? "₹0"}</span>
          </div>
          <p className="mt-4 text-xs text-mn-ink-soft">Shipping and tax calculated by the artist after the order is placed.</p>
        </aside>
      </div>
    </div>
  );
}