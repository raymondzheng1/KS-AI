"use client";

/**
 * Tiny client-side map of which player code belongs to which room, so the room
 * page can find "my code" without ever putting a code in a shareable URL.
 */
const ROOM_CODE = (roomId: string) => `ksai:room:${roomId}`;
const LAST_CODE = "ksai:lastCode";

export function rememberRoomCode(roomId: string, code: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ROOM_CODE(roomId), code);
    window.localStorage.setItem(LAST_CODE, code);
  } catch {
    /* storage disabled — non-fatal */
  }
}

export function getRoomCode(roomId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ROOM_CODE(roomId));
  } catch {
    return null;
  }
}

export function setLastCode(code: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_CODE, code);
  } catch {
    /* non-fatal */
  }
}

/** The most recently used code on this device — the latest status. `/play` and
 *  the "Continue" affordances resume this so a saved bookmark / installed icon
 *  follows the player's latest code instead of freezing an earlier one. */
export function getLastCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_CODE);
  } catch {
    return null;
  }
}
