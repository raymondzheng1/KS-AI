# CLAUDE.md — KidSmart AI Training

> Start at **[BUILD_INDEX.md](./BUILD_INDEX.md)**, then read this end-to-end.

Agent operating manual for *this* project. Adopts the cross-project harness at
`C:\Users\Ivy\RayTasks\Projects\harness.md` and records deliberate deviations.

## Project one-liner
A gamified web app delivering a 2-week, 10-day AI training programme for ~12-year-olds.
The 10 days are **10 sequential hurdles** — clear a hurdle's gate quiz to unlock the next.
Players join a **room** via an invite link/QR, pick a **nickname**, and compete on that
room's **XP leaderboard**. No login; identity is a capability code in the URL (`/p/<code>`).

## Stack tier
**Tier B — KV-only** (no Supabase, no Stripe). Upstash Redis for shared state;
localStorage as the offline-first working store; capability codes for identity.

## Stack
| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript strict |
| Styling | Tailwind v4 (tokens via `@theme` in `globals.css`); KidSmart palette |
| Fonts | Nunito (display) + Inter (body) via `next/font/google` |
| Data | Upstash Redis (free, Vercel Marketplace) — generic `KvLike` in `src/lib/server/kv.ts` |
| Validation | Zod at every IO boundary (`src/lib/schemas.ts`) |
| Analytics | Vercel Analytics (always) + GA4 (dormant until `NEXT_PUBLIC_GA_ID` set, never on `/p/*`) |
| Email | Resend (contact form only) |
| Test | Vitest |
| Hosting | Vercel |

## Commands
```bash
npm run dev         # next dev (:3000)
npm run build       # next build
npm run icons       # regenerate favicon/app-icon/PWA icons from public/kidsmart_logo.png
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest run
npm run verify      # content:check + links:check + launch:check + typecheck + lint + test
```
Run `npm run verify` green before every push. **Run `npm run icons` after changing the logo.**

## Game model (key invariants)
- **Hurdle ids** are `d1`..`d10`. Sequential unlock: hurdle N is available only once N−1 is `done`.
- **SyncedState** (`src/lib/progress/schema.ts`) = `{ done[], quiz{}, days[] }` — every field
  monotone (grows / improves only) so the cross-device merge is conflict-free
  (`src/lib/progress/merge.ts`). **XP is derived, never stored** (`src/lib/scoring/xp.ts`).
- **Local-only fields never sync:** `code`, `nick`, `roomId`, `seen`, `reflections`
  (private free-text — kids' writing stays on-device, mirrors Philosophy's `think`).
- **Leaderboard is rooms-only** — computed on read over a room's members. No global board.

## Do
- Add a Vitest **regression test for every bug fix** — the corpus only grows.
- Keep changes **additive + atomic**. Run `verify` before every push.
- Curated, vetted YouTube IDs only; embed via `youtube-nocookie.com`, click-to-load, no autoplay.
- Validate + moderate nicknames (length, charset, profanity); hint "don't use your real full name".

## Don't
- **No login, no auth.** The only quasi-PII collected is a self-chosen **nickname** (see
  TECHNICAL_SPEC trade-off). No emails, ages, or real names anywhere.
- **Don't sync `reflections`** to the server. **Don't put GA on `/p/*`, `/room/*`, `/join/*`.**
- Don't auto-fetch/live-search YouTube. Don't commit `.env*` or secrets. Don't log PII.
- Don't `git push --force` main; don't skip hooks.

## Deliberate harness deviations (recorded)
| Deviation | Reason |
|---|---|
| **Upstash KV** instead of Supabase | Progress is a tiny grow-only blob; rooms/profiles are small JSON. No relations. |
| **Capability code + nickname** instead of auth | "Any kid, anywhere, no login." Nickname is a display handle, not identity (see TECHNICAL_SPEC §PII). |
| **Nickname stored in KV** (a small deviation from §18 "no-PII codes") | Required for a named leaderboard. Mitigated by validation/moderation, `noindex`, and collecting nothing else. |
| **Backups kept (not trimmed)** | Room rosters + nicknames are user-authored data living only in KV → irreplaceable (§2.3 Tier-B caveat). Ship `/api/export` + a daily off-store snapshot. |
| **No Stripe / AI pipeline / recovery crons** | Free product, no money paths, no AI generation. |

## Env vars
See [.env.example](./.env.example). Required in prod: `KV_REST_API_URL` + `KV_REST_API_TOKEN`.
Others (`FACILITATOR_PASSCODE`, `CRON_SECRET`, `EXPORT_TOKEN`, `RESEND_API_KEY`,
`NEXT_PUBLIC_GA_ID`) are optional/feature-gated. Local dev runs with none (in-memory KV).

## Launch gates (full Appendix-A set for Tier B — asserted by `launch:check`)
PWA manifest + icon set · Vercel Analytics + GA4 loader · sitemap + robots + per-route metadata ·
`/contact` page + route · security headers (Referrer-Policy + frame-ancestors) ·
dual KV env-name read · `noindex` on all code-bearing routes.

## Important pointers
- Architecture: [docs/TECHNICAL_SPEC.md](./docs/TECHNICAL_SPEC.md)
- Plan of record: `C:\Users\Ivy\.claude\plans\robust-baking-marshmallow.md`
- Reference siblings: `..\Philosophy` (engine) · `..\FIFA2026` (leaderboard)
- Source content: [reference/](./reference/) (the two Word docs + diagrams)
