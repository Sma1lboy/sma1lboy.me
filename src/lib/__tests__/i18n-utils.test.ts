import { describe, it, expect } from "vitest";
import { getNestedValue } from "../i18n-utils";

describe("getNestedValue", () => {
  const dict = {
    greeting: "Hello",
    nav: {
      home: "Home",
      about: "About",
      nested: {
        deep: "Deep value",
      },
    },
  };

  it("simple key lookup", () => {
    expect(getNestedValue(dict, "greeting")).toBe("Hello");
  });

  it("nested key lookup", () => {
    expect(getNestedValue(dict, "nav.home")).toBe("Home");
  });

  it("deeply nested key lookup", () => {
    expect(getNestedValue(dict, "nav.nested.deep")).toBe("Deep value");
  });

  it("missing key returns the key string", () => {
    expect(getNestedValue(dict, "nonexistent")).toBe("nonexistent");
  });

  it("missing nested key returns the key string", () => {
    expect(getNestedValue(dict, "nav.missing")).toBe("nav.missing");
  });

  it("null object returns the key string", () => {
    expect(getNestedValue(null, "any.key")).toBe("any.key");
  });

  it("undefined object returns the key string", () => {
    expect(getNestedValue(undefined, "any.key")).toBe("any.key");
  });

  it("non-string leaf returns the key string", () => {
    expect(getNestedValue(dict, "nav")).toBe("nav");
  });
});
