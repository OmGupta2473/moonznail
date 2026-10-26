# MoonzNails — Project Source of Truth

Last updated: 2026-10-25

This is the product and scope reference. Read it before every task.
For the design system, see `docs/DESIGN.md`. For the task map, see `docs/ROADMAP.md`. For integrations and credentials, see `docs/INTEGRATIONS.md`.

## What MoonzNails is

A boutique storefront and portfolio for an independent nail artist. Nail-art looks are the shared object that connects portfolio, product, and service. One brand, one navigation, one cart, one account, one owner workflow.

## Audiences

| Audience | Core need | Must be able to |
|---|---|---|
| Nail-art fans from social | See the work, get the look | Open a look, act on it |
| Press-on buyers | Right fit, right shape, clear instructions | Choose with confidence, check out |
| Local service clients (if applicable) | Trust, price clarity, availability | Read the menu, send an enquiry |
| Gift buyers | Simple choices, reliable delivery | Choose, pay, know when |
| Owner | Low daily effort | Run the business without a developer |

## The three most important customer actions

1. Add a set to the cart and check out with confidence in fit.
2. Send a service or custom enquiry.
3. Open a look and move to the related product or service.

## Confirmed decisions

| # | Decision | Notes |
|---|---|---|
| D1 | Supabase is the backend platform (database, auth, storage, RLS) | Approved by owner. Not to be reopened without a named technical blocker and explicit approval. |
| D2 | Next.js App Router + TypeScript (strict) + Tailwind CSS v4 | Approved for the foundation; the actual app uses these. |
| D3 | Owner Login: Magic Link (passwordless email) | Confirmed by owner. |

## Proposed defaults — not yet approved

- Headless custom frontend over Supabase (vs. a framework-managed admin).
- Lunar Blush visual direction (see `docs/DESIGN.md`).
- Guest checkout with optional accounts.
- Enquiry-first services (no live booking).
- Owner admin covering catalogue, orders, services, looks, enquiries (minimum surface to be specified).
- Payment gateway: not selected. Do not assume Stripe, Razorpay, or any other provider.
- Transactional email provider: not selected.
- Country, currency, shipping regions: open.

## Explicitly out of scope for launch

Marketplace, subscriptions, loyalty, reviews before real customers exist, live chat, AR/3D try-on, WebGL scenes, multi-language, multi-currency (unless region demands it), native apps, two-way calendar sync, gift cards, blog, user-generated content, live booking.

## Honesty rules

No fabricated reviews, customer counts, award claims, urgency, or trust badges. Scarcity labels only from live inventory. Placeholder content must be visibly labelled as development content. An order is never marked paid from the browser.