import type { Bookmark, CreateBookmarkRequest } from "@signet/api";
import * as v from "valibot";

/** Editable bookmark fields shown by the create and edit forms. */
export type BookmarkFormValues = {
  image: string;
  notes: string;
  tags: string;
  title: string;
  url: string;
};

/** Field-specific bookmark validation translation keys. */
export type BookmarkFormErrors = Partial<
  Record<keyof BookmarkFormValues, string>
>;

export const emptyBookmarkValues: BookmarkFormValues = {
  image: "",
  notes: "",
  tags: "",
  title: "",
  url: "",
};

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
};

/** Converts a saved bookmark into editable form values. */
export const bookmarkToFormValues = (
  bookmark: Bookmark,
): BookmarkFormValues => ({
  image: bookmark.image ?? "",
  notes: bookmark.notes ?? "",
  tags: bookmark.tags.join(", "),
  title: bookmark.title,
  url: bookmark.url,
});

/** Normalizes free-form tags for case-insensitive filtering. */
export const normalizeTags = (value: string): string[] => {
  const seen = new Set<string>();
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => {
      if (!tag || seen.has(tag)) {
        return false;
      }
      seen.add(tag);
      return true;
    });
};

/** Standard Schema for editable bookmark fields. */
export const bookmarkSchema = v.object({
  image: v.pipe(
    v.string(),
    v.trim(),
    v.check(
      (value) => !value || isHttpUrl(value),
      "common:validation.imageUrlInvalid",
    ),
  ),
  notes: v.pipe(
    v.string(),
    v.maxLength(2000, "common:validation.notesTooLong"),
  ),
  tags: v.string(),
  title: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("common:validation.titleRequired"),
  ),
  url: v.pipe(
    v.string(),
    v.trim(),
    v.check(isHttpUrl, "common:validation.urlInvalid"),
  ),
});

/** Validates required fields and absolute HTTP(S) URLs before sending data. */
export const validateBookmark = (
  values: BookmarkFormValues,
): BookmarkFormErrors => {
  const errors: BookmarkFormErrors = {};
  const result = v.safeParse(bookmarkSchema, values);
  for (const issue of result.issues ?? []) {
    const field = issue.path?.[0]?.key as keyof BookmarkFormValues | undefined;
    if (field !== undefined && errors[field] === undefined) {
      errors[field] = issue.message;
    }
  }
  return errors;
};

/** Converts form values to the generated create/update request shape. */
export const toBookmarkRequest = (
  values: BookmarkFormValues,
): CreateBookmarkRequest => ({
  image: values.image.trim() || null,
  notes: values.notes.trim() || null,
  tags: normalizeTags(values.tags),
  title: values.title.trim(),
  url: values.url.trim(),
});

/** Returns a safe hostname for compact bookmark metadata. */
export const getBookmarkHostname = (value: string): string => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};
