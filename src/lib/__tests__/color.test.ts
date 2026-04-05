import { describe, it, expect } from "vitest";
import {
  clamp,
  hsvToRgb,
  rgbToHsv,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  hexToRgb,
} from "../color";

describe("clamp", () => {
  it("clamps value below min", () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it("clamps value above max", () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it("returns value within range unchanged", () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it("returns min when value equals min", () => {
    expect(clamp(0, 0, 100)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(clamp(100, 0, 100)).toBe(100);
  });
});

describe("hsvToRgb", () => {
  it("converts pure red (0,100,100) -> [255,0,0]", () => {
    expect(hsvToRgb(0, 100, 100)).toEqual([255, 0, 0]);
  });

  it("converts pure green (120,100,100) -> [0,255,0]", () => {
    expect(hsvToRgb(120, 100, 100)).toEqual([0, 255, 0]);
  });

  it("converts pure blue (240,100,100) -> [0,0,255]", () => {
    expect(hsvToRgb(240, 100, 100)).toEqual([0, 0, 255]);
  });

  it("converts black (0,0,0) -> [0,0,0]", () => {
    expect(hsvToRgb(0, 0, 0)).toEqual([0, 0, 0]);
  });

  it("converts white (0,0,100) -> [255,255,255]", () => {
    expect(hsvToRgb(0, 0, 100)).toEqual([255, 255, 255]);
  });
});

describe("rgbToHex / hexToRgb roundtrip", () => {
  it("roundtrips red", () => {
    const hex = rgbToHex(255, 0, 0);
    expect(hex).toBe("#ff0000");
    expect(hexToRgb(hex)).toEqual([255, 0, 0]);
  });

  it("roundtrips arbitrary color", () => {
    const hex = rgbToHex(100, 200, 50);
    expect(hexToRgb(hex)).toEqual([100, 200, 50]);
  });
});

describe("hexToRgb", () => {
  it("parses 3-char shorthand #fff -> [255,255,255]", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
  });

  it("parses 3-char shorthand #000 -> [0,0,0]", () => {
    expect(hexToRgb("#000")).toEqual([0, 0, 0]);
  });

  it("returns null for invalid input", () => {
    expect(hexToRgb("not-a-color")).toBeNull();
  });

  it("returns null for too-short hex", () => {
    expect(hexToRgb("#ab")).toBeNull();
  });
});

describe("rgbToHsl / hslToRgb roundtrip", () => {
  it("roundtrips pure red", () => {
    const [h, s, l] = rgbToHsl(255, 0, 0);
    const [r, g, b] = hslToRgb(h, s, l);
    expect(r).toBe(255);
    expect(g).toBe(0);
    expect(b).toBe(0);
  });

  it("roundtrips gray", () => {
    const [h, s, l] = rgbToHsl(128, 128, 128);
    const [r, g, b] = hslToRgb(h, s, l);
    expect(Math.abs(r - 128)).toBeLessThanOrEqual(1);
    expect(Math.abs(g - 128)).toBeLessThanOrEqual(1);
    expect(Math.abs(b - 128)).toBeLessThanOrEqual(1);
  });
});

describe("rgbToHsv / hsvToRgb roundtrip", () => {
  it("roundtrips pure blue", () => {
    const [h, s, v] = rgbToHsv(0, 0, 255);
    const [r, g, b] = hsvToRgb(h, s, v);
    expect(r).toBe(0);
    expect(g).toBe(0);
    expect(b).toBe(255);
  });
});
