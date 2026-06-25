import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST as checkCode } from "@/app/api/code/check/route";
import { MemoryKv, __setKvForTests } from "@/lib/server/kv";
import { DenyAllLimiter, MemoryRateLimiter, __setLimiterForTests } from "@/lib/server/ratelimit";

function post(body: unknown) {
  return new Request("http://t/api/code/check", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

let kv: MemoryKv;
beforeEach(() => {
  kv = new MemoryKv();
  __setKvForTests(kv);
  __setLimiterForTests("codecheck", new MemoryRateLimiter(1000, 60_000));
});
afterEach(() => {
  __setKvForTests(null);
  __setLimiterForTests("codecheck", null);
});

describe("POST /api/code/check", () => {
  it("returns available for a free code, normalised to upper-case", async () => {
    const res = await checkCode(post({ requested: "roboray" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "available", code: "ROBORAY" });
  });

  it("suggests the next free variant when a profile already holds the code", async () => {
    await kv.set("profile:NOVA", {
      code: "NOVA",
      nick: "Nova",
      roomId: "",
      avatar: "🙂",
      joinedAt: "2026-06-25T00:00:00.000Z",
    });
    const j = await (await checkCode(post({ requested: "NOVA" }))).json();
    expect(j).toEqual({ status: "suggested", code: "NOVA1", requested: "NOVA" });
  });

  it("treats an existing progress row as taken too", async () => {
    await kv.set("progress:TIGER", { done: ["d1"], quiz: {}, days: [] });
    const j = await (await checkCode(post({ requested: "TIGER" }))).json();
    expect(j).toEqual({ status: "suggested", code: "TIGER1", requested: "TIGER" });
  });

  it("skips consecutive taken variants to the first free one", async () => {
    await kv.set("profile:CAT", { code: "CAT", nick: "a", roomId: "", avatar: "🐱", joinedAt: "x" });
    await kv.set("progress:CAT1", { done: [], quiz: {}, days: [] });
    const j = await (await checkCode(post({ requested: "cat" }))).json();
    expect(j).toEqual({ status: "suggested", code: "CAT2", requested: "CAT" });
  });

  it("rejects an un-normalisable code with 400", async () => {
    expect((await checkCode(post({ requested: "!!" }))).status).toBe(400);
    expect((await checkCode(post({ requested: "ab" }))).status).toBe(400); // too short
  });

  it("rejects a malformed body with 400", async () => {
    expect((await checkCode(post({}))).status).toBe(400);
  });

  it("fails closed under the rate limiter", async () => {
    __setLimiterForTests("codecheck", new DenyAllLimiter());
    expect((await checkCode(post({ requested: "ROBORAY" }))).status).toBe(429);
  });
});
