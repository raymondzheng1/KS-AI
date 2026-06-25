"use client";

import type { LocalState } from "@/lib/progress/schema";
import { toSynced } from "@/lib/progress/merge";
import { scorePlayer } from "@/lib/scoring/xp";
import { HURDLE_COUNT } from "@/lib/content";

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-extrabold text-ks-dark">
        {icon} {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-ks-ink-soft">{label}</span>
    </div>
  );
}

export function Hud({
  state,
  roomHref,
  facilitatorMode,
}: {
  state: LocalState;
  roomHref?: string;
  facilitatorMode?: boolean;
}) {
  const score = scorePlayer(toSynced(state));
  return (
    <header className="sticky top-0 z-30 border-b border-ks-dark/10 bg-ks-bg/95 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-ks-dark">
            {state.nick ? `👋 ${state.nick}` : "AI Explorer"}
            {facilitatorMode && (
              <a href="/facilitator" className="ml-2 rounded-full bg-ks-green/15 px-2 py-0.5 text-[10px] font-bold text-ks-green">
                👩‍🏫 Facilitator
              </a>
            )}
          </p>
          <p className="text-xs text-ks-ink-soft">Code: {state.code}</p>
        </div>
        <div className="flex items-center gap-4">
          <Stat label="XP" value={score.xp} icon="⭐" />
          <Stat label="Cleared" value={`${score.cleared}/${HURDLE_COUNT}`} icon="🏁" />
          <Stat label="Streak" value={score.streak} icon="🔥" />
          {roomHref && (
            <a
              href={roomHref}
              className="ks-chip text-sm"
              title="Room leaderboard"
            >
              🏆 Board
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
