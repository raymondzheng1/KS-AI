import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getLastCode,
  getRoomCode,
  rememberRoomCode,
  setLastCode,
} from "@/lib/rooms/client-identity";

/**
 * Resume follows the genuinely last-used code (the latest status), not a
 * hard-coded preference. The `/play` route and the "Continue" affordances read
 * this, so a saved bookmark / installed icon follows the player's latest code
 * instead of an earlier one it was saved against.
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

describe("resume follows the latest code", () => {
  it("getLastCode returns the most recently set code", () => {
    setLastCode("AAA-AAA");
    expect(getLastCode()).toBe("AAA-AAA");
    setLastCode("BBB-BBB");
    expect(getLastCode()).toBe("BBB-BBB");
  });

  it("joining a room makes the room code the latest", () => {
    setLastCode("SOLOAAA"); // played solo first
    rememberRoomCode("ROOM-01", "ROOMBBB"); // then joined a room
    expect(getLastCode()).toBe("ROOMBBB");
    // …and opening the solo page again makes solo the latest (user's choice)
    setLastCode("SOLOAAA");
    expect(getLastCode()).toBe("SOLOAAA");
  });

  it("keeps the room→code mapping for the room board", () => {
    rememberRoomCode("ROOM-09", "CCC-CCC");
    expect(getRoomCode("ROOM-09")).toBe("CCC-CCC");
  });

  it("returns null on a fresh device (no code yet)", () => {
    expect(getLastCode()).toBeNull();
  });
});
