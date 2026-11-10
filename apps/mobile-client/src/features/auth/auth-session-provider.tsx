import { useQueryClient } from "@tanstack/react-query";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DEFAULT_SERVER_URL } from "../../config";
import { createAuthApi } from "./api";
import { AuthContext } from "./auth-context";
import { AuthError, getAuthErrorMessage } from "./errors";
import { normalizeServerUrl } from "./server-url";
import {
  clearSessionToken,
  readStoredSession,
  writeStoredSession,
} from "./session-storage";
import type { AuthState, LoginValues, SignupValues } from "./types";

/** Session provider properties. */
type AuthSessionProviderProps = {
  children: ReactNode;
};

const isUnauthorized = (error: unknown): boolean =>
  error instanceof AuthError &&
  (error.kind === "invalid_credentials" || error.kind === "unauthorized");

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  const queryClient = useQueryClient();
  const tokenRef = useRef<string | null>(null);
  const serverUrlRef = useRef(DEFAULT_SERVER_URL);
  const restoreRequest = useRef(0);
  const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER_URL);
  const [state, setState] = useState<AuthState>({
    status: "restoring",
    user: null,
  });
  const getApi = useCallback(
    (baseUrl = serverUrlRef.current) =>
      createAuthApi({
        baseUrl,
        getToken: () => tokenRef.current,
      }),
    [],
  );

  const restoreSession = useCallback(async () => {
    const request = ++restoreRequest.current;
    setState({ status: "restoring", user: null });
    const stored = await readStoredSession();
    if (request !== restoreRequest.current) {
      return;
    }

    const restoredServerUrl = stored.serverUrl || DEFAULT_SERVER_URL;
    serverUrlRef.current = restoredServerUrl;
    setServerUrl(restoredServerUrl);
    if (!stored.token || !stored.serverUrl) {
      tokenRef.current = null;
      setState({ status: "unauthenticated", user: null });
      return;
    }

    tokenRef.current = stored.token;
    try {
      const user = await getApi().currentUser();
      if (request === restoreRequest.current) {
        setState({ status: "authenticated", user });
      }
    } catch (error) {
      if (request !== restoreRequest.current) {
        return;
      }
      if (isUnauthorized(error)) {
        tokenRef.current = null;
        await clearSessionToken();
        queryClient.clear();
        setState({ status: "unauthenticated", user: null });
      } else {
        setState({
          status: "unavailable",
          user: null,
          message: getAuthErrorMessage(error),
        });
      }
    }
  }, [getApi, queryClient]);

  const login = useCallback(
    async (values: LoginValues) => {
      const selectedServerUrl = normalizeServerUrl(values.serverUrl);
      const session = await getApi(selectedServerUrl).login({
        email: values.email,
        password: values.password,
      });
      tokenRef.current = session.token;
      serverUrlRef.current = selectedServerUrl;
      setServerUrl(selectedServerUrl);
      await writeStoredSession(session.token, selectedServerUrl);
      queryClient.clear();
      setState({ status: "authenticated", user: session.user });
    },
    [getApi, queryClient],
  );

  const signup = useCallback(
    async (values: SignupValues) => {
      const selectedServerUrl = normalizeServerUrl(values.serverUrl);
      const session = await getApi(selectedServerUrl).signup({
        email: values.email,
        name: values.name,
        password: values.password,
      });
      tokenRef.current = session.token;
      serverUrlRef.current = selectedServerUrl;
      setServerUrl(selectedServerUrl);
      await writeStoredSession(session.token, selectedServerUrl);
      queryClient.clear();
      setState({ status: "authenticated", user: session.user });
    },
    [getApi, queryClient],
  );

  const logout = useCallback(async () => {
    ++restoreRequest.current;
    try {
      await getApi().logout();
    } catch {
      // Local logout succeeds even when the server cannot revoke the token.
    } finally {
      tokenRef.current = null;
      await clearSessionToken();
      queryClient.clear();
      setState({ status: "unauthenticated", user: null });
    }
  }, [getApi, queryClient]);

  const retryRestore = useCallback(() => {
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    void restoreSession();
    return () => {
      ++restoreRequest.current;
    };
  }, [restoreSession]);

  return (
    <AuthContext.Provider
      value={{ state, serverUrl, login, logout, retryRestore, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
