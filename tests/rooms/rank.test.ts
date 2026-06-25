import { describe, expect, it } from "vitest";
import { rankLeaderboard, type LeaderboardEntry } from "@/lib/rooms/rank";
import { validateNick, isProfane, normalizeNick } from "@/lib/rooms/nickname";
import type { PlayerScore } from "@/lib/scoring/xp";

const score = (o: Partial<PlayerScore>): PlayerScore => ({
  xp: 0,
  cleared: 0,
  firstTries: 0,
  streak: 0,
  totalAttempts: 0,
  totalMs: 0,
  ...o,
});
const entry = (nick: string, s: Partial<PlayerScore>): LeaderboardEntry => ({
  code: nick,
  nick,
  avatar: "🙂",
  score: score(s),
});

describe("rankLeaderboard", () => {
  it("orders by XP desc and assigns ranks", () => {
    const rows = rankLeaderboard([
      entry("Low", { xp: 100 }),
      entry("High", { xp: 500 }),
      entry("Mid", { xp: 300 }),
    ]);
    expect(rows.map((r) => r.nick)).toEqual(["High", "Mid", "Low"]);
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("ties on XP share a rank (dense-ish)", () => {
    const rows = rankLeaderboard([
      entry("A", { xp: 200 }),
      entry("B", { xp: 200 }),
      entry("C", { xp: 100 }),
    ]);
    expect(rows.map((r) => r.rank)).toEqual([1, 1, 3]);
  });

  it("breaks XP ties by cleared, then fewer attempts, then faster", () => {
    const rows = rankLeaderboard([
      entry("Slow", { xp: 200, cleared: 2, totalAttempts: 4, totalMs: 20000 }),
      entry("Fast", { xp: 200, cleared: 2, totalAttempts: 4, totalMs: 9000 }),
      entry("Fewer", { xp: 200, cleared: 2, totalAttempts: 2, totalMs: 30000 }),
    ]);
    expect(rows.map((r) => r.nick)).toEqual(["Fewer", "Fast", "Slow"]);
    expect(rows.every((r) => r.rank === 1)).toBe(true); // all tied on XP
  });

  it("handles an empty room", () => {
    expect(rankLeaderboard([])).toEqual([]);
  });
});

describe("nickname validation + moderation", () => {
  it("accepts clean nicks, normalises whitespace", () => {
    expect(normalizeNick("  Robo  Ray ")).toBe("Robo Ray");
    expect(validateNick("Nova42")).toEqual({ ok: true, nick: "Nova42" });
  });
  it("rejects too-short / illegal-char nicks", () => {
    expect(validateNick("x")).toEqual({ ok: false, reason: "format" });
    expect(validateNick("a<script>")).toEqual({ ok: false, reason: "format" });
  });
  it("blocks profanity, including leetspeak", () => {
    expect(isProfane("sh1t")).toBe(true); // 1 -> i
    expect(validateNick("b1tch").ok).toBe(false); // 1 -> i
    expect(isProfane("Sunshine")).toBe(false); // clean word containing "shi"? no — safe
  });
});
