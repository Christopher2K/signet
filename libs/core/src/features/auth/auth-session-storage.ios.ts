import * as SecureStore from "expo-secure-store";
import { sessionStorage as asyncSessionStorage } from "./auth-session-storage.native";
import type {
  SessionStorageAdapter,
  StoredSession,
} from "./auth-session-storage.types";

const sessionTokenKey = "signet.session.token";
const serverUrlKey = "signet.session.server-url";

const sharedStorageOptions = {
  accessGroup: "2YELN5S6P5.co.signetapp.app.shared",
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  keychainService: "co.signetapp.app",
  requireAuthentication: false,
} satisfies SecureStore.SecureStoreOptions;

const readSharedSession = async (): Promise<StoredSession> => {
  try {
    const [token, serverUrl] = await Promise.all([
      SecureStore.getItemAsync(sessionTokenKey, sharedStorageOptions),
      SecureStore.getItemAsync(serverUrlKey, sharedStorageOptions),
    ]);
    return { token, serverUrl };
  } catch {
    return { token: null, serverUrl: null };
  }
};

const writeSharedSession = async (token: string, serverUrl: string) => {
  try {
    const current = await readSharedSession();
    if (current.token === token && current.serverUrl === serverUrl) return;

    // Remove the old credential first so a partial update cannot pair it with a new server.
    await SecureStore.deleteItemAsync(sessionTokenKey, sharedStorageOptions);
    await SecureStore.setItemAsync(
      serverUrlKey,
      serverUrl,
      sharedStorageOptions,
    );
    await SecureStore.setItemAsync(
      sessionTokenKey,
      token,
      sharedStorageOptions,
    );
  } catch {
    // The app session remains usable when extension mirroring is unavailable.
  }
};

const clearSharedSessionToken = async () => {
  try {
    await SecureStore.deleteItemAsync(sessionTokenKey, sharedStorageOptions);
  } catch {
    // In-memory authentication state is still cleared by the provider.
  }
};

/** Persists the native session and mirrors it to the Safari extension Keychain. */
export const sessionStorage = {
  readStoredSession: async () => {
    const stored = await asyncSessionStorage.readStoredSession();
    const shared =
      stored.token && stored.serverUrl
        ? { token: null, serverUrl: null }
        : await readSharedSession();
    const session = {
      token: stored.token ?? shared.token,
      serverUrl: stored.serverUrl ?? shared.serverUrl,
    };

    if (session.token && session.serverUrl) {
      await writeSharedSession(session.token, session.serverUrl);
    }
    return session;
  },
  writeStoredSession: async (token: string, serverUrl: string) => {
    await Promise.all([
      asyncSessionStorage.writeStoredSession(token, serverUrl),
      writeSharedSession(token, serverUrl),
    ]);
  },
  clearSessionToken: async () => {
    await Promise.all([
      asyncSessionStorage.clearSessionToken(),
      clearSharedSessionToken(),
    ]);
  },
} satisfies SessionStorageAdapter;
