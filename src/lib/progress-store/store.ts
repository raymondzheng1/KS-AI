/**
 * Client progress store — an in-memory snapshot + a mutation funnel. Every
 * mutation updates the snapshot immutably, persists to localStorage, notifies
 * subscribers (React + the sync layer), and records today's engagement day.
 *
 * The store is the single place state changes; the sync layer subscribes and
 * debounces a push to the server (see ./sync).
 */
import { mergeSynced, toSynced } from "@/lib/progress/merge";
import {
  type LocalState,
  type QuizStat,
  type SyncedState,
} from "@/lib/progress/schema";
import { todayKey } from "@/lib/time";
import { loadOrInit, saveLocal } from "./storage";

let snapshot: LocalState | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const l of listeners) l();
}

function commit(next: LocalState): void {
  snapshot = next;
  saveLocal(next);
  emit();
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot(): LocalState | null {
  return snapshot;
}

/** Load (or create) the player's state into the store. */
export function hydrate(
  code: string,
  opts?: { nick?: string; roomId?: string },
): LocalState {
  const next = loadOrInit(code, opts);
  commit(next);
  return next;
}

function withToday(state: LocalState): LocalState {
  const t = todayKey();
  return state.days.includes(t) ? state : { ...state, days: [...state.days, t] };
}

/* ---- Mutations ---- */

export function markSeen(): void {
  if (!snapshot || snapshot.seen) return;
  commit({ ...snapshot, seen: true });
}

/** Update the cached display profile (nick/room). Local-only — never synced. */
export function setProfile(nick?: string, roomId?: string): void {
  if (!snapshot) return;
  const nextNick = nick ?? snapshot.nick;
  const nextRoom = roomId ?? snapshot.roomId;
  if (nextNick === snapshot.nick && nextRoom === snapshot.roomId) return;
  commit({ ...snapshot, nick: nextNick, roomId: nextRoom });
}

/** Record a gate-quiz result, best-of merging the stat and marking the hurdle
 *  done when passed. Returns whether this was a newly-cleared hurdle. */
export function recordQuizResult(
  hurdleId: string,
  stat: QuizStat,
  passed: boolean,
): boolean {
  if (!snapshot) return false;
  const prev = snapshot.quiz[hurdleId];
  const best: QuizStat = prev
    ? {
        correct: Math.max(prev.correct, stat.correct),
        total: Math.max(prev.total, stat.total),
        attempts: Math.min(prev.attempts, stat.attempts),
        firstTry: prev.firstTry || stat.firstTry,
        bestMs:
          prev.bestMs > 0 && stat.bestMs > 0
            ? Math.min(prev.bestMs, stat.bestMs)
            : Math.max(prev.bestMs, stat.bestMs),
      }
    : stat;

  const alreadyDone = snapshot.done.includes(hurdleId);
  const done =
    passed && !alreadyDone ? [...snapshot.done, hurdleId] : snapshot.done;

  commit(
    withToday({
      ...snapshot,
      quiz: { ...snapshot.quiz, [hurdleId]: best },
      done,
    }),
  );
  return passed && !alreadyDone;
}

/** Record a private reflection answer (NEVER synced to the server). */
export function setReflection(promptId: string, text: string): void {
  if (!snapshot) return;
  commit({
    ...snapshot,
    reflections: { ...snapshot.reflections, [promptId]: text },
  });
}

/** Mark today's engagement (used when the game is opened). */
export function touchToday(): void {
  if (!snapshot) return;
  const next = withToday(snapshot);
  if (next !== snapshot) commit(next);
}

/** Merge a remote synced state into the local snapshot (sync pull/push echo). */
export function applyRemoteState(remote: SyncedState): void {
  if (!snapshot) return;
  const merged = mergeSynced(toSynced(snapshot), remote);
  // Only commit if something actually changed (avoid a sync feedback loop).
  const changed =
    merged.done.length !== snapshot.done.length ||
    merged.days.length !== snapshot.days.length ||
    JSON.stringify(merged.quiz) !== JSON.stringify(snapshot.quiz);
  if (!changed) return;
  commit({
    ...snapshot,
    done: merged.done,
    days: merged.days,
    quiz: merged.quiz,
  });
}
