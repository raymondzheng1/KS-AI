/**
 * Content schemas (Harness §3.3 SoT, §3.5 committed reference data).
 *
 * All programme content lives as committed JSON under content/generated/,
 * validated by these Zod schemas at import time (content drift fails loudly at
 * module load). The two Word docs in reference/ are the source of truth; the
 * JSON is faithfully derived from them.
 *
 * Each content block carries an audience boundary: student-facing fields are
 * always rendered; facilitator-only material (schedules, answer keys, run
 * guides) renders only behind the passcode (?mode=facilitator).
 */
import { z } from "zod";

/** KidSmart accent token names (map to --color-ks-*). */
export const AccentSchema = z.enum([
  "blue",
  "green",
  "orange",
  "coral",
  "dark",
  "yellow",
]);
export type Accent = z.infer<typeof AccentSchema>;

/** A comparison/data table embedded in a concept or facilitator block. */
export const ContentTableSchema = z.object({
  caption: z.string().optional(),
  columns: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())).min(1),
});
export type ContentTable = z.infer<typeof ContentTableSchema>;

/** One key concept: a heading, prose paragraphs, and an optional table/callout. */
export const ConceptSchema = z.object({
  heading: z.string(),
  body: z.array(z.string()).default([]),
  /** Bulleted points (e.g. the AI family-tree levels). */
  bullets: z.array(z.string()).default([]),
  table: ContentTableSchema.optional(),
  /** A highlighted "key insight" callout. */
  callout: z
    .object({ kind: z.enum(["insight", "warning", "rule"]).default("insight"), text: z.array(z.string()) })
    .optional(),
});
export type Concept = z.infer<typeof ConceptSchema>;

/** A curated, vetted lesson video (embedded via youtube-nocookie, click-to-load). */
export const VideoSchema = z.object({
  title: z.string(),
  source: z.string(), // "TED-Ed", "Google", etc.
  /** 11-char YouTube id, extracted from the source URL. */
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  minutes: z.number().int().positive().optional(),
  note: z.string().optional(),
});
export type Video = z.infer<typeof VideoSchema>;

/** An in-lesson activity. Facilitator instructions are audience-gated. */
export const ActivitySchema = z.object({
  name: z.string(),
  kind: z.enum(["worksheet", "game", "discussion", "build", "demo"]).default("worksheet"),
  /** Optional id of an in-app interactive widget rendered for this activity
   *  (e.g. "human-sorting", "teachable-machine-recorder"). */
  interactive: z.string().optional(),
  /** Student-facing intro/instructions (always shown). */
  intro: z.array(z.string()).default([]),
  /** Student worksheet steps / prompts (always shown). */
  steps: z.array(z.string()).default([]),
  /** Optional embedded table (e.g. data-collection grid). */
  table: ContentTableSchema.optional(),
  /** Facilitator-only run instructions (gated). */
  facilitator: z.array(z.string()).default([]),
});
export type Activity = z.infer<typeof ActivitySchema>;

export const VocabTermSchema = z.object({
  term: z.string(),
  definition: z.string(),
});
export type VocabTerm = z.infer<typeof VocabTermSchema>;

/** A gate-quiz question. Passing the gate quiz unlocks the next hurdle. */
export const QuizQuestionSchema = z.object({
  /** mcq: pick one of options; tf: options are ["True","False"]. */
  type: z.enum(["mcq", "tf"]).default("mcq"),
  q: z.string(),
  options: z.array(z.string()).min(2).max(4),
  /** Index into options of the correct answer. */
  answer: z.number().int().nonnegative(),
  /** Shown after answering — the "why". */
  explain: z.string(),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

/** Facilitator-only block (schedule, run guide, answer key, rubric). */
export const FacilitatorBlockSchema = z.object({
  heading: z.string(),
  kind: z.enum(["schedule", "guide", "cases", "rubric", "checklist"]).default("guide"),
  body: z.array(z.string()).default([]),
  table: ContentTableSchema.optional(),
});
export type FacilitatorBlock = z.infer<typeof FacilitatorBlockSchema>;

/** A reference to one of the committed diagram PNGs in public/diagrams. */
export const DiagramSchema = z.object({
  src: z.string().regex(/^\/diagrams\/[\w-]+\.png$/),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type Diagram = z.infer<typeof DiagramSchema>;

/** One hurdle = one day of the programme. */
export const HurdleSchema = z.object({
  id: z.string().regex(/^d([1-9]|10)$/),
  day: z.number().int().min(1).max(10),
  title: z.string(),
  subtitle: z.string(),
  icon: z.string().min(1),
  accent: AccentSchema,
  diagram: DiagramSchema.optional(),
  overview: z.array(z.string()).min(1),
  objectives: z.array(z.string()).default([]),
  concepts: z.array(ConceptSchema).default([]),
  videos: z.array(VideoSchema).default([]),
  activities: z.array(ActivitySchema).default([]),
  reflection: z.array(z.string()).default([]),
  vocab: z.array(VocabTermSchema).default([]),
  /** Gate quiz — must pass to unlock the next hurdle. */
  quiz: z.array(QuizQuestionSchema).min(3),
  facilitator: z.array(FacilitatorBlockSchema).default([]),
});
export type Hurdle = z.infer<typeof HurdleSchema>;

/** An AI tool from the toolkit chapter. */
export const ToolSchema = z.object({
  id: z.string(),
  n: z.number().int().positive(),
  name: z.string(),
  vendor: z.string().optional(),
  icon: z.string().min(1),
  whatItIs: z.array(z.string()).min(1),
  usage: z.array(z.string()).default([]),
  bestPractices: z.array(z.string()).default([]),
  links: z
    .array(z.object({ label: z.string(), url: z.string().url() }))
    .default([]),
});
export type Tool = z.infer<typeof ToolSchema>;

export const GlossaryTermSchema = z.object({
  term: z.string(),
  definition: z.string(),
});
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;

/* ---- Array parsers (used by the content index to validate at import) ---- */
export const HurdlesSchema = z.array(HurdleSchema);
export const ToolsSchema = z.array(ToolSchema);
export const GlossarySchema = z.array(GlossaryTermSchema);
