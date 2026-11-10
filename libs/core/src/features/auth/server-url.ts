/** Normalizes a server URL for API client configuration. */
export const normalizeServerUrl = (value: string): string =>
  value.trim().replace(/\/+$/, "");

/** Validates an absolute HTTP or HTTPS server URL. */
export const validateServerUrl = (value: string): string | undefined => {
  const normalized = normalizeServerUrl(value);
  if (!normalized) {
    return "Server URL is required.";
  }

  try {
    const url = new URL(normalized);
    if (
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      return "Enter a valid HTTP or HTTPS server URL.";
    }
  } catch {
    return "Enter a valid HTTP or HTTPS server URL.";
  }

  return undefined;
};
