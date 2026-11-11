import { describe, expect, it } from "vitest";
import { getBookmarkError } from "./bookmarks-errors";

describe("getBookmarkError", () => {
  it("extracts API field errors", () => {
    expect(
      getBookmarkError({
        error: {
          code: "validation_error",
          details: { title: ["can't be blank"], url: ["is invalid"] },
          message: "Validation failed",
        },
      }),
    ).toEqual({
      fieldErrors: { title: "can't be blank", url: "is invalid" },
      message: "Validation failed",
    });
  });

  it("preserves localized API messages and normalizes network failures", () => {
    expect(
      getBookmarkError({
        error: { code: "not_found", message: "Signet introuvable" },
      }).message,
    ).toBe("Signet introuvable");
    expect(
      getBookmarkError({
        error: { code: "unauthorized", message: "Authentification requise" },
      }).message,
    ).toBe("Authentification requise");
    expect(getBookmarkError(new TypeError("fetch failed")).message).toBe(
      "common:errors.unavailable",
    );
  });
});
