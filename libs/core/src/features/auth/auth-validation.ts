import * as v from "valibot";
import type { LoginValues, SignupValues } from "./auth-types";

/** Field-specific client validation messages. */
export type FormFieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

const emailPattern = /^[^\s]+@[^\s]+$/;

const emailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Email is required."),
  v.maxLength(254, "Enter a valid email address."),
  v.regex(emailPattern, "Enter a valid email address."),
);

/** Standard Schema for login credentials. */
export const loginSchema = v.object({
  email: emailSchema,
  password: v.pipe(
    v.string(),
    v.nonEmpty("Password is required."),
    v.maxLength(128, "Password must be 128 characters or fewer."),
  ),
  serverUrl: v.optional(v.string()),
});

/** Standard Schema for account registration details. */
export const signupSchema = v.object({
  email: emailSchema,
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Name is required."),
    v.maxLength(100, "Name must be 100 characters or fewer."),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(12, "Password must be at least 12 characters."),
    v.maxLength(128, "Password must be 128 characters or fewer."),
  ),
  serverUrl: v.optional(v.string()),
});

const firstIssueMessages = <TValues>(
  issues: v.BaseIssue<unknown>[],
): FormFieldErrors<TValues> => {
  const errors: FormFieldErrors<TValues> = {};
  for (const issue of issues) {
    const field = issue.path?.[0]?.key as keyof TValues | undefined;
    if (field !== undefined && errors[field] === undefined) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

/** Validates login credentials without contacting the API. */
export const validateLogin = (
  values: LoginValues,
): FormFieldErrors<LoginValues> =>
  firstIssueMessages(v.safeParse(loginSchema, values).issues ?? []);

/** Validates account details against the signup API constraints. */
export const validateSignup = (
  values: SignupValues,
): FormFieldErrors<SignupValues> =>
  firstIssueMessages(v.safeParse(signupSchema, values).issues ?? []);
