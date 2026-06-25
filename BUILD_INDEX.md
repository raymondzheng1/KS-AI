# BUILD_INDEX — read order

1. **[CLAUDE.md](./CLAUDE.md)** — operating manual, stack, invariants, deviations, env vars.
2. **[docs/TECHNICAL_SPEC.md](./docs/TECHNICAL_SPEC.md)** — architecture: identity, rooms, leaderboard, the nickname-PII trade-off.
3. **Plan of record** — `C:\Users\Ivy\.claude\plans\robust-baking-marshmallow.md` (phases, data model, verification).
4. **harness.md** — `..\harness.md` (cross-project guardrails; this project is **Tier B**).

## Where things live
```
src/
  app/                      # routes (App Router)
    page.tsx                # landing
    start/                  # create-or-join entry (Phase 3)
    p/[code]/               # the player's game (Phase 2/3)
    room/[id]/              # room leaderboard + host dashboard (Phase 3)
    join/[id]/              # invite landing → nickname → code (Phase 3)
    overview / tools / mindmap / appendix / contact   # public content + contact
    api/                    # route handlers (Zod + rate-limited + fail-closed)
    manifest.ts robots.ts sitemap.ts                  # SEO + PWA conventions
  lib/
    progress/   code.ts schema.ts merge.ts            # identity + monotone state
    scoring/    xp.ts                                  # XP derivation (SoT)
    server/     kv.ts ratelimit.ts progress.ts email.ts request.ts
    content/    (Phase 1) hurdles/tools/glossary/templates — committed, Zod-validated
    seo/        site.ts
  components/   GoogleAnalytics, ContactForm, SectionShell, game/, room/
  tests/        progress/, scoring/  (regression corpus; grows with every fix)
scripts/        gen-icons.ts · links-check.mjs · content-check.mjs · launch-check.mjs
reference/      the two Word docs + original diagrams (content source of truth)
public/         diagrams/ + kidsmart_logo.png + generated icons
```

## Build phases (status tracked in the session task list)
- **Phase 0** — scaffold + harness baseline (this commit): infra ports, verify gate, PWA/SEO/contact.
- **Phase 1** — content pipeline: Zod schema + extract docx → committed hurdle/tool/glossary data.
- **Phase 2** — core game: 10-hurdle map, hurdle pages, gate quizzes, unlock, sync, install.
- **Phase 3** — rooms + identity + leaderboard + invite (link/QR) + export/backup.
- **Phase 4** — facilitator mode (passcode) + content sections + mobile polish + tests.
