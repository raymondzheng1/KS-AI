import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Drift-defence (Harness §4.3): facilitator-only content (schedules, answer
 * keys, run guides) must NEVER render for students. HurdleView renders
 * `.facilitator` data only inside `facilitatorMode && …` blocks. This test
 * pins (a) the exact set of facilitator render sites — so adding a NEW one
 * trips the count and forces re-examination — and (b) that the existing two
 * blocks carry their explicit guard.
 */
const SRC = readFileSync(
  resolve(__dirname, "../../src/components/game/HurdleView.tsx"),
  "utf8",
);

describe("facilitator content is gated", () => {
  it("HurdleView accepts a facilitatorMode prop", () => {
    expect(SRC).toMatch(/facilitatorMode\s*:\s*boolean/);
  });

  it("has exactly the known facilitator render sites (tripwire on new ones)", () => {
    // activity.facilitator.length, activity.facilitator.map, hurdle.facilitator.map
    const refs = [...SRC.matchAll(/(activity|hurdle)\.facilitator\.(map|length)/g)];
    expect(refs.length).toBe(3);
  });

  it("guards both facilitator blocks with facilitatorMode", () => {
    expect(SRC).toContain("facilitatorMode && activity.facilitator.length");
    expect(SRC).toMatch(/facilitatorMode &&\s*\n\s*hurdle\.facilitator\.map/);
  });
});
