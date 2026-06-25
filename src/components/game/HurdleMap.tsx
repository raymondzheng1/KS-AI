"use client";

import { HURDLES, HURDLE_COUNT } from "@/lib/content";
import { Sunny } from "@/components/Sunny";
import { clearedCount, firstAvailable, hurdleStatus } from "@/lib/game/unlock";

/* Trail geometry (fixed 320px-wide column; centres on larger screens). */
const W = 320;
const TOP = 36;
const STEP = 60;
const LEFT_X = 58;
const RIGHT_X = W - 58; // 262
const nodeX = (i: number) => (i % 2 === 0 ? LEFT_X : RIGHT_X);
const nodeY = (i: number) => TOP + i * STEP;
const H = nodeY(HURDLE_COUNT - 1) + 72;

/** Smooth S-curve path winding through the alternating node centres. */
function trailPath(): string {
  let d = `M ${nodeX(0)} ${nodeY(0)}`;
  for (let i = 1; i < HURDLE_COUNT; i++) {
    const ym = (nodeY(i - 1) + nodeY(i)) / 2;
    d += ` C ${nodeX(i - 1)} ${ym}, ${nodeX(i)} ${ym}, ${nodeX(i)} ${nodeY(i)}`;
  }
  return d;
}

function CompassRose() {
  return (
    <svg viewBox="0 0 60 60" width="56" height="56" aria-hidden className="opacity-90">
      <circle cx="30" cy="30" r="24" fill="#FFF8E8" stroke="#B98C4A" strokeWidth="2" strokeDasharray="2 4" />
      <path d="M30 8 L34 30 L30 34 L26 30 Z" fill="#E85C3A" />
      <path d="M30 52 L26 30 L30 26 L34 30 Z" fill="#2E6FA3" opacity=".5" />
      <path d="M8 30 L30 26 L34 30 L30 34 Z" fill="#4B9FD4" />
      <path d="M52 30 L30 34 L26 30 L30 26 Z" fill="#4B9FD4" opacity=".5" />
      <text x="30" y="6" textAnchor="middle" fontSize="7" fill="#B98C4A" fontFamily="Fredoka">N</text>
    </svg>
  );
}

