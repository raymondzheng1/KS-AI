# KidSmart AI Training — Design Uplift Brief

**For:** a design agent (Claude design) tasked with elevating the visual design of an
existing, fully-functional web app.
**From:** product owner.
**One rule above all others:** **the logo is the brand.** Every colour, shape, icon,
illustration, and motion in this product must look like it was born from the KidSmart
logo. Today the app *uses the logo's colours* but not its *visual language*. Close that gap.

---

## 1. What we're uplifting (and what NOT to touch)

**Uplift = visual/brand only.** This is a polished restyle of a working product, not a
rebuild. The information architecture, copy, content, game logic, routes, and data are
done and tested — **do not change behaviour, content, or structure.** Re-skin the surface.

- ✅ In scope: colour system, typography, shape language, the mascot, illustration &
  icon style, depth/shadows, spacing rhythm, motion/celebration, component styling,
  empty/loading states, screen-level polish, a clean vectorised logo + derived icon set.
- ❌ Out of scope: changing what content appears, the 10-hurdle flow, the slide order,
  scoring, leaderboard rules, routing, or any backend. Don't remove features.

**The product in one line:** a gamified, mobile-first PWA that teaches ~12-year-olds AI
over **10 sequential "hurdles"** (each a paced, slide-by-slide mini-lesson ending in a
gate quiz), with a per-room **XP leaderboard**, **nicknames**, and **invite link/QR**. Used
by kids on phones, often in a classroom, sometimes with a facilitator.

---

## 2. The brand anchor — read the logo, then derive everything from it

Look at `public/kidsmart_logo.png`. Decode its DNA and propagate it:

| Logo element | What it signals | How it must show up across the UI |
|---|---|---|
| **Soft, hand-drawn yellow "star" character** with a smiling face + rosy cheeks | the friendly hero | A **recurring mascot** ("Sunny") that guides, reacts, and celebrates throughout the app — not just a header logo. |
| **Organic, pillowy blob shapes** (rounded, slightly wobbly, imperfect outlines) | warmth, play, childlike | The **shape language for the whole UI**: soft super-elliptical cards, blobby buttons, organic section dividers — never sharp rectangles or hard geometry. |
| **Graduation cap** | learning / mastery | Motif for progress, "cleared" states, graduation/Demo Day, level-ups. |
| **Green sprout** | growth | Motif for progress/streaks ("you're growing"), the streak counter, XP growth. |
| **Paintbrush** | creativity | Motif for the creative/build hurdles and activities. |
| **Blue knowledge-orbit ring** | curiosity, science, momentum | A signature **swoosh/orbit** used as a connective element — the hurdle path, dividers, loading spinners, progress arcs. |
| **Soccer ball** | play / friendly competition | Motif for the leaderboard, rooms, "play with friends," competition. |
| **Scattered yellow/blue dots & shine marks** | sparkle, energy | **Doodle accents** sprinkled tastefully on heroes, celebrations, empty states. |
| **Rainbow hand-lettered "KIDSMART" wordmark** (each letter a brand colour, soft rounded) | playful, multi-colour, friendly | The **display-type personality**: rounded, chunky, warm headings; the rainbow can theme the 10 hurdles. |

> **Deliverable A: a clean, vector version of the logo** (the current app rasterises the
> PNG). From that single vector master, derive the favicon/app-icon/PWA set and the mascot
> poses. The wordmark should also be available as a clean asset.

**Pitfall to avoid:** the current UI reads as "generic bright flat kids' app." The logo is
softer, more pastel, hand-drawn, and characterful than that. Pull the whole product
*toward the logo* — organic and warm — not toward flat-geometric.

---

## 3. Design principles

1. **Born from the logo.** If an element couldn't sit next to the logo and look related, redo it.
2. **One cohesive system.** Every button, card, chip, and icon comes from a small set of
   shared primitives. No one-off styling. Consistency is the whole point of this brief.
