/**
 * localStorage persistence for a player's LocalState, keyed by code. The
 * working store is offline-first; the KV is the cross-device sync source.
 */
import {
  LocalStateSchema,
  newLocalState,
  type LocalState,
} from "@/lib/progress/schema";

const KEY = (code: string) => `ksai:progress:${code}`;

export function loadLocal(code: string): LocalState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY(code));
    if (!raw) return null;
    const parsed = LocalStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveLocal(state: LocalState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY(state.code), JSON.stringify(state));
  } catch {
    // storage full / disabled — the in-memory snapshot still works this session.
  }
}

/** Load existing local state for `code`, or a fresh one seeded with profile. */
export function loadOrInit(
  code: string,
  opts?: { nick?: string; roomId?: string },
): LocalState {
  const existing = loadLocal(code);
  if (existing) {
    // Refresh cached profile fields if newer ones were provided (e.g. on join).
    return {
      ...existing,
      nick: opts?.nick ?? existing.nick,
      roomId: opts?.roomId ?? existing.roomId,
    };
  }
  return newLocalState(code, opts);
}
