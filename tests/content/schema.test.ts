import { describe, expect, it } from "vitest";
import { HurdleSchema } from "@/lib/content/schema";
import d1 from "@/lib/content/generated/d1.json";

describe("content schema — Day 1 gold reference", () => {
  it("d1.json validates against HurdleSchema", () => {
    const parsed = HurdleSchema.safeParse(d1);
    if (!parsed.success) {
      throw new Error(JSON.stringify(parsed.error.issues, null, 2));
    }
    expect(parsed.success).toBe(true);
  });

  it("has a gate quiz of at least 3 questions with valid answer indices", () => {
    const h = HurdleSchema.parse(d1);
    expect(h.quiz.length).toBeGreaterThanOrEqual(3);
    for (const q of h.quiz) {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
    }
  });
});
