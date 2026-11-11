import type { BookmarkFormErrors } from "./bookmarks-validation";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** Extracts generated API field errors and an accessible summary. */
export const getBookmarkError = (
  value: unknown,
): { fieldErrors: BookmarkFormErrors; message: string } => {
  if (isRecord(value) && isRecord(value.error)) {
    const code = value.error.code;
    const message =
      typeof value.error.message === "string"
        ? value.error.message
        : "common:errors.unknown";
    const fieldErrors: BookmarkFormErrors = {};
    if (isRecord(value.error.details)) {
      for (const field of ["title", "url", "image", "notes", "tags"] as const) {
        const messages = value.error.details[field];
        if (Array.isArray(messages) && typeof messages[0] === "string") {
          fieldErrors[field] = messages[0];
        }
      }
    }
    if (code === "not_found" || code === "unauthorized") {
      return { fieldErrors, message };
    }
    return { fieldErrors, message };
  }
  if (value instanceof TypeError) {
    return {
      fieldErrors: {},
      message: "common:errors.unavailable",
    };
  }
  return {
    fieldErrors: {},
    message: "common:errors.unknown",
  };
};
