# MoonzNails — Design System Reference

Last updated: 2026-10-25

This is the compact reference. The full design rationale lives in the product blueprint. **Tokens live in `src/app/globals.css`.** Component primitives live in `src/components/ui/`. The visual reference is `/styleguide` and `/design-preview`.

## Direction: Lunar Blush

Warm-white canvas, one deep-rose action colour, photography-led 4:5 layouts, restrained serif (Fraunces) plus clean sans (DM Sans), a crescent used sparingly, and a moon-phase order tracker in the eventual order view. No heavy 3D or decorative animation.

## Colour tokens (all in `src/app/globals.css`)

Use the CSS variable, not the hex, in components.

| Token | Hex | Role |
|---|---|---|
| `--color-mn-canvas` | #FFF9F6 | Page background |
| `--color-mn-blush` | #FBEDEA | Alternate sections, selected chips, badges |
| `--color-mn-petal` | #F3C7CE | Decorative fills, placeholders |
| `--color-mn-rose` | #D9728F | Decoration only. **Never text.** |
| `--color-mn-rose-deep` | #B23A5C | Primary buttons, key links |
| `--color-mn-rose-ink` | #8F2744 | Hover, focus accents, link text on canvas |
| `--color-mn-ink` | #2B1F24 | Primary text |
| `--color-mn-ink-soft` | #6E5A60 | Secondary text |
| `--color-mn-border` | #EAD7D5 | Decorative hairlines |
| `--color-mn-border-strong` | #8C7077 | Control borders |
| `--color-mn-night` | #2A1A24 | Footer |
| `--color-mn-moon` | #C8A96A | Crescent, hairline. **Never text.** |
| `--color-mn-success` / `--color-mn-error` | #2E7D5B / #B3261E | Status text and icons, always with words |
| `--color-mn-warn-bg` / `--color-mn-warn-ink` | #FFF3D6 / #7A5200 | Warning surface and text |

## Typography

- Display: **Fraunces** (`font-display`), self-hosted via `next/font/google` in `src/app/layout.tsx`.
- Body and UI: **DM Sans** (`font-sans`), same source.

| Style | Mobile | Desktop |
|---|---|---|
| Display | 40/48 | 72/76 |
| H1 | 32/38 | 52/56 |
| H2 | 26/32 | 38/44 |
| H3 | 20/28 | 26/34 |
| Body large | 18/28 | 18/28 |
| Body | 16/26 | 16/26 |
| Small | 14/20 | 14/20 |
| Caption | 12/16 | 12/16 |

## Layout

- Container: `max-w-7xl`, `px-5 sm:px-8 lg:px-12`.
- Section padding: `py-12 lg:py-24`.
- Breakpoints: design at 360; 480, 768, 1024, 1280, 1536.
- Grid: 4 columns at 360; 8 at 768; 12 at 1024+. Gutters 16 / 24 / 32.

## Surfaces

- Radii: inputs `0.75rem`, cards `1.25rem`, media `1.5rem`, buttons/chips pill.
- Borders: 1px `--color-mn-border` for decoration; `--color-mn-border-strong` for controls.
- Shadows: `--shadow-1` (rest), `--shadow-2` (hover, drawers), `--shadow-3` (modals). No glass effects.

## Component primitives (paths)

- `src/components/ui/button-link.tsx` — primary, secondary, ghost variants, renders `<a>`.
- `src/components/ui/input.tsx` — labelled, hint, error, disabled.
- `src/components/ui/chip.tsx` — default, selected (check icon + 2px rose-deep), unavailable (strikethrough).
- `src/components/ui/badge.tsx` — one per card maximum.
- `src/components/ui/skeleton.tsx` — `motion-reduce:animate-none`.
- `src/components/ui/placeholder-media.tsx` — honest development label.
- `src/components/ui/product-card.tsx` — 4:5 media, name/meta/price, whole-card link.
- `src/components/ui/container.tsx`.
- `src/lib/cn.ts`.

## Rules

- One H1 per page. Skip link first in tab order. One crescent per screen maximum.
- Focus ring: 2px `--color-mn-rose-ink` with 2px canvas offset on every interactive element.
- Touch target minimum 44px. Primary buttons 48px.
- `--color-mn-rose` and `--color-mn-moon` are decoration only; never text.
- Status must not rely on colour alone — always add an icon and a word.
- Motion: only `transform` and `opacity`. Respect `prefers-reduced-motion`. No animation or 3D libraries.
- Buttons that only navigate use `ButtonLink`, not `<button>`.

## Motion rules (clarified in MN-002B)

- Entrance effects use `transform` and `opacity`.
- Short colour transitions are permitted for interactive feedback (hover, focus, active states).
- Reduced-motion preferences must be respected via `motion-safe:` and `motion-reduce:` prefixes.
- **Reduced-motion behaviour is implemented in CSS; not verified in a browser.**

## Task status

- MN-002B: implemented — review pending
- MN-002C: implemented — review pending

## What this document is not

It is not the full blueprint. It is the reference a coding agent reads before each task. If a specification is missing from this file and required by a task, the task brief must supply it, not the agent's opinion.