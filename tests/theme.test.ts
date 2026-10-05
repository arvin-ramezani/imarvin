import { describe, expect, it } from "vitest";

import {
  parseThemePreference,
  resolveTheme,
} from "../lib/theme";

describe("theme state", () => {
  it("defaults invalid or missing preferences to System", () => {
    expect(parseThemePreference(null)).toBe("system");
    expect(parseThemePreference("system")).toBe("system");
    expect(parseThemePreference("unknown")).toBe("system");
  });

  it("resolves System from the device and keeps explicit modes fixed", () => {
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
});
