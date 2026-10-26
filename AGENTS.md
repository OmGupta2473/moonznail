# MoonzNails — Persistent Coding-Agent Instructions

Read this file in full before any task.

## Reading order

1. This file.
2. Any existing repository instructions.
3. `docs/PROJECT.md`, `docs/DESIGN.md`, `docs/ROADMAP.md`, `docs/INTEGRATIONS.md`.
4. The task brief you were given.

If any project document is missing, state which, and continue unless the task brief is missing or contradicts this file — in which case stop and report the conflict.

## Authority and boundaries

- The task brief is the only specification for what to build. Do not infer features from the product blueprint.
- Do not refactor, rename, reformat, or "improve" files outside the change boundaries named in the brief.
- Do not add, remove, or upgrade packages unless the brief explicitly authorizes it.
- Do not delete files, reset Git, force-push, rewrite history, or run destructive database operations. Do not commit unless explicitly told to.
- Preserve existing user changes. If the working tree is dirty in files you must touch, stop and report.
- Reuse existing components, tokens, and patterns. If the brief and codebase conflict, stop and report.

## Path convention

This project uses the `src/` directory. Application code lives in `src/app/`, `src/components/`, `src/lib/`. Do not create parallel `app/`, `components/`, or `lib/` folders at the repository root.

## Architecture

- Supabase is the confirmed backend: database, auth, storage, RLS. Do not reopen this choice without a named technical blocker and explicit human approval.
- Frontend: Next.js App Router, TypeScript (strict), Tailwind CSS v4.
- The database is the source of truth for products, prices, inventory, orders, payments, shipments.
- Never hard-code prices, stock, order states, or success responses. Never compute price in the client.
- An order is paid only from verified server-to-server provider confirmation. The browser never marks an order paid.
- Webhook handlers verify signatures and are idempotent.

## Credentials

- Environment variable names are recorded in `docs/INTEGRATIONS.md`. Values are never printed, pasted, or committed.
- Supabase anon/publishable key: browser-safe.
- Supabase service role key: server-only. Never in a Client Component, never in `NEXT_PUBLIC_*`, never in logs or reports.
- If you encounter a committed secret, report the file path and variable name only.

## Honesty and failure behaviour

- Never replace a blocked integration with a fake success or a mock that looks like real data. Implement the failure state and report the blocker.
- No dead buttons, placeholder purchase flows, fabricated reviews, invented counts, fake urgency, or unsupported trust claims.
- Do not claim a test passed unless it actually ran and you saw the result. Report checks you could not perform.
- Development fixtures must be clearly labelled and never shipped to a public page as real data.

## Quality baseline

- Loading, empty, error, disabled, and focus states implemented wherever reachable.
- Keyboard operable, visible focus, one H1 per page, meaningful alt text.
- Responsive from 360px, no horizontal scroll, touch targets at least 44px.
- Respect `prefers-reduced-motion`; animate only `transform` and `opacity`.
- No new console errors or warnings.

## Inspection tasks

If the brief says inspection only:

- Read files. Do not write, edit, delete, rename, or format.
- Do not install packages.
- Do not run a script whose definition you have not read first. If it may write, auto-fix, update snapshots, generate code, run migrations, contact a network service, or require credentials, do not run it. Report it as "not run — requires separate authorized verification."
- Record Git state at start and end.
- Uncommitted changes do not prevent reading. Stop only before an action that could overwrite or interfere with them.

## Stop conditions

Stop and report — do not improvise — if:

- a required credential or environment variable is missing;
- an external API returns an authorization error twice;
- an acceptance criterion fails after two fix attempts;
- the change requires a package or file outside the brief;
- the repository state conflicts with the brief;
- the task would require inventing a business rule or a business decision that is not in `docs/PROJECT.md` and marked as confirmed.

A skipped script, undefined command, non-Git folder, or missing future document is **not** a stop condition. Report it and continue.

## Completion report

Return: summary; files changed with paths; every command run and its actual result; tests added/updated and whether they ran; each acceptance criterion marked passed / failed / not verified; remaining issues and blockers; screenshots where the environment supports them; any business decision still needed; and a suggested commit message.

## After the report

Stop. Do not begin any follow-on task. Wait for the next approved brief.