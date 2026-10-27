"use client";

import { useState, useTransition } from "react";
import { signInWithPassword } from "@/app/actions/auth";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // THIS IS THE CRITICAL LINE: It stops the password from going into the URL.
    e.preventDefault(); 
    
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signInWithPassword(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-mn-ink">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-12 w-full rounded-xl border border-mn-border-strong bg-mn-canvas px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-mn-ink">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 w-full rounded-xl border border-mn-border-strong bg-mn-canvas px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-mn-error/10 px-3 py-2 text-sm text-mn-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-mn-rose-deep px-6 font-medium text-white transition-colors hover:bg-mn-rose-ink disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}