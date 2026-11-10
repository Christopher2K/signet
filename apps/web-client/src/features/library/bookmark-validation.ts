import type { CreateBookmarkRequest } from "@signet/api";

/** Editable bookmark fields shown by the create and edit forms. */
export type BookmarkFormValues = {
  image: string;
  notes: string;
  tags: string;
  title: string;
  url: string;
};

/** Field errors associated with the bookmark form. */
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

/** Normalizes free-form tags for case-insensitive filtering. */
export const normalizeTags = (value: string): string[] => {
  const seen = new Set<string>();
  return value
    .split(",")
    .map((tag) => tag.trim().toLocaleLowerCase())
    .filter((tag) => {
      if (!tag || seen.has(tag)) {
        return false;
      }
      seen.add(tag);
      return true;
    });
};

/** Validates required fields and absolute HTTP(S) URLs before sending data. */
export const validateBookmark = (
  values: BookmarkFormValues,
): BookmarkFormErrors => {
  const errors: BookmarkFormErrors = {};
  if (!values.title.trim()) {
    errors.title = "Enter a title.";
  }
  if (!isHttpUrl(values.url.trim())) {
    errors.url = "Enter a valid absolute HTTP(S) URL.";
  }
  if (values.image.trim() && !isHttpUrl(values.image.trim())) {
    errors.image = "Enter a valid absolute HTTP(S) image URL.";
  }
  if (values.notes.length > 2000) {
    errors.notes = "Notes must be 2000 characters or fewer.";
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
