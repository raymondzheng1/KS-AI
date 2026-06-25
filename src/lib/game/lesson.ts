/**
 * Pure lesson sequencing — turns a hurdle into an ordered list of focused
 * "slides" shown one at a time (the movie-like mini-lesson). Kept free of React
 * so it's unit-testable. The order: intro → goals → each key idea → videos →
 * each activity → reflect → key words → (facilitator slides) → wrap-up.
 */
import type { Hurdle } from "@/lib/content/schema";

export type Slide =
  | { kind: "intro" }
  | { kind: "objectives" }
  | { kind: "concept"; i: number }
  | { kind: "videos" }
  | { kind: "activity"; i: number }
  | { kind: "reflection" }
  | { kind: "vocab" }
  | { kind: "facilitator"; i: number }
  | { kind: "wrapup" };

export function buildSlides(h: Hurdle, facilitatorMode: boolean): Slide[] {
  const s: Slide[] = [{ kind: "intro" }];
  if (h.objectives.length) s.push({ kind: "objectives" });
  h.concepts.forEach((_, i) => s.push({ kind: "concept", i }));
  if (h.videos.length) s.push({ kind: "videos" });
  h.activities.forEach((_, i) => s.push({ kind: "activity", i }));
  if (h.reflection.length) s.push({ kind: "reflection" });
  if (h.vocab.length) s.push({ kind: "vocab" });
  if (facilitatorMode) h.facilitator.forEach((_, i) => s.push({ kind: "facilitator", i }));
  s.push({ kind: "wrapup" });
  return s;
}
