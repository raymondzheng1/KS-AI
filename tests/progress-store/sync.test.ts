import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regression: a push whose server echo is a no-op (the normal case — the server
 * returns exactly what we sent) must NOT prevent the NEXT mutation from syncing.
 *
 * The old code set a `suppressNextSchedule` flag before applying the echo, but
 * `applyRemoteState` no-ops (no emit) when nothing changed, so the flag was
 * never consumed — it lingered and silently ate the following hurdle clear's
 * push. Players' latest clears never reached the KV → 0/stale XP on the room
 * leaderboard.
 */
describe("progress sync — consecutive clears all reach the server", () => {
  let saves: { done: string[] }[] = [];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    saves = [];

    const winListeners: Record<string, Array<() => void>> = {};
    (globalThis as unknown as { window: unknown }).window = {
      addEventListener: (e: string, f: () => void) => {
        (winListeners[e] ||= []).push(f);
      },
    };
    (globalThis as unknown as { document: unknown }).document = {
      addEventListener: () => {},
      visibilityState: "visible",
    };
    (globalThis as unknown as { fetch: unknown }).fetch = vi.fn(
      async (url: string, opts?: { body?: string }) => {
        if (String(url).includes("/api/progress/load")) {
          return { ok: true, json: async () => ({ done: [], quiz: {}, days: [] }) };
        }
        // save → echo the posted state back (server merge of empty + posted = posted)
        const body = JSON.parse(opts!.body!);
        saves.push(body.state);
        return { ok: true, json: async () => body.state };
      },
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as Partial<typeof globalThis>).window;
    delete (globalThis as Partial<typeof globalThis>).document;
    delete (globalThis as Partial<typeof globalThis>).fetch;
  });

  it("syncs the second clear even after the first push's no-op echo", async () => {
    const store = await import("@/lib/progress-store/store");
    const sync = await import("@/lib/progress-store/sync");
    const stat = { correct: 5, total: 5, attempts: 1, firstTry: true, bestMs: 1000 };

    store.hydrate("AAA-BBB");
    sync.installRemoteSync();

    store.recordQuizResult("d1", stat, true);
    await vi.advanceTimersByTimeAsync(1600); // push #1 fires; echo == local → no-op

    store.recordQuizResult("d2", stat, true);
    await vi.advanceTimersByTimeAsync(1600); // push #2 must ALSO fire (the bug ate this)

    expect(saves.length).toBeGreaterThanOrEqual(2);
    expect(saves[saves.length - 1].done).toEqual(["d1", "d2"]);
  });
});
