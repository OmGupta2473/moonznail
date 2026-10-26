# MoonzNails — Integration Contracts and Environment Variables

Last updated: 2026-10-25

Record environment variable names and external-service contracts here as they are confirmed. Never record secret values.

## Confirmed

| Service | Purpose | Status | Env vars |
|---|---|---|---|
| Supabase | Backend: database, auth, storage, RLS | Connected (client-only in this batch) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

## Open — provider not selected

| Service | Purpose | Status | Env vars |
|---|---|---|---|
| Payment gateway | Card/UPI/etc. payment initiation and verified webhook | Not selected | TBD |
| Transactional email | Order and enquiry notifications | Not selected | TBD |
| Hosting | Deployment for the Next.js app | Not selected | TBD |
| Error monitoring | Runtime error reporting | Not selected | TBD |

## Installed packages

| Package | Version | Purpose |
|---|---|---|
| `@supabase/supabase-js` | 2.118.0 | Supabase JavaScript client for server-only public client |

## Supabase configuration notes

- The **publishable key** (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) is browser-safe and may appear in client code. It is constrained by RLS.
- The **service role key** is not used anywhere in this batch and must never appear in client code, a `NEXT_PUBLIC_*` variable, a log, or a report.
- Storage bucket: `product-media` (public, read-only for clients). Uploads happen through the dashboard or a future authenticated admin batch.
- Remote image hostnames are derived from `NEXT_PUBLIC_SUPABASE_URL` at build time; missing variable does not break the build.

## Rules

- Environment variable names are recorded here. Values are never recorded.
- `.env.example` lists every required variable name. It contains names only, no values.
- Payment is marked paid only from verified server-to-server notification. Never from the browser.
## Razorpay (Payment Gateway — India / INR)

- **Provider:** Razorpay
- **Currency:** INR (paise as minor units)
- **Environment variables:**
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` — safe to expose to browser; used by Checkout.js
  - `RAZORPAY_KEY_ID` — server-side; used in API calls
  - `RAZORPAY_KEY_SECRET` — **never expose to browser**; used for signature verification
- **Test keys** start with `rzp_test_...`
- **Integration model:** Order created server-side (`POST /v1/orders`) → Checkout.js opens in browser → payment captured → webhook verifies signature → order marked paid
- **Status:** Schema ready; integration in Step 2.


## Cart Security Model

- Guest cart identified by a 32-byte random token stored in an HttpOnly cookie (`cart_session`).
- Cookie is HMAC-SHA256 signed with `CART_COOKIE_SECRET`.
- Database stores only the SHA-256 hash of the token in `carts.session_hash`.
- No RLS access for anon/authenticated on carts or cart_items — all access via server actions using the service-role client.
- Tampered or expired cookies silently start a new cart.

## Razorpay

- Two separate secrets: `RAZORPAY_KEY_SECRET` (API signing) and `RAZORPAY_WEBHOOK_SECRET` (webhook verification).
- `RAZORPAY_ENV=test|live` selects the environment; the server rejects a `rzp_test_*` key when `RAZORPAY_ENV=live` and vice versa.
- Orders are marked paid only after a webhook with a valid `X-Razorpay-Signature`, verified by HMAC-SHA256 of the raw request body.
- Duplicate events rejected via `razorpay_events.event_id` primary key.

## Cart Security Model

- Guest cart is identified by a 32-byte random token stored in an HttpOnly cookie (`cart_session`).
- The cookie is HMAC-SHA256-signed with `CART_COOKIE_SECRET`.
- The database stores only the SHA-256 hash of the token (`carts.session_hash`).
- No RLS access for `anon` or `authenticated` on `carts` or `cart_items`.
- All cart reads and writes go through server actions that:
  1. Read and verify the cookie.
  2. Hash the token and look up the cart by hash.
  3. Use the privileged client (`SUPABASE_SERVICE_ROLE_KEY`).
- Tampered, expired, or absent cookies silently start a new empty cart.
- **Carts are browser-scoped.** This is documented and shown in the UI.
- Carts do not survive a browser's cookie clear or a switch to another device.

## Razorpay

- Two separate secrets:
  - `RAZORPAY_KEY_SECRET` — used for Razorpay API requests (order creation).
  - `RAZORPAY_WEBHOOK_SECRET` — used for HMAC verification of incoming webhooks.
- `RAZORPAY_ENV=test|live` selects the environment; the server refuses to mix test/live keys.
- Orders are marked `paid` only from a verified webhook, never from the browser's success callback.
- Duplicate webhook events are rejected by `razorpay_events.event_id` primary key.

## Order Access

- Each order has a random `access_token_hash`.
- The raw token is returned to the buyer once, at order confirmation, and appears in the URL `/order/[token]`.
- Access via `order_number` + email is **not** implemented.
- Access via the order's UUID alone is **not** implemented.
- Owner access is via RLS using `public.is_owner()`.
- The order page is `no-store`; no caching.

## Cart Cookie

- Format: `v1.<token>.<expiryUnix>.<hmac>`.
- HMAC-SHA256 signed with `CART_COOKIE_SECRET`.
- Server-side expiry check on every read; cookie Max-Age is a browser hint only.
- `getCart` never writes the cookie. Mutations renew it.
- Expired, malformed, or tampered cookies are treated as absent. Cart is empty.
- Checkout (2C) must refuse a fixture line regardless of any dev-only flag.

## Cookie Renewal Rules

- `getCart`: never writes the cookie.
- `addToCart`: writes on success (create or renew).
- `updateQuantity`: writes on success (renew).
- `removeFromCart`: does **not** write.
- `clearCart`: does **not** write.
- The cookie expires 30 days after its last write, wherever it was last written.

## Enquiries

- Public submissions arrive through `createEnquiry` server action only.
- The insert uses the privileged Supabase client; RLS on `enquiries` denies all
  access from `anon` and grants only `select` + `update` to `authenticated` for
  the owner.
- Reference numbers are `ENQ-YYYYMMDD-XXXX`.
- Attachments are not implemented.
- Email notifications are **not** implemented. The owner inbox at
  `/admin/enquiries` is the working channel.
- Rate limiting is not implemented. Defenses are a honeypot field, a time gate
  (reject submissions under 2 seconds), server-side length limits, and a
  client-generated idempotency key. A production rate limiter is deferred.