3. **Soft, organic, hand-made.** Rounded super-ellipses, gentle imperfection, friendly weight. No hard corners or clinical geometry.
4. **Delight with purpose (kids 12).** Playful, encouraging, a little magic — but it must
   never fight the task or slow the lesson. Celebrate wins; keep reading-mode calm.
5. **Mobile-first & accessible by default.** Designed for a phone in a kid's hand; legible,
   tappable, and inclusive before it's pretty.
6. **Mascot as guide, not decoration.** Sunny has a job: welcome, encourage, react, celebrate, console a wrong answer, cheer a streak.

---

## 4. Visual language spec

### 4.1 Colour
Keep the existing brand palette (already wired as Tailwind v4 `@theme` tokens in
`src/app/globals.css`) — refine tints/shades, don't reinvent:

| Token | Hex | Role |
|---|---|---|
| `ks-yellow` | `#FFD135` | hero / mascot / primary energy |
| `ks-blue` | `#4B9FD4` | headings, nav, the orbit/knowledge accent |
| `ks-dark` | `#2E6FA3` | ink for headings, borders, emphasis |
| `ks-green` | `#6DBE47` | success, growth, facilitator |
| `ks-orange` | `#F5A623` | highlights |
| `ks-coral` | `#E85C3A` | alerts, key points, primary CTA |
| `ks-bg` | `#F4F9FF` | page background |
| `ks-cream` | `#FFF8E8` | card/box surfaces |
| `ks-ink` | `#444444` | body text |

