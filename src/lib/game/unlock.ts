/**
 * Sequential unlock rules (pure, testable). A hurdle is available only once the
 * previous one is cleared — "clear before next" (the core game gate).
 */
import { HURDLE_IDS } from "@/lib/content";

export type HurdleStatus = "done" | "available" | "locked";

/** Status of one hurdle given the list of cleared hurdle ids. */
export function hurdleStatus(id: string, done: readonly string[]): HurdleStatus {
  const i = HURDLE_IDS.indexOf(id);
  if (i < 0) return "locked";
  if (done.includes(id)) return "done";
  if (i === 0) return "available";
  return done.includes(HURDLE_IDS[i - 1]) ? "available" : "locked";
}

/** The first not-yet-cleared hurdle in the chain — the player's "next" step. */
export function firstAvailable(done: readonly string[]): string {
  for (const id of HURDLE_IDS) {
    if (!done.includes(id)) return id;
  }
  return HURDLE_IDS[HURDLE_IDS.length - 1];
}

/** How many hurdles are cleared (for progress display). */
export function clearedCount(done: readonly string[]): number {
  return HURDLE_IDS.filter((id) => done.includes(id)).length;
}

/** True once every hurdle is cleared. */
export function allCleared(done: readonly string[]): boolean {
  return HURDLE_IDS.every((id) => done.includes(id));
}
