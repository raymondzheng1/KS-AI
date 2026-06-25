import { describe, expect, it } from "vitest";
import {
  getSnapshot,
  hydrate,
  recordQuizResult,
  setReflection,
} from "@/lib/progress-store/store";
import type { QuizStat } from "@/lib/progress/schema";

const stat = (o: Partial<QuizStat> = {}): QuizStat => ({
  correct: 4,
  total: 5,
  attempts: 1,
  firstTry: true,
  bestMs: 8000,
  ...o,
});

describe("progress store", () => {
  it("hydrate seeds a fresh local state", () => {
    hydrate("NOVA");
    const s = getSnapshot();
    expect(s?.code).toBe("NOVA");
    expect(s?.done).toEqual([]);
  });

  it("recordQuizResult marks a hurdle done and records today + best-of", () => {
    hydrate("NOVA2");
    const newly = recordQuizResult("d1", stat(), true);
    expect(newly).toBe(true);
    const s = getSnapshot()!;
    expect(s.done).toContain("d1");
    expect(s.quiz.d1.correct).toBe(4);
    expect(s.days.length).toBe(1); // today recorded

    // Replaying an already-cleared hurdle returns false, keeps the best stat.
    const again = recordQuizResult("d1", stat({ correct: 5, attempts: 3, firstTry: false }), true);
    expect(again).toBe(false);
    const s2 = getSnapshot()!;
    expect(s2.quiz.d1.correct).toBe(5); // max
    expect(s2.quiz.d1.attempts).toBe(1); // min
    expect(s2.quiz.d1.firstTry).toBe(true); // sticky
  });

  it("setReflection stores private text on the snapshot", () => {
    hydrate("NOVA3");
    setReflection("d1-r0", "my private note");
    expect(getSnapshot()?.reflections["d1-r0"]).toBe("my private note");
  });
});
