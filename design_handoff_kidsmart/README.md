# Handoff: KidSmart — Brand & Mobile Screens (Direction C · "Sketchbook")

## Overview
KidSmart is a fun, **mobile-first** learning website that teaches AI to ~12-year-olds through a 10-step "adventure," with quizzes, a leaderboard, and play-with-friends features. This package contains the **visual identity** (built entirely from the KidSmart logo) and high-fidelity mockups for the three signature screens: **Home**, the **Adventure Map**, and a **Lesson** screen.

The chosen visual direction is **C · "Sketchbook"** — a crafty, hand-made look: a cream paper background with a subtle dotted texture, dashed cut-out cards, washi-tape accents, crayon underlines, and a treasure-map trail. Maximum warmth and personality while staying readable and cool enough for a 12-year-old.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look and feel, **not production code to copy directly.** Your task is to **recreate these designs in the target codebase's environment** using its established patterns and component libraries. (Per the live brief the production site is a Next.js / React app — recreate this as React components with whatever styling system the repo already uses: CSS Modules, Tailwind, styled-components, etc. If no environment exists yet, choose the most appropriate stack and implement there.)

The HTML file is a single "design canvas" containing **three** directions side by side plus a brand sheet and a mascot sheet. **Implement Direction C only.** Ignore Directions A and B (they are alternatives the client did not pick) — but the brand sheet, the mascot, and the design tokens below apply to all directions and are the source of truth.

## Fidelity
**High-fidelity (hifi).** Colours, typography, spacing, radii, shadows, and copy are final. Recreate the UI faithfully using the codebase's libraries. Exact values are in **Design Tokens** below; measurements per screen are in **Screens**.

---

## Brand Foundations

### Logo
The KidSmart logo is a soft yellow "blob star" character ("Sunny") wearing a graduation cap, with a sprout, a paintbrush, a blue orbit ring, and a soccer ball, above a chunky multi-colour **KIDSMART** wordmark.

The original supplied logo had a **solid white background**, which we removed. The brand lockup is now **split into two transparent PNGs** so it can sit cleanly in the app header:
- `assets/kidsmart_star.png` — the star/mascot icon only (transparent, 660×508)
- `assets/kidsmart_word.png` — the "KIDSMART" wordmark only (transparent, 548×80)
- `assets/kidsmart_logo_t.png` — the full lockup, transparent (use where you want both stacked)
- `assets/kidsmart_logo.png` — the original (white background; avoid on coloured surfaces)

**Header usage:** place the star icon (~40px tall) next to the wordmark (~19px tall) on a single row, left-aligned. See Home header below.

### The five logo motifs (reuse as iconography)
- **Sprout = growth** · **Cap = mastery** · **Brush = create** · **Orbit = curiosity** · **Ball = play/compete**

### Mascot — "Sunny"
A custom SVG character with **six poses**, all derived from the logo. Delivered as `assets/sunny-mascot.svg`, an inline `<svg>` containing one base body symbol (`#sunnyStar`) and six pose symbols. Each pose uses `viewBox="0 0 240 270"`.

| Pose id | When to use |
|---|---|
| `poseWave` | Welcome / hero (waving hello) |
| `posePoint` | Guiding the user (e.g. "you are here" on the map). Flip horizontally with `transform: scaleX(-1)` to point left. |
| `poseThink` | Tips / "Key idea" callouts |
| `poseCheer` | Win / celebration (cap + raised hands + confetti) |
| `poseTry` | Gentle "try again" on a wrong answer — encouraging, never sad |
| `poseGrad` | Big win / graduation (diploma + orbit) |

**How to render (React example):** inline the contents of `sunny-mascot.svg` once near the app root (so the `<symbol>`s exist in the DOM), then reference a pose anywhere:
```jsx
<svg viewBox="0 0 240 270" style={{ width: 120 }} aria-label="Sunny">
  <use href="#poseWave" />
</svg>
```
Recommended display sizes: hero ~126px, map marker ~78px, inline callout ~48–52px. The poses already include hands, cap, sparkles, and motion lines.

---

## Design Tokens

