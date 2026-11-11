import { describe, expect, it } from "vitest";
import { normalizeServerUrl, validateServerUrl } from "./auth-server-url";

describe("normalizeServerUrl", () => {
  it("trims whitespace and trailing slashes", () => {
    expect(normalizeServerUrl("  https://example.com///  ")).toBe(
      "https://example.com",
    );
  });
});

describe("validateServerUrl", () => {
  it("accepts absolute HTTP and HTTPS origins", () => {
    expect(validateServerUrl("http://localhost:4000")).toBeUndefined();
    expect(validateServerUrl("https://example.com/api")).toBeUndefined();
  });

  it("requires a server URL", () => {
    expect(validateServerUrl("   ")).toBe("Server URL is required.");
  });

  it.each([
    "example.com",
    "ftp://example.com",
    "https://user:password@example.com",
    "https://example.com?query=true",
    "https://example.com#fragment",
  ])("rejects invalid or unsupported URL %s", (value) => {
    expect(validateServerUrl(value)).toBe(
      "Enter a valid HTTP or HTTPS server URL.",
    );
  });
});
