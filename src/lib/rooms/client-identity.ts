"use client";

/**
 * Tiny client-side map of which player code belongs to which room, so the room
 * page can find "my code" without ever putting a code in a shareable URL.
 */
const ROOM_CODE = (roomId: string) => `ksai:room:${roomId}`;
const LAST_CODE = "ksai:lastCode";
const ACTIVE_ROOM = "ksai:activeRoom";

export function rememberRoomCode(roomId: string, code: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ROOM_CODE(roomId), code);
    window.localStorage.setItem(LAST_CODE, code);
    // Joining/creating a room is a deliberate "play with others" choice — make
    // it the active identity so resume returns here, not to an earlier solo
    // account that a stale tab / bookmark / PWA icon might re-open.
    window.localStorage.setItem(ACTIVE_ROOM, roomId);
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

/** The most recently played code on this device, so we can offer "Continue"
 *  without the player having to remember/retype their code. */
export function getLastCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_CODE);
  } catch {
    return null;
  }
}

/**
 * The code "Continue" should resume. Prefers the active room's code over the
 * bare last-opened code: once a player joins a room, reopening the app returns
 * them to the room (where their friends are), not to an earlier solo account
 * that a restored tab / bookmark / installed icon may have re-opened and thus
 * clobbered `lastCode`. Falls back to `lastCode` for solo-only players.
 */
export function getResumeCode(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const roomId = window.localStorage.getItem(ACTIVE_ROOM);
    if (roomId) {
      const roomCode = window.localStorage.getItem(ROOM_CODE(roomId));
      if (roomCode) return roomCode;
    }
    return window.localStorage.getItem(LAST_CODE);
  } catch {
    return null;
  }
}
