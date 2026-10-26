# MoonzNails — Progress

Last updated: 2026-10-26

## MN-BATCH-03 — Cart UI (Sub-step 2B)

| Item | Status | Notes |
|------|--------|-------|
| Cart foundation (cookie, RPC, session isolation) | Implemented | Verified in prior batch; not re-implemented here. |
| `src/components/cart/cart-icon.tsx` | Implemented | Server component; renders cart count badge. |
| `src/components/cart/cart-line.tsx` | Implemented | Client component; stepper + remove via Server Action forms. |
| `src/components/cart/cart-subtotal.tsx` | Implemented | Server component; honest copy about tax/shipping. |
| `src/components/cart/cart-drawer.tsx` | Implemented | Client component; open/close, scroll lock, inert coordination, focus restore. |
| `src/components/cart/add-to-cart-button.tsx` | Implemented | Client component; add-to-cart form + drawer open on success. |
| `src/app/(storefront)/cart/page.tsx` | Implemented | Full cart page; replaces placeholder. |
| `src/app/(storefront)/cart/loading.tsx` | Implemented | Skeleton loading state. |
| `src/app/(storefront)/cart/empty.tsx` | Implemented | Empty cart component. |
| `src/app/(storefront)/checkout/page.tsx` | Implemented | Placeholder only; no checkout logic. |
| `src/app/(storefront)/products/[handle]/page.tsx` | Implemented | Add-to-cart button below price; placeholder for fixtures/unpriced. |
| `src/app/(storefront)/layout.tsx` | Implemented | Wraps storefront in CartDrawer, fetches initialCart server-side. |
| `src/components/site-header.tsx` | Implemented | Cart link replaced with CartIcon. |
| `src/app/globals.css` | Implemented | Added slide-in/fade keyframes + reduced-motion overrides. |
| Deleted `src/app/dev-cart/` | Implemented | Removed. |
| Deleted `src/app/actions/cart-dev.ts` | Implemented | Removed. |
| Removed `CART_ALLOW_FIXTURES` from `.env.example` | Implemented | |
| Removed fixture/test-harness sections from `docs/INTEGRATIONS.md` | Implemented | |
| Lint | Automated checks passed | 0 errors (2 pre-existing warnings in admin pages only). |
| Typecheck | Automated checks passed | `tsc --noEmit` clean. |
| Build | Automated checks passed | `next build` succeeds; `/cart` and `/checkout` present; `/dev-cart` gone; no `/api/_cart-debug`. |
| Browser verification | Not run | Not run in this environment (no browser); no remote SQL, no deployment. |

## Gates

- Owner-repair gate: cart UI is independent of admin/database behaviour; no admin changes required for this sub-step. Cart actions already verified.
- No remote SQL, no new packages, no commits, no deployment, no live payments.
