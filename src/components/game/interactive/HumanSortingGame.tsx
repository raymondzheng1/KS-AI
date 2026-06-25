"use client";

import { useState } from "react";

/**
 * "The Human Sorting Game" as an in-app animation. Each "Next step" plays the
 * exact action a student would take while becoming a machine-learning model by
 * hand: shuffle → sort your own way → labels revealed → sort by labels → spot
 * features → predict a new card → the surprise "black cat" → recap.
 */
type Card = { id: string; emoji: string; label: "Cat" | "Dog" | "Bird" | "Fish"; group: "furry" | "other" };

const BASE: Card[] = [
  { id: "cat-w", emoji: "🐱", label: "Cat", group: "furry" },
  { id: "cat-o", emoji: "🐱", label: "Cat", group: "furry" },
  { id: "dog-1", emoji: "🐶", label: "Dog", group: "furry" },
  { id: "dog-2", emoji: "🐶", label: "Dog", group: "furry" },
  { id: "bird", emoji: "🐦", label: "Bird", group: "other" },
  { id: "fish", emoji: "🐟", label: "Fish", group: "other" },
];

const BIN_X: Record<Card["label"], number> = { Cat: 15, Dog: 38, Bird: 62, Fish: 85 };

const STEPS = [
  { title: "Your shuffled stack", text: "Here's a shuffled stack of animal cards. You're about to become the machine learning model — by hand!" },
  { title: "Round 1 — your own way", text: "Sort them however you like — there are no labels yet. You probably grouped them by features you noticed, like fur or wings." },
  { title: "The labels appear", text: "Now the correct labels are revealed: Cat, Dog, Bird, Fish. These are your training examples." },
  { title: "Round 2 — sort by labels", text: "Re-sort using the labels. Learning from labelled examples like this is called supervised learning." },
  { title: "Spot the features", text: "Find the clues that tell classes apart: pointy ears & whiskers → Cat, floppy ears → Dog. A real AI weighs millions of features at once." },
  { title: "Predict a new card", text: "A brand-new card you've never seen slides in. Using your rule you predict… it's a Cat! That's a prediction." },
  { title: "When AI meets something new", text: "Uh oh — you only ever saw white and orange cats, so a black cat is confusing! AI struggles with examples unlike its training data. More variety → fewer mistakes." },
  { title: "You did machine learning!", text: "Collect data → label it → find features → predict → improve. A real AI just does this with millions of examples, super fast." },
];

type Pos = { x: number; y: number; label: boolean; highlight?: boolean; dim?: boolean };

function positions(step: number): Record<string, Pos> {
  const out: Record<string, Pos> = {};
  if (step === 0) {
    BASE.forEach((c, i) => {
      out[c.id] = { x: 50 + (i - 2.5) * 4, y: 70 + (i % 2) * 10, label: false };
    });
  } else if (step === 1 || step === 2) {
    const furry = BASE.filter((c) => c.group === "furry");
    const other = BASE.filter((c) => c.group === "other");
    furry.forEach((c, i) => (out[c.id] = { x: 28, y: 30 + i * 48, label: step === 2 }));
    other.forEach((c, i) => (out[c.id] = { x: 70, y: 30 + i * 48, label: step === 2 }));
  } else {
    const counts: Record<string, number> = { Cat: 0, Dog: 0, Bird: 0, Fish: 0 };
    BASE.forEach((c) => {
      out[c.id] = {
        x: BIN_X[c.label],
        y: 56 + counts[c.label] * 46,
        label: true,
        highlight: step === 4 && (c.id === "cat-w" || c.id === "dog-1"),
        dim: step === 7,
      };
      counts[c.label] += 1;
    });
  }
  return out;
}

function CardChip({ emoji, label, showLabel, highlight, dim }: { emoji: string; label: string; showLabel: boolean; highlight?: boolean; dim?: boolean }) {
  return (
    <div
      className="flex h-[52px] w-12 flex-col items-center justify-center rounded-xl border-2 bg-white transition"
      style={{
        borderColor: highlight ? "var(--color-ks-coral)" : "rgba(46,111,163,0.25)",
        boxShadow: highlight ? "0 0 0 3px color-mix(in srgb, var(--color-ks-coral) 35%, transparent)" : "0 2px 6px rgba(46,111,163,0.12)",
        opacity: dim ? 0.4 : 1,
      }}
    >
      <span className="text-2xl leading-none">{emoji}</span>
      {showLabel && <span className="mt-0.5 text-[9px] font-bold text-ks-dark">{label}</span>}
    </div>
  );
}

