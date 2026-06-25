/**
 * Conflict-free, lossless merge of two `SyncedState`s.
 *
 * Progress is **monotone** — players only ever gain cleared hurdles, engaged
 * days, and *better* quiz stats; nothing regresses. That makes the cross-
 * device merge provably lossless:
 *
 *   done  = union(a.done, b.done)
 *   days  = union(a.days, b.days)
 *   quiz  = per-hurdle best-of(a.quiz, b.quiz)
 *
 * Properties (pinned by tests/progress/merge.test.ts):
 *   - Idempotent:   merge(a, a) ≡ a
 *   - Commutative:  merge(a, b) ≡ merge(b, a)
 *   - Associative:  merge(merge(a, b), c) ≡ merge(a, merge(b, c))
 *   - Empty identity: merge(a, empty) ≡ a
 *
 * Output is sorted/normalised so deep-equality + serialisation are stable.
 */
import type { LocalState, QuizStat, SyncedState } from "./schema";

function unionSorted(a: readonly string[], b: readonly string[]): string[] {
  return Array.from(new Set([...a, ...b])).sort();
}

/** "Better" per field: more correct, fewer attempts, first-try sticky, faster. */
function bestQuiz(a: QuizStat, b: QuizStat): QuizStat {
  const minPositive = (x: number, y: number): number => {
    if (x <= 0) return y;
    if (y <= 0) return x;
    return Math.min(x, y);
  };
  return {
    correct: Math.max(a.correct, b.correct),
    total: Math.max(a.total, b.total),
    attempts: Math.min(a.attempts, b.attempts),
    firstTry: a.firstTry || b.firstTry,
    bestMs: minPositive(a.bestMs, b.bestMs),
  };
}

function mergeQuiz(
  a: Record<string, QuizStat>,
  b: Record<string, QuizStat>,
): Record<string, QuizStat> {
  const out: Record<string, QuizStat> = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)]).values()) {
    const av = a[id];
    const bv = b[id];
    out[id] = av && bv ? bestQuiz(av, bv) : (av ?? bv);
  }
  return out;
}

/** Conflict-free monotone merge. */
export function mergeSynced(a: SyncedState, b: SyncedState): SyncedState {
  return {
    done: unionSorted(a.done, b.done),
    days: unionSorted(a.days, b.days),
    quiz: mergeQuiz(a.quiz, b.quiz),
  };
}

/** Extract the synced subset from a LocalState — drops every device-only field
 *  (`code`, `nick`, `roomId`, `seen`, `reflections`). */
export function toSynced(local: LocalState): SyncedState {
  return {
    done: [...local.done],
    days: [...local.days],
    quiz: { ...local.quiz },
  };
}

/** Apply a freshly-fetched remote synced state to local, monotone-merging the
 *  shared subset. Local-only fields are kept untouched. */
export function applyRemote(local: LocalState, remote: SyncedState): LocalState {
  const merged = mergeSynced(toSynced(local), remote);
  return { ...local, done: merged.done, days: merged.days, quiz: merged.quiz };
}
