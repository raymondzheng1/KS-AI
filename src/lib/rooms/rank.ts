/**
 * Pure leaderboard ranking (Harness §3.5 — computed on read, never stored).
 * Sort: XP desc → hurdles cleared desc → fewer attempts → faster → nick.
 * Dense ranks: players tied on XP share a rank.
 */
import type { PlayerScore } from "@/lib/scoring/xp";

export interface LeaderboardEntry {
  code: string;
  nick: string;
  avatar: string;
  score: PlayerScore;
}

export interface LeaderboardRow extends LeaderboardEntry {
  rank: number;
}

export function rankLeaderboard(entries: readonly LeaderboardEntry[]): LeaderboardRow[] {
  const sorted = [...entries].sort(
    (a, b) =>
      b.score.xp - a.score.xp ||
      b.score.cleared - a.score.cleared ||
      a.score.totalAttempts - b.score.totalAttempts ||
      a.score.totalMs - b.score.totalMs ||
      a.nick.toLowerCase().localeCompare(b.nick.toLowerCase()),
  );

  let rank = 0;
  let prevXp: number | null = null;
  return sorted.map((e, i) => {
    if (e.score.xp !== prevXp) {
      rank = i + 1;
      prevXp = e.score.xp;
    }
    return { ...e, rank };
  });
}
