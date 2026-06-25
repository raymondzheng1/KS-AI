/**
 * Progress-state schemas (Harness §3.5, §18).
 *
 * Two layers, deliberately split:
 *
 *  - SyncedState — the *monotone* subset mirrored to the KV row under the
 *    player's code (`progress:<code>`). Every field only ever GROWS or moves
 *    toward "better", so the cross-device merge is conflict-free (see
 *    ./merge). Everything the leaderboard needs to compute XP lives here.
 *
 *  - LocalState — what lives in localStorage: SyncedState PLUS device-only
 *    fields the server must never see:
 *      `code`        — the player's credential
 *      `nick`/`roomId` — cached from the profile row for display
 *      `seen`        — onboarding shown? (UX preference)
 *      `reflections` — private free-text (reflection prompts, letter to future
 *                      self) — kids' writing, NEVER synced (mirrors the
 *                      Philosophy `think` rule).
 *
 * The split is enforced by `toSynced` in ./merge — the only code path that
 * sends data to the server.
 */
import { z } from "zod";
import { isValidCode } from "./code";

/* ---- Shared atoms ---- */
/** Hurdle ids are `d1`..`d10`. */
const HurdleIdSchema = z.string().regex(/^[a-z0-9_-]+$/);
/** Calendar day `YYYY-MM-DD`. */
const DateKeySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/* ---- Per-hurdle gate-quiz best-of stats ---- */
export const QuizStatSchema = z.object({
  /** Most correct answers the player has achieved on this gate quiz. */
  correct: z.number().int().nonnegative().default(0),
  /** Number of questions in the gate quiz (constant per hurdle). */
  total: z.number().int().nonnegative().default(0),
  /** Fewest attempts taken to pass (≥ 1 once cleared). */
  attempts: z.number().int().positive().default(1),
  /** Passed on the very first attempt with a perfect score. */
  firstTry: z.boolean().default(false),
  /** Fastest clear time in ms (0 = unknown). */
  bestMs: z.number().int().nonnegative().default(0),
});
export type QuizStat = z.infer<typeof QuizStatSchema>;

/* ---- Synced (server-side / cross-device) ---- */
export const SyncedStateSchema = z.object({
  /** Hurdle ids whose gate quiz has been cleared (monotone union). */
  done: z.array(HurdleIdSchema).default([]),
  /** Best-of gate-quiz stats, keyed by hurdle id. */
  quiz: z.record(HurdleIdSchema, QuizStatSchema).default({}),
  /** Calendar days the player engaged — drives the streak XP bonus. */
  days: z.array(DateKeySchema).default([]),
});
export type SyncedState = z.infer<typeof SyncedStateSchema>;

export const emptySynced = (): SyncedState => ({ done: [], quiz: {}, days: [] });

/* ---- Local-only fields (never synced) ---- */
export const LocalOnlySchema = z.object({
  /** The player's private code. The credential. */
  code: z.string().refine(isValidCode, "invalid code format"),
  /** Cached display nickname (source of truth is the profile KV row). */
  nick: z.string().default(""),
  /** Cached room id (source of truth is the profile KV row). */
  roomId: z.string().default(""),
  /** Has the player seen the onboarding modal? */
  seen: z.boolean().default(false),
  /**
   * Private free-text answers (reflection prompts, "letter to my future
   * self"), keyed by a prompt id. NEVER sent to the server.
   */
  reflections: z.record(z.string(), z.string()).default({}),
});
export type LocalOnly = z.infer<typeof LocalOnlySchema>;

/* ---- Composite (everything in localStorage) ---- */
export const LocalStateSchema = SyncedStateSchema.extend(LocalOnlySchema.shape);
export type LocalState = z.infer<typeof LocalStateSchema>;

export function newLocalState(
  code: string,
  opts?: { nick?: string; roomId?: string },
): LocalState {
  return {
    code,
    nick: opts?.nick ?? "",
    roomId: opts?.roomId ?? "",
    seen: false,
    reflections: {},
    done: [],
    quiz: {},
    days: [],
  };
}
