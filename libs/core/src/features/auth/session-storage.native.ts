import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SessionStorageAdapter } from "./session-storage.types";

const sessionTokenKey = "signet.session.token";
const serverUrlKey = "signet.session.server-url";

export const sessionStorage = {
  readStoredSession: async () => {
    try {
      const [[, token], [, serverUrl]] = await AsyncStorage.multiGet([
        sessionTokenKey,
        serverUrlKey,
      ]);
      return { token, serverUrl };
    } catch {
      return { token: null, serverUrl: null };
    }
  },
  writeStoredSession: async (token: string, serverUrl: string) => {
    try {
      await AsyncStorage.multiSet([
        [sessionTokenKey, token],
        [serverUrlKey, serverUrl],
      ]);
    } catch {
      // The in-memory session remains usable if persistent storage is unavailable.
    }
  },
  clearSessionToken: async () => {
    try {
      await AsyncStorage.removeItem(sessionTokenKey);
    } catch {
      // In-memory authentication state is still cleared by the provider.
    }
  },
} satisfies SessionStorageAdapter;
