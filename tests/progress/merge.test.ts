import { describe, expect, it } from "vitest";
import { applyRemote, mergeSynced, toSynced } from "@/lib/progress/merge";
import {
  emptySynced,
  newLocalState,
  type SyncedState,
} from "@/lib/progress/schema";

const A: SyncedState = {
  done: ["d2", "d1"],
  days: ["2026-06-02", "2026-06-01"],
  quiz: {
    d1: { correct: 3, total: 4, attempts: 2, firstTry: false, bestMs: 9000 },
  },
};
const B: SyncedState = {
  done: ["d3", "d1"],
  days: ["2026-06-03"],
  quiz: {
    d1: { correct: 4, total: 4, attempts: 1, firstTry: true, bestMs: 7000 },
    d3: { correct: 2, total: 3, attempts: 1, firstTry: true, bestMs: 5000 },
  },
};

describe("mergeSynced — monotone, conflict-free", () => {
  it("unions done + days, sorted", () => {
    const m = mergeSynced(A, B);
    expect(m.done).toEqual(["d1", "d2", "d3"]);
    expect(m.days).toEqual(["2026-06-01", "2026-06-02", "2026-06-03"]);
  });

  it("keeps the BEST quiz stat per hurdle", () => {
    const m = mergeSynced(A, B);
    expect(m.quiz.d1).toEqual({
      correct: 4, // max
      total: 4,
      attempts: 1, // min
      firstTry: true, // OR
      bestMs: 7000, // min positive
    });
    expect(m.quiz.d3).toEqual(B.quiz.d3);
  });

  it("is idempotent", () => {
    expect(mergeSynced(A, A)).toEqual(mergeSynced(A, emptySynced()));
  });

  it("is commutative", () => {
    expect(mergeSynced(A, B)).toEqual(mergeSynced(B, A));
  });

  it("is associative", () => {
    const C: SyncedState = { done: ["d4"], days: ["2026-06-04"], quiz: {} };
    expect(mergeSynced(mergeSynced(A, B), C)).toEqual(mergeSynced(A, mergeSynced(B, C)));
  });

  it("has empty as identity", () => {
    expect(mergeSynced(A, emptySynced())).toEqual({
      done: ["d1", "d2"],
      days: ["2026-06-01", "2026-06-02"],
      quiz: A.quiz,
    });
  });
});

describe("toSynced / applyRemote — local-only fields never leak", () => {
  it("toSynced drops code/nick/roomId/seen/reflections", () => {
    const local = {
      ...newLocalState("NOVA"),
      done: ["d1"],
      reflections: { r1: "secret note" },
      nick: "RoboRay",
      roomId: "ROOM1",
    };
    const synced = toSynced(local);
    expect(Object.keys(synced).sort()).toEqual(["days", "done", "quiz"]);
    expect(JSON.stringify(synced)).not.toContain("secret note");
    expect(JSON.stringify(synced)).not.toContain("RoboRay");
  });

  it("applyRemote merges shared subset, keeps local-only fields", () => {
    const local = { ...newLocalState("NOVA"), done: ["d1"], nick: "RoboRay" };
    const merged = applyRemote(local, { done: ["d2"], days: [], quiz: {} });
    expect(merged.done).toEqual(["d1", "d2"]);
    expect(merged.nick).toBe("RoboRay");
    expect(merged.code).toBe("NOVA");
  });
});
