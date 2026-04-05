import { describe, it, expect } from "vitest";
import { computeLCS, diffLines } from "../diff";

describe("computeLCS", () => {
  it("returns correct LCS table for identical arrays", () => {
    const dp = computeLCS(["a", "b", "c"], ["a", "b", "c"]);
    expect(dp[3][3]).toBe(3);
  });

  it("returns 0 LCS for completely different arrays", () => {
    const dp = computeLCS(["a", "b"], ["c", "d"]);
    expect(dp[2][2]).toBe(0);
  });
});

describe("diffLines", () => {
  it("identical strings produce all 'same' lines", () => {
    const text = "line1\nline2\nline3";
    const result = diffLines(text, text);
    expect(result).toHaveLength(3);
    expect(result.every((l) => l.type === "same")).toBe(true);
  });

  it("completely different strings produce del + add lines", () => {
    const result = diffLines("aaa\nbbb", "ccc\nddd");
    const types = result.map((l) => l.type);
    expect(types.filter((t) => t === "del")).toHaveLength(2);
    expect(types.filter((t) => t === "add")).toHaveLength(2);
    expect(types.filter((t) => t === "same")).toHaveLength(0);
  });

  it("detects a single line addition", () => {
    const result = diffLines("a\nb", "a\nb\nc");
    const adds = result.filter((l) => l.type === "add");
    expect(adds).toHaveLength(1);
    expect(adds[0].text).toBe("c");
  });

  it("detects a single line deletion", () => {
    const result = diffLines("a\nb\nc", "a\nc");
    const dels = result.filter((l) => l.type === "del");
    expect(dels).toHaveLength(1);
    expect(dels[0].text).toBe("b");
  });

  it("handles both inputs empty", () => {
    const result = diffLines("", "");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("same");
    expect(result[0].text).toBe("");
  });

  it("handles one input empty", () => {
    const result = diffLines("", "hello\nworld");
    const adds = result.filter((l) => l.type === "add");
    expect(adds.length).toBeGreaterThanOrEqual(1);
  });

  it("handles multi-line mixed changes", () => {
    const original = "keep\nremove\nstay\nold";
    const modified = "keep\nstay\nnew\nadded";
    const result = diffLines(original, modified);
    const types = result.map((l) => l.type);
    expect(types).toContain("same");
    expect(types).toContain("del");
    expect(types).toContain("add");
  });
});
