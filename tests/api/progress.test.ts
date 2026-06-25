import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/progress/load/route";
import { POST } from "@/app/api/progress/save/route";
import { MemoryKv, __setKvForTests } from "@/lib/server/kv";
import { MemoryRateLimiter, __setLimiterForTests } from "@/lib/server/ratelimit";
import type { SyncedState } from "@/lib/progress/schema";

function loadReq(code: string) {
  return new Request(`http://t/api/progress/load?code=${encodeURIComponent(code)}`);
}
function saveReq(body: unknown) {
  return new Request("http://t/api/progress/save", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  __setKvForTests(new MemoryKv());
  __setLimiterForTests("save", new MemoryRateLimiter(1000, 60_000));
});
afterEach(() => {
  __setKvForTests(null);
  __setLimiterForTests("save", null);
});

const stateA: SyncedState = {
  done: ["d1"],
  days: ["2026-06-01"],
  quiz: { d1: { correct: 4, total: 5, attempts: 2, firstTry: false, bestMs: 9000 } },
};

describe("/api/progress save + load", () => {
  it("saves then loads the merged state", async () => {
    const save = await POST(saveReq({ code: "NOVA", state: stateA }));
    expect(save.status).toBe(200);

    const load = await GET(loadReq("NOVA"));
    const body = (await load.json()) as SyncedState;
    expect(body.done).toEqual(["d1"]);
    expect(body.quiz.d1.correct).toBe(4);
  });

  it("monotone-merges — a shrunk client payload cannot remove progress", async () => {
    await POST(saveReq({ code: "NOVA", state: { done: ["d1", "d2"], days: [], quiz: {} } }));
    // Malicious/stale client tries to roll back to just d1.
    await POST(saveReq({ code: "NOVA", state: { done: ["d1"], days: [], quiz: {} } }));
    const load = await GET(loadReq("NOVA"));
    const body = (await load.json()) as SyncedState;
    expect(body.done.sort()).toEqual(["d1", "d2"]);
  });

  it("rejects a bad code", async () => {
    const res = await POST(saveReq({ code: "!!", state: stateA }));
    expect(res.status).toBe(400);
  });

  it("load returns empty state for an unknown code", async () => {
    const res = await GET(loadReq("GHOST"));
    const body = (await res.json()) as SyncedState;
    expect(body).toEqual({ done: [], days: [], quiz: {} });
  });
});
