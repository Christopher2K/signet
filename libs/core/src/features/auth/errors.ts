/** Broad authentication failure categories used by the UI. */
export type AuthErrorKind =
  | "invalid_credentials"
  | "unauthorized"
  | "validation"
  | "unavailable"
  | "unknown";

/** Normalized API and network authentication failure. */
export class AuthError extends Error {
  readonly kind: AuthErrorKind;
  readonly fieldErrors: Record<string, string[]>;

  constructor(
    message: string,
    kind: AuthErrorKind = "unknown",
    fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "AuthError";
    this.kind = kind;
    this.fieldErrors = fieldErrors;
  }
}

const unavailableMessage =
  "Cannot reach the server. Check your connection and try again.";
const unknownMessage = "Something went wrong. Please try again.";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readFieldErrors = (value: unknown): Record<string, string[]> => {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([field, messages]) => {
      if (!Array.isArray(messages)) {
        return [];
      }
      const strings = messages.filter(
        (message): message is string => typeof message === "string",
      );
      return strings.length > 0 ? [[field, strings]] : [];
    }),
  );
};

/** Converts generated-client failures into stable form errors. */
export const toAuthError = (value: unknown): AuthError => {
  if (value instanceof AuthError) {
    return value;
  }

  if (isRecord(value) && isRecord(value.error)) {
    const code =
      typeof value.error.code === "string" ? value.error.code : undefined;
    const message =
      typeof value.error.message === "string"
        ? value.error.message
        : unknownMessage;

    if (code === "invalid_credentials") {
      return new AuthError("Invalid credentials", "invalid_credentials");
    }
    if (code === "unauthorized") {
      return new AuthError(message, "unauthorized");
    }
    if (code === "validation_failed") {
      return new AuthError(
        message,
        "validation",
        readFieldErrors(value.error.details),
      );
    }
    return new AuthError(message);
  }

  if (value instanceof TypeError) {
    return new AuthError(unavailableMessage, "unavailable");
  }

  return new AuthError(unknownMessage);
};

/** Returns a human-readable message for rendering outside auth forms. */
export const getAuthErrorMessage = (value: unknown): string =>
  toAuthError(value).message;

/** Returns whether an error represents an invalid or expired session. */
export const isUnauthorized = (value: unknown): boolean =>
  value instanceof AuthError &&
  (value.kind === "invalid_credentials" || value.kind === "unauthorized");
