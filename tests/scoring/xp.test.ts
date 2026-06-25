import { describe, expect, it } from "vitest";
import { XP, longestStreak, scorePlayer } from "@/lib/scoring/xp";
import type { SyncedState } from "@/lib/progress/schema";

describe("longestStreak", () => {
  it("finds the longest consecutive-day run", () => {
    expect(longestStreak(["2026-06-01", "2026-06-02", "2026-06-03", "2026-06-05"])).toBe(3);
  });
  it("is order-independent and dedupes", () => {
    expect(longestStreak(["2026-06-03", "2026-06-01", "2026-06-02", "2026-06-02"])).toBe(3);
  });
  it("returns 0 for empty, 1 for a single day", () => {
    expect(longestStreak([])).toBe(0);
    expect(longestStreak(["2026-06-01"])).toBe(1);
  });
});

describe("scorePlayer", () => {
  it("awards base + per-correct + first-try + streak", () => {
    const state: SyncedState = {
      done: ["d1", "d2"],
      days: ["2026-06-01", "2026-06-02"],
      quiz: {
        d1: { correct: 4, total: 4, attempts: 1, firstTry: true, bestMs: 7000 },
        d2: { correct: 2, total: 4, attempts: 3, firstTry: false, bestMs: 12000 },
      },
    };
    const s = scorePlayer(state);
    // d1: 100 + 20*4 + 50 = 230 ; d2: 100 + 20*2 + 0 = 140 ; streak 2 -> +20
    expect(s.xp).toBe(230 + 140 + XP.PER_STREAK_DAY * 2);
    expect(s.cleared).toBe(2);
    expect(s.firstTries).toBe(1);
    expect(s.streak).toBe(2);
    expect(s.totalAttempts).toBe(4);
    expect(s.totalMs).toBe(19000);
  });

  it("scores an empty state as zero", () => {
    const s = scorePlayer({ done: [], days: [], quiz: {} });
    expect(s).toEqual({
      xp: 0,
      cleared: 0,
      firstTries: 0,
      streak: 0,
      totalAttempts: 0,
      totalMs: 0,
    });
  });

  it("counts a cleared hurdle even with no recorded quiz stat", () => {
    const s = scorePlayer({ done: ["d1"], days: [], quiz: {} });
    expect(s.xp).toBe(XP.HURDLE_BASE);
    expect(s.totalAttempts).toBe(1);
  });
});
