import { describe, it, expect } from "vitest";
import {
  decideForBrief,
  decideForGbpPost,
  BRIEF_THRESHOLDS,
  GBP_POST_THRESHOLDS,
} from "./dedup";

describe("dedup threshold decisions", () => {
  describe("decideForBrief", () => {
    it("returns 'keep' for scores below WARN", () => {
      expect(decideForBrief(0)).toBe("keep");
      expect(decideForBrief(0.1)).toBe("keep");
      expect(decideForBrief(BRIEF_THRESHOLDS.WARN - 0.01)).toBe("keep");
    });
    it("returns 'warn' for scores in [WARN, CONVERT)", () => {
      expect(decideForBrief(BRIEF_THRESHOLDS.WARN)).toBe("warn");
      expect(decideForBrief(0.4)).toBe("warn");
      expect(decideForBrief(BRIEF_THRESHOLDS.CONVERT - 0.01)).toBe("warn");
    });
    it("returns 'convert_to_refresh' for scores >= CONVERT", () => {
      expect(decideForBrief(BRIEF_THRESHOLDS.CONVERT)).toBe("convert_to_refresh");
      expect(decideForBrief(0.8)).toBe("convert_to_refresh");
      expect(decideForBrief(1.0)).toBe("convert_to_refresh");
    });
  });

  describe("decideForGbpPost", () => {
    it("returns 'keep' for scores below WARN", () => {
      expect(decideForGbpPost(0)).toBe("keep");
      expect(decideForGbpPost(GBP_POST_THRESHOLDS.WARN - 0.01)).toBe("keep");
    });
    it("returns 'warn' for scores in [WARN, DROP)", () => {
      expect(decideForGbpPost(GBP_POST_THRESHOLDS.WARN)).toBe("warn");
      expect(decideForGbpPost(GBP_POST_THRESHOLDS.DROP - 0.01)).toBe("warn");
    });
    it("returns 'drop' for scores >= DROP", () => {
      expect(decideForGbpPost(GBP_POST_THRESHOLDS.DROP)).toBe("drop");
      expect(decideForGbpPost(1.0)).toBe("drop");
    });
  });

  it("thresholds are sensible and ordered", () => {
    expect(BRIEF_THRESHOLDS.WARN).toBeGreaterThan(0);
    expect(BRIEF_THRESHOLDS.CONVERT).toBeGreaterThan(BRIEF_THRESHOLDS.WARN);
    expect(BRIEF_THRESHOLDS.CONVERT).toBeLessThan(1);
    expect(GBP_POST_THRESHOLDS.WARN).toBeGreaterThan(0);
    expect(GBP_POST_THRESHOLDS.DROP).toBeGreaterThan(GBP_POST_THRESHOLDS.WARN);
  });
});
