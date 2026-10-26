# MoonzNails — Task Roadmap

Last updated: 2026-10-25

Each row is a brief or a small cluster. A task advances only after its review gate passes.

| ID | Outcome | Prerequisites | Review gate | Status |
|---|---|---|---|---|
| MN-000 | Repository reconnaissance | none | Reviewed | 🟡 implemented — review pending |
| MN-001 | Next.js foundation, Lunar Blush tokens, representative preview | MN-000 | Reviewed; visual approval pending | 🟡 implemented — review pending |
| MN-002 | Repository audit, source-of-truth documents, persistent instructions | MN-001 | Reviewed | 🟡 implemented — review pending |
| MN-002B | Hero layout, mobile menu with inert isolation, motion rules | MN-002 | Reviewed | 🟡 implemented — review pending |
| MN-002C | Corrections: portal dialog, focus restore, inert state, gradient overlay | MN-002B | Reviewed | 🟡 implemented — review pending |
| MN-003 | Supabase project setup and server/client boundary | MN-002C; visual approval; Supabase project created by owner | Reviewed | ⬜ not started |
| MN-004 | Database schema: products, variants, inventory, collections, looks, services | MN-003 | Reviewed | ⬜ not started |
| MN-005 | Public catalogue: `/shop`, product detail, `getProducts` from Supabase | MN-004 | Reviewed | ⬜ not started |
| MN-006 | Cart behaviour and server-side price validation | MN-005 | Reviewed | ⬜ not started |
| MN-007 | Checkout, payment gateway, verified payment status, order creation | MN-006; payment provider selected | Reviewed | ⬜ not started |
| MN-008 | Order tracking (guest link + optional account) | MN-007 | Reviewed | ⬜ not started |
| MN-009 | Looks pages and cross-linking to products/services | MN-005 | Reviewed | ⬜ not started |
| MN-010 | Services pages and enquiry flow with uploads | MN-004; storage buckets | Reviewed | ⬜ not started |
| MN-011 | Owner admin: catalogue, orders, enquiries, content | MN-004, MN-007, MN-010 | Reviewed | ⬜ not started |
| MN-012 | Home, About, FAQ, Sizing, Care, policies | MN-005, MN-009, MN-010 | Reviewed | ⬜ not started |
| MN-013 | Hardening: a11y audit, performance, SEO, backups | MN-007–MN-012 | Reviewed | ⬜ not started |
| MN-014 | Soft launch with real low-value order + refund | MN-013; launch checklist | Reviewed | ⬜ not started |

Android and iOS are **not** on this list. They follow after MN-014 and only if the native-value criteria in the blueprint hold.

Status keys: ⬜ not started · 🟡 implemented — review pending · 🟢 approved · 🚫 blocked

## Batch MN-BATCH-01

| WP | Outcome | Status |
|---|---|---|
| WP0 | Foundation stabilisation | 🟡 implemented — review pending |
| WP1 | Supabase connection, with no database writes | ⬜ not started |
| WP2 | Catalogue schema as local migration files | ⬜ not started |
| WP3 | Data access layer | ⬜ not started |
| WP4 | Public browsing surfaces | ⬜ not started |
| WP5 | States, accessibility, and visual pass | ⬜ not started |
| WP6 | Verification, documentation, and handoff | ⬜ not started |