import { describe, expect, it } from "vitest";
import { getBookmarkError } from "./errors";

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

  it("normalizes not-found, unauthorized, and network failures", () => {
    expect(getBookmarkError({ error: { code: "not_found" } }).message).toBe(
      "This bookmark is no longer available.",
    );
    expect(getBookmarkError({ error: { code: "unauthorized" } }).message).toBe(
      "Your session is no longer valid. Log in and try again.",
    );
    expect(getBookmarkError(new TypeError("fetch failed")).message).toBe(
      "Cannot reach the server. Check your connection and try again.",
    );
  });
});
