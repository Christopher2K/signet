import { describe, expect, it } from "vitest";
import { loginSchema, validateLogin, validateSignup } from "./auth-validation";

describe("validateLogin", () => {
  it("accepts valid credentials", () => {
    expect(
      validateLogin({ email: "name@example.com", password: "secret" }),
    ).toEqual({});
  });

  it("requires an email and password", () => {
    expect(validateLogin({ email: "", password: "" })).toEqual({
      email: "common:validation.emailRequired",
      password: "common:validation.passwordRequired",
    });
  });

  it("rejects malformed email addresses", () => {
    expect(
      validateLogin({ email: "not-an-email", password: "secret" }).email,
    ).toBe("common:validation.emailInvalid");
  });

  it("supports Standard Schema validation", async () => {
    const result = await loginSchema["~standard"].validate({
      email: " name@example.com ",
      password: "secret",
    });

    expect(result).toEqual({
      typed: true,
      value: { email: "name@example.com", password: "secret" },
    });
  });
});

describe("validateSignup", () => {
  it("accepts valid account details", () => {
    expect(
      validateSignup({
        email: "name@example.com",
        name: "Jane Doe",
        password: "a secure password",
      }),
    ).toEqual({});
  });

  it("requires a display name", () => {
    expect(
      validateSignup({
        email: "name@example.com",
        name: "   ",
        password: "a secure password",
      }).name,
    ).toBe("common:validation.nameRequired");
  });

  it("enforces the API password length constraints", () => {
    expect(
      validateSignup({
        email: "name@example.com",
        name: "Jane Doe",
        password: "short",
      }).password,
    ).toBe("common:validation.passwordTooShort");

    expect(
      validateSignup({
        email: "name@example.com",
        name: "Jane Doe",
        password: "x".repeat(129),
      }).password,
    ).toBe("common:validation.passwordTooLong");
  });
});