Add what's missing: a **soft tint ramp** per hue (for backgrounds/fills), a **lavender/
periwinkle** (it's in the logo cap & orbit but not yet a token), and confirmed
**WCAG-AA** text/background pairings. The **10 hurdles each carry an accent** (already in
the data as `accent`) — design the rainbow assignment so the journey reads as a spectrum.

### 4.2 Typography
- **Display/headings:** a rounded, warm, friendly face echoing the wordmark (currently
  **Nunito** — keep or propose a rounder alternative like Baloo 2 / Fredoka; must remain a
  Google/`next/font`-loadable webfont). Big, chunky, confident.
- **Body:** a clean, highly-legible sans (currently **Inter**) — keep.
- Define a **4-step type scale** (page title / section / body / caption) and stick to it.
  **Caption floor 12px.** Keep distinct sizes per screen ≤ 5.

### 4.3 Shape, depth & texture
- **Corner language:** soft super-ellipses / "squircles"; large radii on cards and buttons;
  blobby pill buttons. Refine the existing `--radius-card` / `--radius-pill`.
- **Depth:** the current `--shadow-card` uses a chunky 6px offset. Evolve toward the logo's
  softer feel — gentle, warm, diffuse shadows (optionally a faint coloured shadow from the
  element's accent). Keep it tactile but not heavy/blocky.
- **Texture:** subtle hand-drawn accents — a sketchy underline, doodle dots, the orbit
  swoosh — used sparingly so they feel special. Optional very-subtle paper/grain on big
  surfaces; never noisy.

### 4.4 The mascot system ("Sunny")
Design **Sunny** (the logo star) as a reusable character with a small set of **poses/
expressions** the app already has natural moments for:
- **Welcome/idle** (landing, onboarding) · **Pointing/guiding** (lesson intros, "your
  turn") · **Thinking** (quiz) · **Cheering** (correct answer, hurdle cleared) ·
  **Gentle "try again"** (wrong answer — encouraging, never sad/scolding) ·
  **Graduating** (Demo Day / all 10 done) · **Sleepy/empty** (empty leaderboard, loading).
- Keep the logo's accessories meaningful: **sprout = growth/streak, cap = mastery,
  paintbrush = create, orbit = knowledge, ball = play/compete.** Reuse them as standalone
  motif icons too.
- Deliver as a tidy sprite/illustration set that engineering can drop in (SVG preferred).

### 4.5 Iconography & illustration
- A **single icon style** derived from the logo's line/blob quality (rounded strokes, soft
  fills, a touch of hand-drawn). Replace ad-hoc emoji used as UI icons (status badges, stat
  icons, section markers) with this consistent set. *(Emoji inside lesson body copy can
  stay; it's the structural/UI icons that need unifying.)*
- The **9 existing teaching diagrams** (`public/diagrams/`) are functional but visually
  off-brand — propose a restyle so they share the palette, line weight, and rounded feel.

### 4.6 Motion
- **Signature transitions** built on the **orbit swoosh** (page/slide changes, the existing
  slide-to-slide lesson transition).
- **Micro-interactions:** tap-scale on buttons, pop-in on cards, Sunny reactions.
- **Celebrations:** scale to the moment — a small toast for a correct answer, a full
  **confetti + Sunny graduating** moment for clearing a hurdle, a podium for the leaderboard.
- **Hard rule:** everything must degrade gracefully under `prefers-reduced-motion` (the app
  already honours this globally — keep it).

---

## 5. Screen-by-screen direction

For each: the screen exists and works — give it the brand. Files in
`src/app/**` and `src/components/**`.

1. **Landing (`/`)** — Hero with **Sunny welcoming**, the orbit as a backdrop, the rainbow
   wordmark, big blobby CTAs ("Start your adventure"). The 3 "how it works" steps and 4
   learning pillars become branded illustrated cards.
2. **Start / create-or-join (`/start`)** — Three warm choice cards (Create room / Join /
   Solo). The **AvatarPicker** is a perfect place for mini-mascots or logo-style creatures
   instead of plain emoji.
3. **Hurdle map (the journey)** — This is the signature screen. Currently a simple
   vertical path of 10 nodes. Make it a **delightful adventure map** built on the **orbit/
   path** motif: 10 themed stops along a winding trail, each node a soft blobby badge in its
   hurdle accent, locked nodes dimmed, the next node glowing with Sunny pointing at it,
   "cleared" nodes wearing a little grad cap or sprout. Show XP/streak/progress as growing,
   organic meters.
4. **Hurdle lesson (slides)** — The paced, one-section-per-slide mini-lesson
   (`HurdleLesson.tsx`). Brand the **slide frame**: orbit-style progress bar, soft slide
   transitions, a per-hurdle accent theme, Sunny as a small guide in a corner. Style the
   **intro, key-idea, video, activity, reflect, key-words, and wrap-up** slide types as a
   coherent set. Keep reading comfortable — calm here, save the energy for rewards.
5. **Gate quiz (`GateQuiz.tsx`)** — Friendly, game-show feel. Sunny "thinking," satisfying
   correct/incorrect states (encouraging, not punishing), a clear progress indicator,
   celebratory pass screen.
6. **Reward / celebration (`Reward.tsx`)** — The big payoff: **Sunny graduating**, confetti,
   XP-gained counter, "next hurdle" CTA. Make it feel earned.
7. **Leaderboard & rooms (`/room/[id]`, `LeaderboardView`, `InviteCard`)** — Lean into the
   **soccer-ball "friendly competition"** motif. Podium for top 3, masc/avatar per player,
   "you" clearly highlighted, growing-bar XP. The **InviteCard** (link + QR) should feel
   like a fun "invite a friend" moment — brand the QR frame.
8. **Join via invite (`/join/[id]`)** — Warm welcome ("You're invited to {room}!"), Sunny
   waving, nickname + avatar pick.
9. **Content pages (`/overview`, `/tools`, `/appendix`, `/mindmap`)** — Apply the system:
   branded section headers, the toolkit as illustrated tool cards, the glossary readable
   and friendly. (These are public/SEO pages — keep them crawlable.)
10. **Facilitator mode (`/facilitator`)** — A slightly calmer, "grown-up" tone within the
    same brand (it's for teachers/parents); facilitator blocks visually distinct (the app
    uses a green dashed treatment today).

---

## 6. Accessibility & platform constraints (non-negotiable)

- **Mobile-first**, designed at **375px** up. No horizontal overflow. Honour iOS safe-area
  insets (the app already does for header/nav/sheets).
- **Readability floors:** **≥12px** for any informational text; **~44px** minimum touch
  targets (chips, pickers, dismiss buttons, nav).
- **WCAG AA contrast** for all text — verify against the *real* background, especially soft
  pastel-on-cream combinations.
- **`prefers-reduced-motion`:** every animation degrades to calm/static.
- **Child-safe & calm under pressure:** wrong-answer and empty states must be encouraging,
  never sad, scary, or scolding.
- **Installable PWA:** the home-screen icon, splash, and theme colour are part of the brand
  — design them from the same vector master.

---

## 7. Technical handoff — how to deliver so engineering can ship it

The app is **Next.js 16 (App Router) + Tailwind v4 + TypeScript**. Design tokens live as
**`@theme` CSS variables in `src/app/globals.css`**; shared primitives today are
`.ks-card`, `.ks-chip`, `--radius-*`, `--shadow-card`, plus per-accent helpers in
`src/lib/game/accent.ts`. Components are in `src/components/**`.

**Please deliver:**
1. **A vector logo master** (SVG) + the derived **favicon / apple-icon / 192&512 maskable
   PWA icons** (the repo generates these via `scripts/gen-icons.ts` from one source — give
   us a better source).
2. **A token spec** mapping cleanly onto the existing `@theme` variables (colours + ramps,
   radii, shadows, type scale, spacing) — ideally as the literal CSS-variable values so it
   drops into `globals.css`.
3. **A component style spec** for the shared primitives (button/CTA, card, chip, input,
   section header, stat/meter, progress bar, badge, modal/sheet, table) — states included
   (default/hover/active/disabled/focus).
4. **The mascot ("Sunny") asset set** — the poses in §4.4 as SVGs.
5. **The icon set** (status, stats, section markers, the 5 logo motifs) as SVGs.
6. **Screen redlines/mockups** for the signature screens (§5): landing, hurdle map, a
   lesson slide, gate quiz, reward, leaderboard. Mobile (375px) first; note desktop.
7. **Motion notes** (durations/easings) for transitions, micro-interactions, celebrations.
8. A short **Figma (or equivalent) + this brief annotated**, so engineering can restyle
   token-first then sweep components.

**Do:** keep all behaviour/content/routes; express everything as reusable tokens +
primitives; respect the floors; design the empty/loading/error states.
**Don't:** introduce a CSS framework change, hard-code one-off styles, add heavy
illustration that bloats the mobile bundle, or break the `prefers-reduced-motion` /
safe-area / contrast guarantees.

---

## 8. Definition of done

- A stranger could place any screen next to the logo and instantly see they're the same brand.
- Every interactive element comes from one shared, documented primitive set.
- Sunny appears as a guide/celebrant across the journey — not just in the header.
- The five logo motifs (cap, sprout, paintbrush, orbit, ball) recur meaningfully.
- 375px-clean, AA-contrast, 12px/44px floors met, reduced-motion honoured.
- One vector logo master → favicon, PWA icons, mascot, and wordmark all derive from it.
- Tokens + component specs hand to engineering as a token-first restyle (no logic changes).

---

### Appendix — current state (starting point for the designer)
- Live brand colours already tokenised (table in §4.1).
- Fonts: Nunito (display) + Inter (body) via `next/font`.
- Existing primitives: `.ks-card` (cream, 2px border, chunky 6px shadow), `.ks-chip`
  (pill, 44px min), pill CTAs, per-hurdle accent tints.
- Signature screens already built and working: landing, start, hurdle map, **slide-based
  lesson**, gate quiz, confetti reward, room leaderboard, invite (link+QR), content pages,
  facilitator mode.
- Motion: slide transitions + confetti exist; `prefers-reduced-motion` honoured globally.
- The current look is competent but generic-flat; the job is to make it unmistakably
  **KidSmart**, derived from the logo.
```