### Colours
| Token | Hex | Use |
|---|---|---|
| `--yel` | `#FFD135` | Primary energy / mascot / highlights. Shadow shade `--yeld` `#F2B705` |
| `--blue` | `#4B9FD4` | Accents, the "knowledge" orbit |
| `--dblue` | `#2E6FA3` | Headline text, borders, icon strokes |
| `--green` | `#6DBE47` | Success / growth / completed. Shadow shade `#4e9a2f` |
| `--orange` | `#F5A623` | Highlights, tassel, washi tape |
| `--coral` | `#E85C3A` | Primary CTA buttons / alerts. Shadow shade `--corald` `#c0492c` |
| `--lav` | `#8E9BE0` | Lavender/periwinkle (cap + orbit). Shadow shade `--lavd` `#6E7CCB` |
| `--off` | `#F4F9FF` | App background (off-white) |
| `--cream` | `#FFF8E8` | Cards / panels / **Direction C page background** |
| `--ink` | `#444444` | Body text |
| `--slate` | `#7E92A6` | Secondary/muted text |

**Sketchbook-specific accents (Direction C):**
| Purpose | Value |
|---|---|
| Dashed border (cards, circles) | `2.5px dashed #CBB582` |
| Treasure trail line | `stroke:#C7A86A; stroke-width:3; stroke-dasharray:3 11; stroke-linecap:round` |
| Kraft/locked node text & fill | text `#B98C4A`, fill `#FFF8E8` |
| Washi tape | `background: rgba(245,166,35,.5)` (also a green variant `rgba(109,190,71,.42)`), `border-radius:2px`, rotated ~`-6deg`, ~86×24px |
| Sticky note | `background:#FFF3C2; border-radius:6px; box-shadow:0 6px 14px rgba(200,170,80,.25)`, rotated `-1.5deg` |
| Paper texture | `background:#FFF8E8` + `background-image: radial-gradient(rgba(46,111,163,.09) 1.4px, transparent 1.4px); background-size:18px 18px` |

All text/background combinations meet **WCAG AA**. Keep it that way — never put soft yellow text on cream.

### Typography
- **Headings — Fredoka** (rounded, chunky), weights 400 / 500 / 600 / 700. Used for display, titles, button labels, numbers, section labels.
- **Body — Nunito** (clean, very readable), weights 400 / 600 / 700 / 800 / 900.
- Google Fonts import:
  `https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700&display=swap`

**Type scale (px):**
| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Display (hero) | Fredoka | 26–28 | 700 | line-height ~1.05 |
| Screen title | Fredoka | 21 | 700 | |
| Section heading | Fredoka | 16–18 | 600 | |
| Header brand greeting | Nunito | 13 | 400 | muted |
| Body | Nunito | 13–16 | 400 (bold runs 700) | line-height 1.55 |
| Small / caption | Nunito | 11–12 | 400/600 | min text size 11–12px (per brief) |
| Chips / badges | Nunito | 12–13 | 800 | |

### Radii
- Cards: 26–30px · Buttons: 24px · Inputs: 18px · Chips/pills: 999px · Nodes: 50% · Small icon tiles: 9–13px · Phone frame: 46px (screen inset 40px).

### Shadows
- Card: `0 14px 36px rgba(46,111,163,.12)`
- Soft card: `0 10px 26px rgba(46,111,163,.10)`
- Small raised row: `0 4px 14px rgba(46,111,163,.07)`
- **3D "candy" buttons** use a solid offset for the chunky look (no blur), e.g. coral: `0 5px 0 #c0492c, 0 10px 16px rgba(232,92,58,.28)`. On press, translate the button down ~3–5px and reduce the solid offset to mimic a squish.
- Candy nodes use a solid bottom offset: done `0 5px 0 #4e9a2f`, current `0 5px 0 #c0492c`, locked `0 5px 0 #DCE6F0`.

