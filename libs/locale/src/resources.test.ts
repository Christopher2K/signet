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

describe("translation catalogs", () => {
  it.each(["common", "mobile", "web"] as const)(
    "keeps %s keys aligned between English and French",
    (namespace) => {
      expect(translationPaths(resources.fr[namespace]).sort()).toEqual(
        translationPaths(resources.en[namespace]).sort(),
      );
    },
  );
});
