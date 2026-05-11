import { describe, it, expect } from "vitest";
import { addUsage, ZERO_USAGE, stripJsonFences } from "./claude";

describe("claude helpers", () => {
  it("addUsage sums fields", () => {
    expect(addUsage({ tokensIn: 100, tokensOut: 50 }, { tokensIn: 25, tokensOut: 10 }))
      .toEqual({ tokensIn: 125, tokensOut: 60 });
  });

  it("addUsage handles ZERO_USAGE", () => {
    expect(addUsage(ZERO_USAGE, { tokensIn: 7, tokensOut: 3 })).toEqual({ tokensIn: 7, tokensOut: 3 });
    expect(addUsage(ZERO_USAGE, ZERO_USAGE)).toEqual({ tokensIn: 0, tokensOut: 0 });
  });

  it("stripJsonFences removes ```json and trailing ```", () => {
    expect(stripJsonFences('```json\n{"a": 1}\n```')).toBe('{"a": 1}');
    expect(stripJsonFences('  {"a": 1}  ')).toBe('{"a": 1}');
    expect(stripJsonFences('```\n{"a": 1}\n```')).toBe('{"a": 1}');
  });

  it("stripJsonFences leaves clean JSON untouched", () => {
    expect(stripJsonFences('{"a": 1}')).toBe('{"a": 1}');
  });
});

describe("estimateCostUsd", () => {
  it("computes Sonnet 4 cost from tokens", async () => {
    const { estimateCostUsd } = await import("./agent-runner");
    // 1000 in @ $3/M = $0.003, 500 out @ $15/M = $0.0075 → $0.0105
    const cost = estimateCostUsd("claude-sonnet-4-6", 1000, 500);
    expect(cost).toBeCloseTo(0.0105, 6);
  });

  it("returns undefined for unknown model", async () => {
    const { estimateCostUsd } = await import("./agent-runner");
    expect(estimateCostUsd("unknown-model", 1000, 500)).toBeUndefined();
  });

  it("returns undefined when tokens missing", async () => {
    const { estimateCostUsd } = await import("./agent-runner");
    expect(estimateCostUsd("claude-sonnet-4-6", undefined, 500)).toBeUndefined();
  });
});
