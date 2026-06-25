# Technical Spec — KidSmart AI Training

Tier B (KV-only). Composes two validated sibling patterns: the Philosophy
capability-code engine (identity + monotone progress sync + sequential unlock +
PWA) and the FIFA2026 compute-on-read leaderboard.

## Identity — capability code + nickname (Harness §18)
- A player is a **capability code** `XXX-XXX` (31-char unambiguous alphabet, ~29.7 bits)
  or a kid-chosen custom code. The code lives in the URL (`/p/<code>`) and **is** the
  credential — no login. Generated/validated in `src/lib/progress/code.ts`.
- No-leak hygiene: `noindex` on `/p/*`, `/room/*`, `/join/*`; `Referrer-Policy:
  strict-origin-when-cross-origin` at the edge (strips the code from outbound Referers);
  `frame-ancestors 'none'`. Code creation is rate-limited (fail-closed, §6.4).

## §PII — the nickname trade-off (recorded deviation)
The strict §18 model stores **no PII**. KidSmart needs a **named leaderboard**, so it
stores a self-chosen **nickname** per code in `profile:<code>`. This is a deliberate,
bounded deviation:
- The nickname is a **display handle**, not real identity. We collect **nothing else** —
  no email, age, real name, or device id.
- **Mitigations:** server-side nickname validation + profanity filter; an explicit
  "don't use your real full name" hint at join; `noindex` on every code/room/join route;
  no nickname ever sent to GA/analytics.
- **Residual risk (accepted):** a shared invite link lets anyone join a room and see
  members' nicknames + XP. For a kids' learning game with no other PII this is low-stakes;
  upgrade to real auth only if the product later handles anything materially harmful.

## Data model (KV — server-only, `src/lib/server/kv.ts`)
| Key | Shape | Merge |
|---|---|---|
| `progress:<code>` | `SyncedState { done[], quiz{}, days[] }` | monotone (`mergeSynced`) on save |
| `profile:<code>` | `{ nick, roomId, avatar, joinedAt }` | last-write (set once at join) |
| `room:<roomId>` | `{ name, hostCode, createdAt }` | set once at create |
| `room:<roomId>:members` | Set of codes | additive |
| `rankHistory:<roomId>` | `{ [date]: { code: rank } }` | journaled (optional ↑/↓ arrows, §3.5) |

XP and ranking are **derived on read** (`src/lib/scoring/xp.ts`), never persisted — they
can't drift (§3.5).

## Progress sync (two-layer, offline-first)
- `localStorage` is the working store (`LocalState` = `SyncedState` + local-only fields).
- On load: `GET /api/progress/load?code=` → union-merge into local.
- On change: write local instantly + debounced `POST /api/progress/save` → server
  monotone-merges with the stored row (`saveProgress`) and returns the merged result.
- Because state only grows/improves, merges are conflict-free across any number of devices.

## Scoring (XP composite)
Per cleared hurdle: `100 + 20×correct + (firstTry ? 50 : 0)`. Plus `10 × longestStreak(days)`.
Leaderboard sort: **XP desc**, tiebreak **fewer total attempts**, then **faster total time**.
The gate-quiz `QuizStat` is best-of merged (max correct, min attempts, sticky first-try,
min time) so replaying can only improve a record, never worsen it.

## Rooms-only leaderboard
Every leaderboard is scoped to a room (no global board, per product decision). To render:
read `room:<id>:members` → `mget` each member's `progress:<code>` + `profile:<code>` →
`scorePlayer` each → sort. Rank-movement arrows (optional) come from the journaled
`rankHistory:<roomId>` snapshot written by a guarded flow (§3.5 sanctioned exception).

## Facilitator mode
`?mode=facilitator` reveals facilitator-tagged content blocks **only after** a shared
passcode (`FACILITATOR_PASSCODE`) is entered (kept in a cookie/session). Content blocks
carry `audience: "all" | "facilitator"`; a drift-defence test pins that student render
paths never include facilitator-tagged content.

## Backups (not trimmed — §2.3 Tier-B caveat)
Room rosters + nicknames live only in KV and are irreplaceable, so we ship a token-gated
`GET /api/export` (full JSON snapshot) and a daily cron that commits the snapshot off-store.

## Security baseline
HTTPS-only links in content (`links:check`); CSP locked to self + youtube-nocookie +
(when enabled) GA hubs; `'unsafe-eval'` dev-only; all `/api/*` Zod-validated and
rate-limited fail-closed; no secrets/PII logged.
