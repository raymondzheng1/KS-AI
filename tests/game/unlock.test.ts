import { describe, expect, it } from "vitest";
import {
  allCleared,
  clearedCount,
  firstAvailable,
  hurdleStatus,
} from "@/lib/game/unlock";
import { HURDLE_IDS } from "@/lib/content";

describe("hurdleStatus — clear-before-next", () => {
  it("d1 is available from the start", () => {
    expect(hurdleStatus("d1", [])).toBe("available");
    expect(hurdleStatus("d2", [])).toBe("locked");
  });
  it("clearing a hurdle unlocks the next, marks it done", () => {
    expect(hurdleStatus("d1", ["d1"])).toBe("done");
    expect(hurdleStatus("d2", ["d1"])).toBe("available");
    expect(hurdleStatus("d3", ["d1"])).toBe("locked");
  });
  it("a gap in the chain keeps later hurdles locked", () => {
    // d3 cleared but d2 not -> d3 shows done, d4 still locked (needs d3 done -> available)
    expect(hurdleStatus("d4", ["d1", "d3"])).toBe("available");
    expect(hurdleStatus("d2", ["d1", "d3"])).toBe("available");
  });
  it("unknown id is locked", () => {
    expect(hurdleStatus("zzz", HURDLE_IDS)).toBe("locked");
  });
});

describe("firstAvailable / clearedCount / allCleared", () => {
  it("firstAvailable points to the next unfinished hurdle", () => {
    expect(firstAvailable([])).toBe("d1");
    expect(firstAvailable(["d1", "d2"])).toBe("d3");
    expect(firstAvailable([...HURDLE_IDS])).toBe("d10");
  });
  it("clearedCount counts only valid hurdle ids", () => {
    expect(clearedCount(["d1", "d2", "bogus"])).toBe(2);
  });
  it("allCleared is true only when all 10 are done", () => {
    expect(allCleared(["d1"])).toBe(false);
    expect(allCleared([...HURDLE_IDS])).toBe(true);
  });
});
