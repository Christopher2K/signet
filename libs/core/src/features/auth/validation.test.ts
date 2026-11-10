import { describe, expect, it } from "vitest";
import { validateLogin, validateSignup } from "./validation";

describe("validateLogin", () => {
  it("accepts valid credentials", () => {
    expect(
      validateLogin({ email: "name@example.com", password: "secret" }),
    ).toEqual({});
  });

  it("requires an email and password", () => {
    expect(validateLogin({ email: "", password: "" })).toEqual({
      email: "Email is required.",
      password: "Password is required.",
    });
  });

  it("rejects malformed email addresses", () => {
    expect(
      validateLogin({ email: "not-an-email", password: "secret" }).email,
    ).toBe("Enter a valid email address.");
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
    ).toBe("Name is required.");
  });

  it("enforces the API password length constraints", () => {
    expect(
      validateSignup({
        email: "name@example.com",
        name: "Jane Doe",
        password: "short",
      }).password,
    ).toBe("Password must be at least 12 characters.");

    expect(
      validateSignup({
        email: "name@example.com",
        name: "Jane Doe",
        password: "x".repeat(129),
      }).password,
    ).toBe("Password must be 128 characters or fewer.");
  });
});
