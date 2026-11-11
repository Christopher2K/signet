import { describe, expect, it } from "vitest";
import { normalizeLocale, resolveLocale } from "./locale";

describe("locale negotiation", () => {
  it.each([
    ["en", "en"],
    ["EN-us", "en"],
    ["fr-CA", "fr"],
    ["fr_FR", "fr"],
  ])("normalizes %s", (languageTag, expected) => {
    expect(normalizeLocale(languageTag)).toBe(expected);
  });

  it.each([undefined, null, "", "es", "english", " fr "])(
    "handles unsupported or malformed input %s",
    (languageTag) => {
      expect(normalizeLocale(languageTag)).toBe(
        languageTag === " fr " ? "fr" : null,
      );
    },
  );

  it("selects the first supported preference", () => {
    expect(resolveLocale(["es-ES", "fr-CA", "en-US"])).toBe("fr");
  });

  it("falls back to English", () => {
    expect(resolveLocale(["es-ES", undefined])).toBe("en");
    expect(resolveLocale([])).toBe("en");
  });
});
