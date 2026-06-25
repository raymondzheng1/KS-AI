import { describe, expect, it } from "vitest";
import { buildSlides } from "@/lib/game/lesson";
import { hurdleById } from "@/lib/content";

const d1 = hurdleById("d1")!;

describe("buildSlides — paced lesson sequence", () => {
  it("starts with intro and ends with wrapup", () => {
    const slides = buildSlides(d1, false);
    expect(slides[0].kind).toBe("intro");
    expect(slides[slides.length - 1].kind).toBe("wrapup");
  });

  it("gives each concept its own slide", () => {
    const conceptSlides = buildSlides(d1, false).filter((s) => s.kind === "concept");
    expect(conceptSlides.length).toBe(d1.concepts.length);
    expect(d1.concepts.length).toBeGreaterThan(1);
  });

  it("includes objectives + videos slides when present", () => {
    const kinds = buildSlides(d1, false).map((s) => s.kind);
    expect(kinds).toContain("objectives");
    expect(kinds).toContain("videos");
  });

  it("includes NO facilitator slides for students", () => {
    const slides = buildSlides(d1, false);
    expect(slides.some((s) => s.kind === "facilitator")).toBe(false);
  });

  it("adds facilitator slides only in facilitator mode", () => {
    const student = buildSlides(d1, false);
    const facil = buildSlides(d1, true);
    const facilCount = facil.filter((s) => s.kind === "facilitator").length;
    expect(facilCount).toBe(d1.facilitator.length);
    expect(facil.length).toBe(student.length + facilCount);
  });
});
