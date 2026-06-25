import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  GLOSSARY,
  HURDLES,
  HURDLE_COUNT,
  HURDLE_IDS,
  TOOLS,
  hurdleById,
  nextHurdleId,
} from "@/lib/content";

const PUBLIC = resolve(__dirname, "../../public");

describe("content corpus — all 10 hurdles", () => {
  it("loads exactly 10 hurdles, ids d1..d10 in order", () => {
    expect(HURDLE_COUNT).toBe(10);
    expect(HURDLE_IDS).toEqual([
      "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10",
    ]);
    HURDLES.forEach((h, i) => expect(h.day).toBe(i + 1));
  });

  it("every hurdle has a non-empty title, overview, and a gate quiz of >= 3", () => {
    for (const h of HURDLES) {
      expect(h.title.length).toBeGreaterThan(0);
      expect(h.overview.length).toBeGreaterThan(0);
      expect(h.quiz.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every gate-quiz answer index is in range, tf uses True/False", () => {
    for (const h of HURDLES) {
      for (const q of h.quiz) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
        if (q.type === "tf") expect(q.options).toEqual(["True", "False"]);
      }
    }
  });

  it("every referenced diagram exists in public/diagrams", () => {
    for (const h of HURDLES) {
      if (!h.diagram) continue;
      const p = resolve(PUBLIC, h.diagram.src.replace(/^\//, ""));
      expect(existsSync(p), `${h.id} diagram missing: ${h.diagram.src}`).toBe(true);
    }
  });

  it("every video has a valid 11-char YouTube id", () => {
    for (const h of HURDLES) {
      for (const v of h.videos) {
        expect(v.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      }
    }
  });
});

describe("unlock chain helpers", () => {
  it("nextHurdleId walks d1→d10 then null", () => {
    expect(nextHurdleId("d1")).toBe("d2");
    expect(nextHurdleId("d9")).toBe("d10");
    expect(nextHurdleId("d10")).toBeNull();
    expect(nextHurdleId("nope")).toBeNull();
  });
  it("hurdleById resolves", () => {
    expect(hurdleById("d5")?.day).toBe(5);
    expect(hurdleById("zzz")).toBeUndefined();
  });
});

describe("tools + glossary", () => {
  it("has 8 tools with unique ids and real https links", () => {
    expect(TOOLS.length).toBe(8);
    expect(new Set(TOOLS.map((t) => t.id)).size).toBe(8);
    for (const t of TOOLS) {
      for (const l of t.links) expect(l.url).toMatch(/^https:\/\//);
    }
  });
  it("glossary is non-empty and alphabetically sorted", () => {
    expect(GLOSSARY.length).toBeGreaterThan(20);
    const terms = GLOSSARY.map((g) => g.term.toLowerCase());
    expect([...terms].sort((a, b) => a.localeCompare(b))).toEqual(terms);
  });
});
