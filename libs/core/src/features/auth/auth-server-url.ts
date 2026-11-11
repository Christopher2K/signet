import * as v from "valibot";

/** Normalizes a server URL for API client configuration. */
export const normalizeServerUrl = (value: string): string =>
  value.trim().replace(/\/+$/, "");

const isValidServerUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
};

/** Standard Schema for an absolute HTTP(S) server URL. */
export const serverUrlSchema = v.pipe(
  v.string(),
  v.transform(normalizeServerUrl),
  v.nonEmpty("common:validation.serverUrlRequired"),
  v.check(isValidServerUrl, "common:validation.serverUrlInvalid"),
);

/** Validates an absolute HTTP or HTTPS server URL. */
export const validateServerUrl = (value: string): string | undefined =>
  v.safeParse(serverUrlSchema, value).issues?.[0]?.message;
