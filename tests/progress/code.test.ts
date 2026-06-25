import { describe, expect, it } from "vitest";
import {
  CODE_SPACE,
  generateCode,
  isCanonicalCode,
  isValidCode,
  nextSuggestion,
  normalizeCode,
} from "@/lib/progress/code";

describe("code generation", () => {
  it("produces canonical XXX-XXX over the unambiguous alphabet", () => {
    const seq = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5];
    let i = 0;
    const code = generateCode(() => seq[i++ % seq.length]);
    expect(code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{3}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{3}$/);
    expect(isCanonicalCode(code)).toBe(true);
    expect(isValidCode(code)).toBe(true);
  });

  it("never emits ambiguous characters I L O 0 1", () => {
    for (let n = 0; n < 200; n++) {
      const code = generateCode();
      expect(code).not.toMatch(/[ILO01]/);
    }
  });

  it("reports the full canonical code space", () => {
    expect(CODE_SPACE).toBe(31 ** 6);
  });
});

describe("code validation", () => {
  it("accepts canonical and custom forms", () => {
    expect(isValidCode("BKJ-7PQ")).toBe(true);
    expect(isValidCode("ROBORAY")).toBe(true);
    expect(isValidCode("NOVA42")).toBe(true);
    expect(isValidCode("MY-AI-CODE")).toBe(true);
  });

  it("rejects bad shapes", () => {
    expect(isValidCode("ab")).toBe(false); // too short (and lower-case)
    expect(isValidCode("NO--VA")).toBe(false); // consecutive hyphens
    expect(isValidCode("-NOVA")).toBe(false); // leading hyphen
    expect(isValidCode("NOVA-")).toBe(false); // trailing hyphen
    expect(isValidCode(42)).toBe(false);
  });
});

describe("normalizeCode", () => {
  it("upper-cases and collapses spaces/underscores to hyphens", () => {
    expect(normalizeCode("my fav code")).toBe("MY-FAV-CODE");
    expect(normalizeCode("  nova42 ")).toBe("NOVA42");
    expect(normalizeCode("a_b_c")).toBe("A-B-C");
  });
  it("returns null for un-coercible input", () => {
    expect(normalizeCode("!!")).toBeNull();
    expect(normalizeCode("")).toBeNull();
    expect(normalizeCode("x".repeat(21))).toBeNull();
  });
});

describe("nextSuggestion", () => {
  it("increments a trailing digit run, preserving width until a carry", () => {
    expect(nextSuggestion("NOVA7")).toBe("NOVA8");
    expect(nextSuggestion("NOVA09")).toBe("NOVA10");
  });
  it("appends 1 when there is no trailing digit", () => {
    expect(nextSuggestion("NOVA")).toBe("NOVA1");
  });
  it("returns null when the suggestion would break length/format", () => {
    expect(nextSuggestion("X".repeat(20))).toBeNull();
  });
});
