"use client";

import { useState, FormEvent } from "react";
import { signInWithOtp } from "@/app/actions/auth";
import { cn } from "@/lib/cn";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");
    setMessage("");

    const formData = new FormData();
    formData.append("email", email);

    const result = await signInWithOtp(formData);

    if (result.success) {
      setStatus("success");
      setMessage("Check your email for the login link.");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto mt-8 w-16 h-16 rounded-full bg-mn-success/10 flex items-center justify-center">
          <svg className="h-8 w-8 text-mn-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="mt-6 text-base leading-7 text-mn-ink">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-mn-ink">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "pending"}
          className={cn(
            "mt-2 w-full rounded-xl border bg-mn-canvas px-4 py-3 text-base text-mn-ink placeholder:text-mn-ink-soft/70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
            "disabled:cursor-not-allowed disabled:opacity-45",
            status === "error" ? "border-mn-error" : "border-mn-border-strong"
          )}
          placeholder="you@example.com"
        />
        {status === "error" && (
          <p className="mt-2 text-sm text-mn-error" role="alert">{message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "pending"}
        className={cn(
          "w-full min-h-12 rounded-full bg-mn-rose-deep px-6 text-base font-medium text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas",
          "disabled:cursor-not-allowed disabled:opacity-45",
          "motion-safe:transition-transform motion-safe:active:scale-[0.98]"
        )}
      >
        {status === "pending" ? "Sending..." : "Send Magic Link"}
      </button>
    </form>
  );
}