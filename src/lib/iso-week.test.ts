import { describe, it, expect } from "vitest";
import { toIsoWeek, isoWeekRange } from "./iso-week";

describe("ISO week", () => {
  it("toIsoWeek formats correctly", () => {
    // Monday May 4, 2026 falls in ISO week 2026-W19
    expect(toIsoWeek(new Date(Date.UTC(2026, 4, 4)))).toBe("2026-W19");
    expect(toIsoWeek(new Date(Date.UTC(2026, 4, 10)))).toBe("2026-W19"); // Sunday same week
    expect(toIsoWeek(new Date(Date.UTC(2026, 4, 11)))).toBe("2026-W20");
  });

  it("isoWeekRange round-trips with toIsoWeek", () => {
    const { start, end } = isoWeekRange("2026-W19");
    expect(start.getUTCDay()).toBe(1); // Monday
    expect(end.getTime() - start.getTime()).toBe(7 * 86400000);
    expect(toIsoWeek(start)).toBe("2026-W19");
  });

  it("rejects malformed week strings", () => {
    expect(() => isoWeekRange("bogus")).toThrow();
    expect(() => isoWeekRange("2026-19")).toThrow();
  });
});
