import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Drift-defence (Harness §4.3): facilitator-only content (schedules, answer
 * keys, run guides) must NEVER render for students. Two layers, both pinned:
 *   1. buildSlides only emits facilitator slides in facilitator mode — proven
 *      behaviourally in tests/game/lesson.test.ts.
 *   2. The lesson's facilitator render sites carry an inline `facilitatorMode &&`
 *      guard (defense-in-depth) — pinned here against the source.
 */
const SRC = readFileSync(
  resolve(__dirname, "../../src/components/game/HurdleLesson.tsx"),
  "utf8",
);

describe("facilitator content is gated (HurdleLesson)", () => {
  it("accepts a facilitatorMode prop", () => {
    expect(SRC).toMatch(/facilitatorMode\s*:\s*boolean/);
  });

  it("inline-guards both facilitator render sites", () => {
    expect(SRC).toContain("facilitatorMode && activity.facilitator.length");
    expect(SRC).toMatch(/cur\.kind === "facilitator" && facilitatorMode/);
  });

  it("has exactly the known .facilitator access sites (tripwire on new ones)", () => {
    // hurdle.facilitator[cur.i], activity.facilitator.length, activity.facilitator.map
    const refs = [...SRC.matchAll(/(hurdle|activity)\.facilitator/g)];
    expect(refs.length).toBe(3);
  });
});