export function HurdleMap({
  done,
  onOpen,
}: {
  done: readonly string[];
  onOpen: (id: string) => void;
}) {
  const cleared = clearedCount(done);
  const currentId = firstAvailable(done);
  const current = HURDLES.find((h) => h.id === currentId);

  return (
    <div className="mx-auto max-w-md px-5 py-5 lg:max-w-5xl">
      <div className="lg:flex lg:items-start lg:gap-12">
        {/* Info column (a side panel on desktop) */}
        <div className="lg:sticky lg:top-24 lg:w-72 lg:shrink-0">
      {/* Progress row */}
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-ks-dark" style={{ transform: "rotate(-1deg)" }}>
          Treasure trail
        </h1>
        <span className="ks-chip" style={{ boxShadow: "inset 0 0 0 2px var(--color-ks-green)", color: "var(--color-ks-green-d)" }}>
          ⭐ {cleared * 100}+ XP
        </span>
      </div>
      <div className="mb-1 flex items-center gap-3">
        <div className="ks-xp flex-1">
          <div className="ks-xp-fill" style={{ width: `${(cleared / HURDLE_COUNT) * 100}%` }} />
        </div>
        <span className="font-display text-sm font-semibold text-ks-dark">{cleared}/{HURDLE_COUNT}</span>
      </div>
      <p className="mb-3 text-xs text-ks-slate">Clear each hurdle to unlock the next. Reach Demo Day! 🏆</p>

          {/* Desktop-only: up-next + legend */}
          <div className="mt-5 hidden lg:block">
            {current && (
              <div className="ks-card p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ks-coral">Up next</p>
                <p className="mt-0.5 font-display text-base font-semibold text-ks-dark">
                  {current.icon} {current.title}
                </p>
                <p className="mt-0.5 text-sm text-ks-slate">{current.subtitle}</p>
              </div>
            )}
            <div className="mt-4 flex flex-col gap-2 text-sm text-ks-ink">
              <span className="flex items-center gap-2">
                <span className="ks-node ks-node-done" style={{ width: 22, height: 22, fontSize: 11, boxShadow: "none" }}>✓</span>
                Cleared
              </span>
              <span className="flex items-center gap-2">
                <span className="ks-node ks-node-current" style={{ width: 22, height: 22, boxShadow: "none" }} />
                Current
              </span>
              <span className="flex items-center gap-2">
                <span className="ks-node ks-node-locked" style={{ width: 22, height: 22 }} />
                Locked
              </span>
            </div>
          </div>
        </div>

        {/* Trail column */}
        <div className="lg:flex lg:flex-1 lg:justify-center">
      {/* Trail */}
      <div className="relative mx-auto" style={{ width: W, maxWidth: "100%", height: H }}>
        {/* compass rose top-right */}
        <div className="absolute right-0 top-0">
          <CompassRose />
        </div>

        {/* dashed path */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          className="absolute inset-0"
          aria-hidden
        >
          <path
            d={trailPath()}
            fill="none"
            stroke="#C7A86A"
            strokeWidth={3}
            strokeDasharray="3 11"
            strokeLinecap="round"
          />
        </svg>

        {/* START chip near node 1 */}
        <span
          className="ks-chip absolute"
          style={{
            left: nodeX(0) - 18,
            top: nodeY(0) - 40,
            transform: "rotate(-3deg)",
            boxShadow: "inset 0 0 0 2px var(--color-ks-green)",
            color: "var(--color-ks-green-d)",
            minHeight: "auto",
            padding: "4px 10px",
          }}
        >
          START
        </span>

        {/* nodes */}
        {HURDLES.map((h, i) => {
          const status = hurdleStatus(h.id, done);
          const isCurrent = h.id === currentId && status !== "done";
          const isTreasure = i === HURDLE_COUNT - 1;
          const x = nodeX(i);
          const y = nodeY(i);
          const cls =
            status === "done"
              ? "ks-node-done"
              : isCurrent
                ? "ks-node-current"
                : "ks-node-locked";
          return (
            <div key={h.id} className="absolute" style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
              <button
                onClick={() => status !== "locked" && onOpen(h.id)}
                disabled={status === "locked"}
                aria-label={`Hurdle ${h.day}: ${h.title} (${status})`}
                className={`ks-node ${cls} disabled:cursor-not-allowed`}
                style={isCurrent ? { width: 66, height: 66, transform: "rotate(3deg)" } : undefined}
              >
                {status === "done" ? "✓" : isTreasure ? "🗺️" : h.day}
              </button>
              {isTreasure && (
                <span className="absolute -right-3 -top-1 text-lg font-extrabold text-ks-coral">✕</span>
              )}
            </div>
          );
        })}

        {/* Sunny "you are here" beside the current node */}
        {HURDLES.map((h, i) => {
          if (h.id !== currentId || hurdleStatus(h.id, done) === "done") return null;
          const x = nodeX(i);
          const y = nodeY(i);
          const onRight = i % 2 === 1;
          return (
            <div
              key={`sunny-${h.id}`}
              className="absolute flex flex-col items-center"
              style={{ left: onRight ? x - 96 : x + 34, top: y - 44 }}
            >
              <Sunny pose="posePoint" size={78} flip={onRight} />
              <span
                className="ks-chip -mt-1"
                style={{
                  transform: "rotate(-2deg)",
                  boxShadow: "inset 0 0 0 2px var(--color-ks-coral)",
                  color: "var(--color-ks-coral)",
                  minHeight: "auto",
                  padding: "4px 10px",
                  fontSize: 12,
                }}
              >
                You are here
              </span>
            </div>
          );
        })}
      </div>
        </div>
      </div>
    </div>
  );
}