### Spacing
8px-based rhythm: gaps of 4 / 6 / 8 / 10 / 12 / 16 / 24px. Screen content horizontal padding: **20px**. Tap targets **≥ 44px** (buttons are ~48px tall; circular nav buttons 38–42px — bump to 44px in production if they're primary actions).

---

## Components

### Buttons (`.btn`, Fredoka 600, 16px, radius 24, padding 14×22, full-width in screens)
- **Primary / CTA** — coral fill `#E85C3A`, white text, candy shadow (above). Copy examples: "Start your adventure ✏️", "Got it — next →".
- **Yellow** — `#FFD135` fill, dark-blue text, candy shadow `0 5px 0 #F2B705`.
- **Ghost (Direction C variant)** — white fill, dark-blue text, **dashed** kraft border `2.5px dashed #CBB582`, no shadow. Copy: "See the 10 hurdles".
- **Lavender** — `#8E9BE0` fill, white text (used elsewhere).

### Chips / badges (`.chip`, pill, Nunito 800, 12–13px, padding 6×12)
Variants: green `+50 XP` / `⭐ 320 XP`, lavender `Day 3`, coral `You are here`, soft-orange streak `🔥 streak 4` (`bg #FDE9D2`, text `#C9772A`), green `START`.

### Input (`.input`)
`border:2.5px solid #D4E6F4; border-radius:18px; padding:13px 16px; font:Nunito 15px; color:#444`. Placeholder example: "Pick a fun nickname…".

### XP / progress bar (`.xp` / `.xpf`)
Track: height 14px (10px when compact), radius 999, `background:#E6EEF6`. Fill: `linear-gradient(90deg,#FFD135,#F5A623)`, radius 999. Paired with a Fredoka label like "Day 6/10" or "Step 2 / 5".

### Adventure nodes (`.node`, 58px circle, Fredoka 600, 20px)
- **Done:** green `#6DBE47`, white `✓`, candy shadow.
- **Current:** coral `#E85C3A`, white number, larger (~66px), candy shadow; in Direction C rotated ~3deg.
- **Locked (Direction C):** cream `#FFF8E8` fill, kraft text `#B98C4A`, **dashed** kraft border, no candy shadow.
- **Final (Day 10):** a 🗺️ map glyph with a small red "X marks the spot" beside it (treasure).

### Cards / surfaces (Direction C)
- **Dashed card** (`.dash`): white fill, `2.5px dashed #CBB582`, radius 22, often rotated `-1deg` with one or two **washi tapes** at the top corners.
- **Sticky note:** `#FFF3C2`, radius 6, rotated `-1.5deg`, soft warm shadow — used for "Key idea" callouts.

### Doodle accents
- **Crayon underline** under headings — a hand-drawn `<path>` (coral or yellow), `stroke-width 4.5–5`, `stroke-linecap:round`, e.g. `M4 6C40 2 70 9 100 5 120 2 134 6 146 5`.
- **Compass rose** doodle (top-right of the map): dashed circle `#FFF8E8`/`#B98C4A` with a coral N–S needle and blue E–W needle.
- **Dashed arrows** in diagrams: `stroke:#B98C4A; stroke-dasharray:2 3`.

---

## Screens

All screens are designed inside a **375 × 768px** phone frame (iPhone-class). Frame chrome (rounded bezel, status bar, notch) is prototype scaffolding — in production use the device's real status bar. Content layout is a vertical flex column: **status bar (38px) → fixed header → scrollable content area → fixed footer (where present)**. Horizontal padding 20px.

### 1. Home / welcome
**Purpose:** orient the user, show the brand, launch into the adventure.
**Background:** paper texture (cream + dotted).
**Layout (top → bottom):**
1. **Header row** (`space-between`): left = brand lockup — `kidsmart_star.png` (height 40px) + `kidsmart_word.png` (height 19px) in a row, gap 10px; right = avatar (dashed kraft circle, 42px, contains user emoji/photo, e.g. 🦊).
2. **Greeting line** below header: Nunito 13px, slate — "Hi, explorer! Ready for Day 6? 👋".
3. **Hero card** (dashed white card, rotated `-1deg`, two washi tapes at top corners — one orange, one green): centered. Contains:
   - **Sunny** `poseWave` SVG, ~126px wide, centered.
   - Headline "Become an<br>AI Explorer" — Fredoka 700, 26px, dark blue, line-height 1.05.
   - Coral **crayon underline** beneath the headline.
   - Paragraph — Nunito 13px, ink: "A 2-week adventure — clear **10 AI hurdles**, play and compete with friends." (bold the "10 AI hurdles").
   - **CTA** (coral, full width): "Start your adventure ✏️".
   - **Ghost** (dashed, full width, 10px below): "See the 10 hurdles".
4. **"How it works"** section title (Fredoka 600, 16px, dark blue, slightly rotated `-1deg`), then 3 rows (gap 10px). Each row: a 34px **dashed rounded-square checkbox** (white, with a green check ✓ for steps 1–2, an empty kraft circle for step 3) + a title (Fredoka 600, 14px, dark blue) + a one-line description (Nunito 12px, slate):
   - **Join a room** — "Scan a QR or open your invite link."
   - **Clear 10 hurdles** — "Learn, play, then pass the gate quiz."
   - **Climb the leaderboard** — "Earn XP for wins and daily streaks."

### 2. Adventure Map — "Treasure trail" (signature screen)
**Purpose:** show the 10-step journey, progress, and the current stop.
**Background:** paper texture.
**Layout:**
1. **Header row** (`space-between`): left = back button (dashed kraft circle 38px, dark-blue chevron `‹`); center = title "Treasure trail" (Fredoka 600, 18px, dark blue); right = green chip "⭐ 320 XP".
2. **Progress row:** XP bar (fill 58%) + Fredoka label "Day 6/10".
3. **Trail area** (335 × 660px, centered): a single winding **dashed brown path** SVG runs top→bottom, alternating left and right. The path string used:
   `M60 52 C60 90,250 76,250 114 C250 152,60 138,60 176 C60 214,250 200,250 238 C250 276,60 262,60 300 C60 338,250 324,250 362 C250 400,60 386,60 424 C60 462,250 448,250 486 C250 524,60 510,60 548 C60 586,250 572,250 610`
   **10 nodes** sit on the path (node = 58px circle unless noted), alternating x≈60 (left, `left:35px`) and x≈250 (right, `left:225px`), stepping down ~62px:
   - Nodes 1–5: **done** (green ✓) at tops 27 / 89 / 151 / 213 / 275px.
   - Node 6: **current** (coral, 66px, rotated 3°, label "6") at `left:223px; top:335px`.
   - Nodes 7–9: **locked** (cream/dashed kraft, labels 7/8/9) at tops 399 / 461 / 523px.
   - Node 10: **treasure** — 🗺️ glyph (~34px) at `left:222px; top:583px`, with a small red **X** beside it.
   - A green **"START"** chip near the top-left (rotated `-3deg`).
   - **Sunny** `posePoint` (flipped `scaleX(-1)`, ~78px) beside node 6, with a coral **"You are here"** chip (rotated `-2deg`).
   - A **compass rose** doodle in the top-right corner.
   *(Node positions are exact in the HTML; reproduce relative spacing, not absolute px, when you make it responsive.)*

### 3. Lesson
**Purpose:** teach one idea at a time, clearly and kindly.
**Background:** paper texture.
**Layout:**
1. **Header row** (`space-between`): back button (dashed circle); center = title "Machine Learning" (Fredoka 600, 14px) with subtitle "Hurdle 6 · page 2 of 5" (Nunito 11px, slate); right = close `✕` (dashed circle).
2. **Content area** (scrollable):
   - **Lesson card** (dashed white card with a washi tape centered at top): title "How machines learn" (Fredoka 700, 21px, dark blue) + **yellow crayon underline**; paragraph (Nunito 13px): "Machines don't memorise rules. They study **lots of examples**, spot the patterns, then make their best guess. More good examples → smarter guesses."
   - **Mini diagram** (centered row): two **dashed tiles** with 🐱 ("examples") → dashed arrow → a lavender-bordered tile with 🧠 ("model") → dashed arrow → a green chip "cat! 🎉" ("guess"). Labels in Nunito 11px slate.
   - **Sticky-note "Key idea"** callout (yellow `#FFF3C2`, rotated `-1.5deg`): **Sunny** `poseThink` (~48px) + "Key idea ✦" (Fredoka 600, 13px) + "No examples, no learning. Garbage in → garbage guesses!" (Nunito 12px).
3. **Footer** (fixed): coral CTA, full width — "Got it — next →".

### Other screens (not yet designed — for context)
The brief also calls for **Quiz**, **Win/celebration**, **Leaderboard**, and **Invite-a-friend (link + QR)** screens. These are not in this package. When building them, reuse the same tokens, components, and mascot (use `poseCheer` for wins, `poseTry` for wrong answers, `poseGrad` for the final graduation).

---

## Interactions & Behavior
- **Navigation:** Home "Start your adventure" → Adventure Map. Tapping the **current** node → its Lesson. Done nodes → review that hurdle. Locked nodes are non-interactive (optionally show a gentle "Clear Day 5 first!" toast). Back/close buttons return to the previous screen.
- **Lesson flow:** a hurdle is a sequence of steps (the progress bar shows "Step 2 / 5"). "Got it — next" advances; the last step leads into the gate **Quiz**, which unlocks the next node on pass.
- **Button press:** candy buttons squish — translate down ~4px and shrink the solid offset shadow; ~120ms ease.
- **Node transitions:** when a hurdle is completed, the next node animates from locked → current (e.g. a soft pop/scale with `poseCheer`).
- **Encouraging states (must-have):** wrong answers and empty states use `poseTry` and kind copy — never sad or scary. Example wrong-answer copy: "So close! Want to try that one again?"
- **Mascot motion (optional polish):** a gentle idle bob/rotate on the hero `poseWave`; sparkle/confetti on `poseCheer`.
- **Responsive:** designed at 375px; should scale up gracefully to larger phones and center within a max-width column (~480px) on tablets/desktop. Keep the trail's alternating rhythm; let it grow vertically and scroll.

## State Management
- `currentDay` / `currentHurdle` (1–10) and per-hurdle status: `done | current | locked`.
- `xp` (number) and `dayProgress` (for the bar) and `streak`.
- Per-lesson `stepIndex` / `stepCount`.
- `user` (nickname, avatar) and `roomId` (join-a-room flow).
- Quiz answer state + pass/fail to drive node unlocking.
- Data fetching: hurdle content, leaderboard standings, room/invite info — wire to your backend; the mockups use placeholder copy.

## Assets
In `assets/`:
- `kidsmart_star.png` — transparent star/mascot icon (from the supplied logo; white background removed via edge flood-fill, preserving the eyes/highlights and soccer ball).
- `kidsmart_word.png` — transparent "KIDSMART" wordmark.
- `kidsmart_logo_t.png` — full transparent lockup.
- `kidsmart_logo.png` — original supplied logo (white background).
- `sunny-mascot.svg` — the six mascot poses + base body, as inline SVG `<symbol>`s. Custom-drawn for this project; safe to use as the production mascot. You may also export individual poses to standalone files or a sprite if your build prefers that.
- Emoji (🦊 🐱 🧠 🎉 🗺️ ✏️ 👋 🚀 ⭐ 🔥) are used as lightweight placeholders. A bespoke icon set (the five logo motifs + UI icons) is a recommended follow-up — replace emoji with consistent rounded, soft-filled SVG icons drawn from the logo.

## Files
- `KidSmart Brand & Screens.dc.html` — the full design canvas (brand sheet + mascot sheet + Directions A/B/C). **Build Direction C** (labelled "Direction C · Sketchbook"); the Direction C Home/Map/Lesson phones are the last three frames. Open it in a browser to inspect exact markup, measurements, and the SVG doodles. It's a self-contained HTML file; the only external dependency is the Google Fonts link above and the PNGs in `assets/`.
- `assets/` — see above.

> Tip for implementers: the HTML uses small utility classes (`.fx` flex, `.col`, `.ac` align-center, `.jb` justify-between, `.gap*`, `.card`, `.soft`, `.chip`, `.btn`/`.btnCoral`/`.btnGhost`, `.node`/`.ndone`/`.ncur`/`.nlock`, `.dash`, `.tape`, `.paper`, `.xp`/`.xpf`). These map cleanly to your own utility/components — they're documented above so you don't need to reverse-engineer the CSS.
