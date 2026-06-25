/**
 * XP scoring — a pure derivation over a player's `SyncedState` (Harness §3.5).
 * Nothing is stored; XP is computed on read so it can never drift.
 *
 * Per cleared hurdle:
 *   100 base
 * + 20 × correct gate-quiz answers
 * + 50 first-try bonus (passed first attempt, perfect score)
 *
 * Plus a streak bonus:
 * + 10 × longest run of consecutive engaged days
 *
 * Tiebreaks (lower is better): fewer total attempts, then faster total time.
 */
import type { SyncedState } from "@/lib/progress/schema";

export const XP = {
  HURDLE_BASE: 100,
  PER_CORRECT: 20,
  FIRST_TRY_BONUS: 50,
  PER_STREAK_DAY: 10,
} as const;

export interface PlayerScore {
  /** Total XP — the leaderboard's primary sort key (desc). */
  xp: number;
  /** Hurdles cleared. */
  cleared: number;
  /** First-try clears (a "mastery" highlight). */
  firstTries: number;
  /** Longest consecutive-day engagement run. */
  streak: number;
  /** Sum of attempts across cleared hurdles (tiebreak, asc). */
  totalAttempts: number;
  /** Sum of best clear times in ms (tiebreak, asc). */
  totalMs: number;
}

/**
 * Longest run of consecutive calendar days in a `YYYY-MM-DD` list.
 * Monotone: adding days can only grow (or hold) the result.
 */
export function longestStreak(days: readonly string[]): number {
  const uniq = Array.from(new Set(days)).sort();
  if (uniq.length === 0) return 0;
  const dayNum = (d: string): number => Math.floor(Date.parse(`${d}T00:00:00Z`) / 86_400_000);
  let best = 1;
  let run = 1;
  for (let i = 1; i < uniq.length; i++) {
    const prev = dayNum(uniq[i - 1]);
    const cur = dayNum(uniq[i]);
    if (Number.isNaN(prev) || Number.isNaN(cur)) continue;
    run = cur - prev === 1 ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

/** Compute the full score breakdown for one player's synced state. */
export function scorePlayer(state: SyncedState): PlayerScore {
  let xp = 0;
  let firstTries = 0;
  let totalAttempts = 0;
  let totalMs = 0;

  for (const id of state.done) {
    const q = state.quiz[id];
    const correct = q?.correct ?? 0;
    const firstTry = q?.firstTry ?? false;
    xp += XP.HURDLE_BASE + XP.PER_CORRECT * correct + (firstTry ? XP.FIRST_TRY_BONUS : 0);
    if (firstTry) firstTries += 1;
    totalAttempts += q?.attempts ?? 1;
    totalMs += q?.bestMs ?? 0;
  }

  const streak = longestStreak(state.days);
  xp += XP.PER_STREAK_DAY * streak;

  return {
    xp,
    cleared: state.done.length,
    firstTries,
    streak,
    totalAttempts,
    totalMs,
  };
}
