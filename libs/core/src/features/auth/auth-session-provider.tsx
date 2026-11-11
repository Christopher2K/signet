import type { User } from "@signet/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuthApiContext } from "./auth-api-context";
import { AuthContext } from "./auth-context";
import { getAuthErrorMessage, isUnauthorized } from "./auth-errors";
import {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useSignupMutation,
} from "./auth-queries";
import { normalizeServerUrl } from "./auth-server-url";
import type { SessionStorageAdapter } from "./auth-session-storage.types";
import type { AuthSession, AuthState } from "./auth-types";

/** Session provider properties. */
type AuthSessionProviderProps = {
  children: ReactNode;
  requireStoredServerUrl: boolean;
  storage: SessionStorageAdapter;
};

export const AuthSessionProvider = ({
  children,
  requireStoredServerUrl,
  storage,
}: AuthSessionProviderProps) => {
  const queryClient = useQueryClient();
  const { defaultServerUrl, serverUrlRef, tokenRef } = useAuthApiContext();
  const sessionOperation = useRef(0);
  const sessionQueue = useRef<Promise<void>>(Promise.resolve());
  const storageQueue = useRef<Promise<void>>(Promise.resolve());
  const [serverUrl, setServerUrl] = useState(serverUrlRef.current);
  const [token, setToken] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<User>();
  const [storageRestored, setStorageRestored] = useState(false);
  const { mutateAsync: loginRequest } = useLoginMutation();
  const { mutateAsync: signupRequest } = useSignupMutation();
  const { mutateAsync: logoutRequest } = useLogoutMutation();
  const meQuery = useMeQuery({
    enabled: storageRestored && Boolean(token) && !sessionUser,
    serverUrl,
  });
  const restoreUnauthorized = isUnauthorized(meQuery.error);

  const runSessionOperation = useCallback(
    <T,>(operation: () => Promise<T>): Promise<T> => {
      const result = sessionQueue.current.then(operation);
      sessionQueue.current = result.then(
        () => undefined,
        () => undefined,
      );
      return result;
    },
    [],
  );

  const runStorageOperation = useCallback(
    async (
      operation: number,
      update: () => Promise<void>,
    ): Promise<boolean> => {
      const result = storageQueue.current.then(async () => {
        if (operation !== sessionOperation.current) {
          return false;
        }
        try {
          await update();
        } catch {
          // Persistence is best-effort; in-memory authentication still applies.
        }
        return operation === sessionOperation.current;
      });
      storageQueue.current = result.then(
        () => undefined,
        () => undefined,
      );
      return result;
    },
    [],
  );

  const completeAuthentication = useCallback(
    async (
      operation: number,
      session: AuthSession,
      selectedServerUrl: string,
    ) => {
      const applied = await runStorageOperation(operation, () =>
        storage.writeStoredSession(session.token, selectedServerUrl),
      );
      if (!applied) {
        return;
      }

      queryClient.clear();
      tokenRef.current = session.token;
      serverUrlRef.current = selectedServerUrl;
      setServerUrl(selectedServerUrl);
      setToken(session.token);
      setSessionUser(session.user);
      setStorageRestored(true);
    },
    [queryClient, runStorageOperation, serverUrlRef, storage, tokenRef],
  );

  const login = useCallback(
    (values: Parameters<typeof loginRequest>[0]) =>
      runSessionOperation(async () => {
        const operation = ++sessionOperation.current;
        const selectedServerUrl = normalizeServerUrl(
          values.serverUrl || defaultServerUrl,
        );
        try {
          const session = await loginRequest({
            ...values,
            serverUrl: selectedServerUrl,
          });
          if (operation === sessionOperation.current) {
            await completeAuthentication(operation, session, selectedServerUrl);
          }
        } catch (error) {
          if (operation === sessionOperation.current) {
            throw error;
          }
        }
      }),
    [
      completeAuthentication,
      defaultServerUrl,
      loginRequest,
      runSessionOperation,
    ],
  );

  const signup = useCallback(
    (values: Parameters<typeof signupRequest>[0]) =>
      runSessionOperation(async () => {
        const operation = ++sessionOperation.current;
        const selectedServerUrl = normalizeServerUrl(
          values.serverUrl || defaultServerUrl,
        );
        try {
          const session = await signupRequest({
            ...values,
            serverUrl: selectedServerUrl,
          });
          if (operation === sessionOperation.current) {
            await completeAuthentication(operation, session, selectedServerUrl);
          }
        } catch (error) {
          if (operation === sessionOperation.current) {
            throw error;
          }
        }
      }),
    [
      completeAuthentication,
      defaultServerUrl,
      runSessionOperation,
      signupRequest,
    ],
  );

  const clearLocalSession = useCallback(
    async (operation: number) => {
      const applied = await runStorageOperation(operation, () =>
        storage.clearSessionToken(),
      );
      if (!applied) {
        return;
      }

      queryClient.clear();
      tokenRef.current = null;
      setToken(null);
      setSessionUser(undefined);
      setStorageRestored(true);
    },
    [queryClient, runStorageOperation, storage, tokenRef],
  );

  const logout = useCallback(
    () =>
      runSessionOperation(async () => {
        const operation = ++sessionOperation.current;
        await queryClient.cancelQueries({ queryKey: ["auth", "me"] });
        if (operation !== sessionOperation.current) {
          return;
        }

        try {
          await logoutRequest();
        } catch {
          // Local logout succeeds even when the server cannot revoke the token.
        } finally {
          if (operation === sessionOperation.current) {
            await clearLocalSession(operation);
          }
        }
      }),
    [clearLocalSession, logoutRequest, queryClient, runSessionOperation],
  );

  const retryRestore = useCallback(() => {
    void meQuery.refetch();
  }, [meQuery.refetch]);

  useEffect(() => {
    const operation = ++sessionOperation.current;
    const restoreSession = async () => {
      const stored = await storage.readStoredSession();
      if (operation !== sessionOperation.current) {
        return;
      }

      const restoredServerUrl = stored.serverUrl || defaultServerUrl;
      const restoredToken =
        stored.token && (!requireStoredServerUrl || stored.serverUrl)
          ? stored.token
          : null;
      serverUrlRef.current = restoredServerUrl;
      tokenRef.current = restoredToken;
      setServerUrl(restoredServerUrl);
      setToken(restoredToken);
      setStorageRestored(true);
    };

    void restoreSession();
    return () => {
      ++sessionOperation.current;
    };
  }, [
    defaultServerUrl,
    requireStoredServerUrl,
    serverUrlRef,
    storage,
    tokenRef,
  ]);

  useEffect(() => {
    if (restoreUnauthorized) {
      const operation = ++sessionOperation.current;
      void clearLocalSession(operation);
    }
  }, [clearLocalSession, restoreUnauthorized]);

  const user = sessionUser ?? meQuery.data ?? null;
  const state: AuthState = !storageRestored
    ? { status: "restoring", user: null }
    : user && token
      ? { status: "authenticated", user }
      : !token || restoreUnauthorized
        ? { status: "unauthenticated", user: null }
        : meQuery.isFetching
          ? { status: "restoring", user: null }
          : meQuery.error
            ? {
                status: "unavailable",
                user: null,
                message: getAuthErrorMessage(meQuery.error),
              }
            : { status: "restoring", user: null };

  return (
    <AuthContext.Provider
      value={{ state, serverUrl, login, logout, retryRestore, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
