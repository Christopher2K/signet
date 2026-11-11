/** Persisted session data available on the current platform. */
export type StoredSession = {
  token: string | null;
  serverUrl: string | null;
};

/** Asynchronous platform adapter for bearer session persistence. */
export type SessionStorageAdapter = {
  readStoredSession: () => Promise<StoredSession>;
  writeStoredSession: (token: string, serverUrl: string) => Promise<void>;
  clearSessionToken: () => Promise<void>;
};
