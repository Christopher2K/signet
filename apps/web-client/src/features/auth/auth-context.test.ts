import { describe, expect, it } from "vitest";
import { getApiUrl } from "./auth-context";

describe("getApiUrl", () => {
  it("uses the current browser origin without an API override", () => {
    expect(getApiUrl(undefined, "http://localhost:3000")).toBe(
      "http://localhost:3000",
    );
    expect(getApiUrl(undefined, "https://bookmarks.example.com")).toBe(
      "https://bookmarks.example.com",
    );
  });

  it("treats a blank API override as absent", () => {
    expect(getApiUrl("  ", "https://bookmarks.example.com")).toBe(
      "https://bookmarks.example.com",
    );
  });

  it("trims and preserves an explicit API override", () => {
    expect(
      getApiUrl("  https://api.example.com  ", "https://example.com"),
    ).toBe("https://api.example.com");
  });
});
