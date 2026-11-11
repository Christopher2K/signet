import type { SessionStorageAdapter } from "./auth-session-storage.types";

const sessionTokenKey = "signet.session.token";

/** Minimal browser-storage contract used for bearer sessions. */
export type BrowserSessionStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const getBrowserStorage = (): BrowserSessionStorage | undefined => {
  try {
    if (typeof window === "undefined") {
      return undefined;
    }
    return window.localStorage;
  } catch {
    return undefined;
  }
};

/** Creates a browser-backed asynchronous session storage adapter. */
export const createWebSessionStorage = (
  storage?: BrowserSessionStorage,
): SessionStorageAdapter => {
  const getStorage = () => storage ?? getBrowserStorage();

  return {
    readStoredSession: async () => {
      try {
        return {
          token: getStorage()?.getItem(sessionTokenKey) ?? null,
          serverUrl: null,
        };
      } catch {
        return { token: null, serverUrl: null };
      }
    },
    writeStoredSession: async (token: string) => {
      try {
        getStorage()?.setItem(sessionTokenKey, token);
      } catch {
        // The in-memory session remains usable when storage is unavailable.
      }
    },
    clearSessionToken: async () => {
      try {
        getStorage()?.removeItem(sessionTokenKey);
      } catch {
        // Local state is still cleared when storage is unavailable.
      }
    },
  };
};

export const sessionStorage = createWebSessionStorage();
