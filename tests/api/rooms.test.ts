import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST as createRoom } from "@/app/api/room/create/route";
import { POST as joinRoom } from "@/app/api/room/join/route";
import { GET as leaderboard } from "@/app/api/room/[id]/leaderboard/route";
import { POST as saveProgress } from "@/app/api/progress/save/route";
import { MemoryKv, __setKvForTests } from "@/lib/server/kv";
import { MemoryRateLimiter, __setLimiterForTests } from "@/lib/server/ratelimit";

function post(url: string, body: unknown) {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  __setKvForTests(new MemoryKv());
  __setLimiterForTests("room", new MemoryRateLimiter(1000, 60_000));
  __setLimiterForTests("save", new MemoryRateLimiter(1000, 60_000));
});
afterEach(() => {
  __setKvForTests(null);
  __setLimiterForTests("room", null);
  __setLimiterForTests("save", null);
});

async function lb(roomId: string, me?: string) {
  const url = `http://t/api/room/${roomId}/leaderboard${me ? `?me=${me}` : ""}`;
  const res = await leaderboard(new Request(url), { params: Promise.resolve({ id: roomId }) });
  return { status: res.status, body: await res.json() };
}

describe("room create + join + leaderboard", () => {
  it("creates a room, host is the first member", async () => {
    const res = await createRoom(post("http://t/api/room/create", { name: "Class A", nick: "RoboRay", avatar: "🤖" }));
    const j = await res.json();
    expect(res.status).toBe(200);
    expect(j.roomId).toBeTruthy();
    expect(j.code).toBeTruthy();

    const board = await lb(j.roomId, j.code);
    expect(board.status).toBe(200);
    expect(board.body.room.name).toBe("Class A");
    expect(board.body.rows).toHaveLength(1);
    expect(board.body.rows[0].nick).toBe("RoboRay");
    expect(board.body.rows[0].isMe).toBe(true);
  });

  it("ranks members by XP and never leaks player codes", async () => {
    const host = await (await createRoom(post("http://t/api/room/create", { name: "Class B", nick: "Host" }))).json();
    const joined = await (await joinRoom(post("http://t/api/room/join", { roomId: host.roomId, nick: "Nova" }))).json();

    // Nova clears two hurdles (more XP); host clears none.
    await saveProgress(
      post("http://t/api/progress/save", {
        code: joined.code,
        state: { done: ["d1", "d2"], days: ["2026-06-25"], quiz: { d1: { correct: 5, total: 5, attempts: 1, firstTry: true, bestMs: 7000 } } },
      }),
    );

    const board = await lb(host.roomId);
    expect(board.body.rows.map((r: { nick: string }) => r.nick)).toEqual(["Nova", "Host"]);
    expect(board.body.rows[0].rank).toBe(1);
    expect(board.body.rows[0].xp).toBeGreaterThan(0);
    // Codes must never appear in the public board.
    expect(JSON.stringify(board.body)).not.toContain(joined.code);
    expect(JSON.stringify(board.body)).not.toContain(host.code);
  });

  it("auto-suffixes a duplicate nickname within a room", async () => {
    const host = await (await createRoom(post("http://t/api/room/create", { name: "Dupes", nick: "Nova" }))).json();
    const second = await (await joinRoom(post("http://t/api/room/join", { roomId: host.roomId, nick: "Nova" }))).json();
    expect(second.nick).toBe("Nova2");
  });

  it("rejects a profane nickname and an unknown room", async () => {
    const bad = await createRoom(post("http://t/api/room/create", { name: "X", nick: "sh1t" }));
    expect(bad.status).toBe(400);
    const noRoom = await joinRoom(post("http://t/api/room/join", { roomId: "ZZZ-ZZZ", nick: "Nova" }));
    expect(noRoom.status).toBe(404);
  });
});