export function HumanSortingGame() {
  const [step, setStep] = useState(0);
  const pos = positions(step);
  const last = STEPS.length - 1;

  return (
    <div className="ks-card mt-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎮</span>
        <h3 className="font-display text-base font-semibold text-ks-dark">Become the AI — sorting game</h3>
      </div>

      {/* Stage */}
      <div className="relative mt-3 h-[260px] overflow-hidden rounded-2xl border-2 border-dashed border-ks-kraft bg-ks-cream">
        {/* bin labels (label-sort steps) */}
        {step >= 3 &&
          (Object.keys(BIN_X) as Card["label"][]).map((lbl) => (
            <div
              key={lbl}
              className="absolute -translate-x-1/2 text-center"
              style={{ left: `${BIN_X[lbl]}%`, top: 6 }}
            >
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-ks-dark shadow">{lbl}</span>
            </div>
          ))}

        {/* round-1 group hints */}
        {(step === 1 || step === 2) && (
          <>
            <span className="absolute left-[28%] top-1 -translate-x-1/2 text-[11px] font-bold text-ks-slate">Furry friends?</span>
            <span className="absolute left-[70%] top-1 -translate-x-1/2 text-[11px] font-bold text-ks-slate">Wings &amp; fins?</span>
          </>
        )}

        {/* base cards */}
        {BASE.map((c) => {
          const p = pos[c.id];
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 transition-all duration-500 ease-out"
              style={{ left: `${p.x}%`, top: p.y }}
            >
              <CardChip emoji={c.emoji} label={c.label} showLabel={p.label} highlight={p.highlight} dim={p.dim} />
            </div>
          );
        })}

        {/* feature rule callout */}
        {step >= 4 && step <= 6 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-ks-dark shadow">
            🔎 pointy ears = Cat · floppy ears = Dog
          </div>
        )}

        {/* predicted new card */}
        {step >= 5 && (
          <div className="absolute -translate-x-1/2" style={{ left: `${BIN_X.Cat}%`, top: 56 + 2 * 46 }}>
            <div className="ks-pop-in relative">
              <CardChip emoji="🐱" label="Cat" showLabel />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ks-green text-[11px] text-white">✓</span>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-ks-green">NEW</span>
            </div>
          </div>
        )}

        {/* the surprise black cat */}
        {step >= 6 && (
          <div className="absolute -translate-x-1/2" style={{ left: `${BIN_X.Cat + 16}%`, top: 56 }}>
            <div className="ks-wobble relative">
              <div className="flex h-[52px] w-12 flex-col items-center justify-center rounded-xl border-2 border-ks-coral bg-white">
                <span className="text-2xl leading-none" style={{ filter: "grayscale(1) brightness(0.5)" }}>🐱</span>
              </div>
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ks-coral text-[11px] text-white">?</span>
            </div>
          </div>
        )}

        {/* recap loop */}
        {step === 7 && (
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1.5 bg-ks-cream/85 p-4">
            {["📥 Data", "🏷️ Label", "🔎 Features", "🔮 Predict", "✅ Improve"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ks-dark shadow">{s}</span>
                {i < arr.length - 1 && <span className="text-ks-slate">→</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Narration */}
      <div className="mt-3">
        <p className="font-display text-sm font-semibold text-ks-coral">
          Step {step + 1} of {STEPS.length} · {STEPS[step].title}
        </p>
        <p className="mt-1 text-sm text-ks-ink">{STEPS[step].text}</p>
      </div>

      {/* progress dots */}
      <div className="mt-3 flex gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1 rounded-full"
            style={{ background: i <= step ? "var(--color-ks-coral)" : "rgba(46,111,163,0.18)" }}
          />
        ))}
      </div>

      {/* controls */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="ks-btn ks-btn-ghost">
          ← Back
        </button>
        {step < last ? (
          <button onClick={() => setStep((s) => Math.min(last, s + 1))} className="ks-btn ks-btn-coral flex-1">
            Next step →
          </button>
        ) : (
          <button onClick={() => setStep(0)} className="ks-btn ks-btn-green flex-1">
            ↺ Play again
          </button>
        )}
      </div>
    </div>
  );
}
