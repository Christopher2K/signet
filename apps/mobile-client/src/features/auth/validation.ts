import {
  type FormFieldErrors,
  validateServerUrl,
  validateLogin as validateSharedLogin,
  validateSignup as validateSharedSignup,
} from "@signet/core/auth";
import type { LoginValues, SignupValues } from "./types";

export type { FormFieldErrors } from "@signet/core/auth";

/** Validates native login credentials and the selected server. */
export const validateLogin = (
  values: LoginValues,
): FormFieldErrors<LoginValues> => {
  const errors: FormFieldErrors<LoginValues> = validateSharedLogin(values);
  const serverUrl = validateServerUrl(values.serverUrl);
  if (serverUrl) {
    errors.serverUrl = serverUrl;
  }
  return errors;
};

/** Validates native account details and the selected server. */
export const validateSignup = (
  values: SignupValues,
): FormFieldErrors<SignupValues> => {
  const errors: FormFieldErrors<SignupValues> = validateSharedSignup(values);
  const serverUrl = validateServerUrl(values.serverUrl);
  if (serverUrl) {
    errors.serverUrl = serverUrl;
  }
  return errors;
};
