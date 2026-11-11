import { describe, expect, it } from "vitest";
import { AuthError, toAuthError } from "./auth-errors";

describe("toAuthError", () => {
  it("preserves the exact invalid-credentials message", () => {
    const error = toAuthError({
      error: { code: "invalid_credentials", message: "Invalid credentials" },
    });

    expect(error).toBeInstanceOf(AuthError);
    expect(error.kind).toBe("invalid_credentials");
    expect(error.message).toBe("Invalid credentials");
  });

  it("exposes API field validation messages", () => {
    const error = toAuthError({
      error: {
        code: "validation_failed",
        details: { email: ["has already been taken"] },
        message: "Validation failed",
      },
    });

    expect(error.kind).toBe("validation");
    expect(error.fieldErrors.email).toEqual(["has already been taken"]);
  });

  it("normalizes network failures", () => {
    const error = toAuthError(new TypeError("Failed to fetch"));

    expect(error.kind).toBe("unavailable");
    expect(error.message).toBe(
      "Cannot reach the server. Check your connection and try again.",
    );
  });

  it("does not expose unexpected server details", () => {
    expect(toAuthError(new Error("Sensitive internals")).message).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
