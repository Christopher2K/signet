import type { LoginValues, SignupValues } from "./types";

/** Field-specific client validation messages. */
export type FormFieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

const emailPattern = /^[^\s]+@[^\s]+$/;

const validateEmail = (email: string): string | undefined => {
  const normalized = email.trim();
  if (!normalized) {
    return "Email is required.";
  }
  if (normalized.length > 254 || !emailPattern.test(normalized)) {
    return "Enter a valid email address.";
  }
  return undefined;
};

/** Validates login credentials without contacting the API. */
export const validateLogin = (
  values: LoginValues,
): FormFieldErrors<LoginValues> => {
  const errors: FormFieldErrors<LoginValues> = {};
  const email = validateEmail(values.email);

  if (email) {
    errors.email = email;
  }
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length > 128) {
    errors.password = "Password must be 128 characters or fewer.";
  }

  return errors;
};

/** Validates account details against the signup API constraints. */
export const validateSignup = (
  values: SignupValues,
): FormFieldErrors<SignupValues> => {
  const errors: FormFieldErrors<SignupValues> = {};
  const name = values.name.trim();
  const email = validateEmail(values.email);

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }
  if (email) {
    errors.email = email;
  }
  if (values.password.length < 12) {
    errors.password = "Password must be at least 12 characters.";
  } else if (values.password.length > 128) {
    errors.password = "Password must be 128 characters or fewer.";
  }

  return errors;
};
