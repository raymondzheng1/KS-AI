"use client";

import type { LocalState } from "@/lib/progress/schema";
import { toSynced } from "@/lib/progress/merge";
import { scorePlayer } from "@/lib/scoring/xp";
import { HURDLE_COUNT } from "@/lib/content";

function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-lg font-semibold text-ks-dark">
        {icon} {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-ks-slate">{label}</span>
    </div>
  );
}

export function Hud({
  state,
  roomHref,
  facilitatorMode,
  onShowCode,
}: {
  state: LocalState;
  roomHref?: string;
  facilitatorMode?: boolean;
  /** Open the "your code & link" panel (HUD 🔑 button). */
  onShowCode?: () => void;
}) {
  const score = scorePlayer(toSynced(state));
  return (
    <header className="sticky top-0 z-30 border-b border-ks-kraft/40 bg-ks-cream/92 px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
        <p className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-ks-dark">
          {state.nick ? `👋 ${state.nick}` : "👋 AI Explorer"}
          {facilitatorMode && (
            <a href="/facilitator" className="ml-2 rounded-full bg-ks-green/15 px-2 py-0.5 text-[10px] font-bold text-ks-green">
              👩‍🏫 Facilitator
            </a>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* XP always; the fuller stats only where there's room (desktop). */}
          <span className="font-display text-sm font-semibold text-ks-dark sm:hidden">⭐ {score.xp}</span>
          <div className="hidden items-center gap-4 sm:flex">
            <Stat label="XP" value={score.xp} icon="⭐" />
            <Stat label="Cleared" value={`${score.cleared}/${HURDLE_COUNT}`} icon="🏁" />
            <Stat label="Streak" value={score.streak} icon="🔥" />
          </div>
          {roomHref && (
            <a href={roomHref} className="ks-btn ks-btn-yellow ks-btn-sm whitespace-nowrap" title="Room leaderboard">
              🏆 Board
            </a>
          )}
          {onShowCode && (
            <button onClick={onShowCode} className="ks-iconbtn" aria-label="Your code & link" title="Your code & link">
              🔑
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
