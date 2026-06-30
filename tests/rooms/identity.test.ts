import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getLastCode,
  getResumeCode,
  rememberRoomCode,
  setLastCode,
} from "@/lib/rooms/client-identity";

/**
 * Regression: a player who joins solo and then joins a room must resume into
 * the ROOM on reopen — not get silently reverted to the earlier solo account
 * when a restored tab / bookmark / installed icon re-opens the solo page and
 * clobbers `lastCode`.
 */
function fakeLocalStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
  };
}

beforeEach(() => {
  (globalThis as unknown as { window: unknown }).window = { localStorage: fakeLocalStorage() };
});
afterEach(() => {
  delete (globalThis as Partial<typeof globalThis>).window;
});

describe("resume identity prefers the room", () => {
  it("solo-only player resumes their last solo code", () => {
    setLastCode("SOLOAAA");
    expect(getResumeCode()).toBe("SOLOAAA");
  });

  it("resumes the room code after joining, even if a solo page later clobbers lastCode", () => {
    setLastCode("SOLOAAA"); // played solo first
    rememberRoomCode("ROOM-01", "ROOMBBB"); // then joined a room
    expect(getResumeCode()).toBe("ROOMBBB");

    setLastCode("SOLOAAA"); // a stale solo tab/bookmark re-opens, clobbering lastCode
    expect(getLastCode()).toBe("SOLOAAA");
    expect(getResumeCode()).toBe("ROOMBBB"); // resume STILL returns the room
  });

  it("uses the most recently joined room", () => {
    rememberRoomCode("ROOM-01", "AAAAAA1");
    rememberRoomCode("ROOM-02", "BBBBBB2");
    expect(getResumeCode()).toBe("BBBBBB2");
  });

  it("falls back to lastCode when the active room's code mapping is missing", () => {
    (globalThis as unknown as { window: { localStorage: Storage } }).window.localStorage.setItem(
      "ksai:activeRoom",
      "ROOM-GONE",
    );
    setLastCode("FALLBACK1");
    expect(getResumeCode()).toBe("FALLBACK1");
  });
});
