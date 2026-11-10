import AsyncStorage from "@react-native-async-storage/async-storage";

const sessionTokenKey = "signet.session.token";
const serverUrlKey = "signet.session.server-url";

/** Persisted native session and last selected server. */
export type StoredSession = {
  token: string | null;
  serverUrl: string | null;
};

/** Reads the persisted token and server, treating storage failures as signed out. */
export const readStoredSession = async (): Promise<StoredSession> => {
  try {
    const [[, token], [, serverUrl]] = await AsyncStorage.multiGet([
      sessionTokenKey,
      serverUrlKey,
    ]);
    return { token, serverUrl };
  } catch {
    return { token: null, serverUrl: null };
  }
};

/** Persists the bearer token and server without blocking authentication on errors. */
export const writeStoredSession = async (
  token: string,
  serverUrl: string,
): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [sessionTokenKey, token],
      [serverUrlKey, serverUrl],
    ]);
  } catch {
    // The in-memory session remains usable if persistent storage is unavailable.
  }
};

/** Clears the bearer token while retaining the last selected server. */
export const clearSessionToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(sessionTokenKey);
  } catch {
    // In-memory authentication state is still cleared by the provider.
  }
};
