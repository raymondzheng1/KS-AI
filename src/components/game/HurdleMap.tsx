"use client";

import { HURDLES } from "@/lib/content";
import type { Hurdle } from "@/lib/content/schema";
import { accentColor, accentTint } from "@/lib/game/accent";
import { hurdleStatus, type HurdleStatus } from "@/lib/game/unlock";

function StatusBadge({ status }: { status: HurdleStatus }) {
  if (status === "done")
    return <span className="text-lg" aria-label="cleared">✅</span>;
  if (status === "locked")
    return <span className="text-lg opacity-50" aria-label="locked">🔒</span>;
  return (
    <span
      className="motion-safe:animate-pulse text-lg"
      aria-label="available"
      style={{ filter: "drop-shadow(0 0 6px var(--color-ks-yellow))" }}
    >
      ▶️
    </span>
  );
}

function MapNode({
  hurdle,
  status,
  side,
  onOpen,
}: {
  hurdle: Hurdle;
  status: HurdleStatus;
  side: "left" | "right";
  onOpen: (id: string) => void;
}) {
  const clickable = status !== "locked";
  return (
    <div className={`flex items-center gap-3 ${side === "right" ? "flex-row-reverse text-right" : ""}`}>
      <button
        onClick={() => clickable && onOpen(hurdle.id)}
        disabled={!clickable}
        aria-label={`Hurdle ${hurdle.day}: ${hurdle.title} (${status})`}
        className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 text-2xl shadow-card transition disabled:cursor-not-allowed disabled:opacity-60 enabled:hover:scale-105"
        style={{
          borderColor: status === "locked" ? "rgba(46,111,163,0.25)" : accentColor(hurdle.accent),
          background: status === "locked" ? "white" : accentTint(hurdle.accent, 25),
        }}
      >
        <span style={{ filter: status === "locked" ? "grayscale(1)" : "none" }}>{hurdle.icon}</span>
        <span className="absolute -bottom-2 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-extrabold text-ks-dark shadow">
          {hurdle.day}
        </span>
      </button>
      <button
        onClick={() => clickable && onOpen(hurdle.id)}
        disabled={!clickable}
        className="min-w-0 flex-1 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2" style={{ justifyContent: side === "right" ? "flex-end" : "flex-start" }}>
          <StatusBadge status={status} />
          <p className="truncate font-extrabold text-ks-dark">{hurdle.title}</p>
        </div>
        <p className="truncate text-xs text-ks-ink-soft">{hurdle.subtitle}</p>
      </button>
    </div>
  );
}

export function HurdleMap({
  done,
  onOpen,
}: {
  done: readonly string[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-6">
      <h1 className="mb-1 text-center text-2xl font-extrabold text-ks-dark">Your AI Adventure</h1>
      <p className="mb-6 text-center text-sm text-ks-ink-soft">
        Clear each hurdle to unlock the next. Reach Demo Day! 🏆
      </p>
      <div className="relative flex flex-col gap-5">
        {/* connecting spine */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-1 -translate-x-1/2 rounded-full bg-ks-dark/10" />
        {HURDLES.map((h, i) => (
          <MapNode
            key={h.id}
            hurdle={h}
            status={hurdleStatus(h.id, done)}
            side={i % 2 === 0 ? "left" : "right"}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}
