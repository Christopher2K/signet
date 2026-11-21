import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resources } from "./resources";

const translationPaths = (value: unknown, prefix = ""): string[] => {
  if (!value || typeof value !== "object") {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    translationPaths(child, prefix ? `${prefix}.${key}` : key),
  );
};

/** Safari WebExtension message catalog shape. */
type SafariCatalog = Record<string, { message: string }>;

const readSafariCatalog = (locale: "en" | "fr"): SafariCatalog =>
  JSON.parse(
    readFileSync(
      new URL(
        `../../../apps/extension/public/_locales/${locale}/messages.json`,
        import.meta.url,
      ),
      "utf8",
    ),
  ) as SafariCatalog;

describe("translation catalogs", () => {
  it.each(["common", "mobile", "safari", "web"] as const)(
    "keeps %s keys aligned between English and French",
    (namespace) => {
      expect(translationPaths(resources.fr[namespace]).sort()).toEqual(
        translationPaths(resources.en[namespace]).sort(),
      );
    },
  );

  it.each(["en", "fr"] as const)(
    "keeps the shared Safari %s catalog synchronized with WebExtension messages",
    (locale) => {
      const messages = Object.fromEntries(
        Object.entries(readSafariCatalog(locale)).map(([key, value]) => [
          key,
          value.message,
        ]),
      );
      expect(messages).toEqual(resources[locale].safari);
    },
  );
});
