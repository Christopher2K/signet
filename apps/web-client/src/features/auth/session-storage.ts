const sessionTokenKey = "signet.session.token";

/** Minimal browser-storage contract used for bearer sessions. */
export type SessionStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const getBrowserStorage = (): SessionStorage | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.localStorage;
};

/** Reads the persisted bearer token, returning null when storage is blocked. */
export const readSessionToken = (
  storage: SessionStorage | undefined = getBrowserStorage(),
): string | null => {
  try {
    return storage?.getItem(sessionTokenKey) ?? null;
  } catch {
    return null;
  }
};

/** Persists a bearer token when browser storage is available. */
export const writeSessionToken = (
  token: string,
  storage: SessionStorage | undefined = getBrowserStorage(),
): void => {
  try {
    storage?.setItem(sessionTokenKey, token);
  } catch {
    // The in-memory session remains usable when storage is unavailable.
  }
};

/** Removes the persisted bearer token. */
export const clearSessionToken = (
  storage: SessionStorage | undefined = getBrowserStorage(),
): void => {
  try {
    storage?.removeItem(sessionTokenKey);
  } catch {
    // Local state is still cleared when storage is unavailable.
  }
};
