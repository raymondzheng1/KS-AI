/**
 * Public content API. Imports the committed JSON and validates it against the
 * Zod schemas at module load — content drift fails loudly here, not in the UI
 * (Harness §3.5). Everything downstream imports typed data from this module.
 */
import {
  GlossarySchema,
  HurdleSchema,
  ToolsSchema,
  type GlossaryTerm,
  type Hurdle,
  type Tool,
} from "./schema";

import d1 from "./generated/d1.json";
import d2 from "./generated/d2.json";
import d3 from "./generated/d3.json";
import d4 from "./generated/d4.json";
import d5 from "./generated/d5.json";
import d6 from "./generated/d6.json";
import d7 from "./generated/d7.json";
import d8 from "./generated/d8.json";
import d9 from "./generated/d9.json";
import d10 from "./generated/d10.json";
import toolsRaw from "./generated/tools.json";
import glossaryRaw from "./generated/glossary.json";

const RAW_HURDLES = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10];

/** Parse one hurdle, throwing a file-named error on schema drift. */
function parseHurdle(raw: unknown, label: string): Hurdle {
  const parsed = HurdleSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Content drift in hurdle ${label}: ${JSON.stringify(parsed.error.issues, null, 2)}`,
    );
  }
  return parsed.data;
}

/** All ten hurdles, validated, sorted by day. */
export const HURDLES: readonly Hurdle[] = RAW_HURDLES.map((h, i) =>
  parseHurdle(h, `index ${i} (d${i + 1})`),
).sort((a, b) => a.day - b.day);

export const HURDLE_COUNT = HURDLES.length;

/** Ordered hurdle ids — the canonical unlock chain (`d1`..`d10`). */
export const HURDLE_IDS: readonly string[] = HURDLES.map((h) => h.id);

export const TOOLS: readonly Tool[] = ToolsSchema.parse(toolsRaw);

export const GLOSSARY: readonly GlossaryTerm[] = GlossarySchema.parse(glossaryRaw).sort(
  (a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()),
);

/* ---- Lookups ---- */
export function hurdleById(id: string): Hurdle | undefined {
  return HURDLES.find((h) => h.id === id);
}

export function hurdleByDay(day: number): Hurdle | undefined {
  return HURDLES.find((h) => h.day === day);
}

/** The id that follows `id` in the unlock chain, or null at the end. */
export function nextHurdleId(id: string): string | null {
  const i = HURDLE_IDS.indexOf(id);
  if (i < 0 || i === HURDLE_IDS.length - 1) return null;
  return HURDLE_IDS[i + 1];
}

export function toolById(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}

export type { Hurdle, Tool, GlossaryTerm };
