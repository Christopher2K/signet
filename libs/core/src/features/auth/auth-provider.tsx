import { type ReactNode, useCallback, useMemo, useRef } from "react";
import { createAuthApi } from "./auth-api";
import { AuthApiContext } from "./auth-api-context";
import { AuthSessionProvider } from "./auth-session-provider";
import { sessionStorage as platformSessionStorage } from "./auth-session-storage";
import type { SessionStorageAdapter } from "./auth-session-storage.types";
import type { AuthApi } from "./auth-types";

/** Authentication provider properties shared by every configuration. */
type AuthProviderBaseProps = {
  children: ReactNode;
  /** Requires a persisted server URL when restoring a native session. */
  requireStoredServerUrl?: boolean;
  /** Optional storage override for isolated tests and stories. */
  storage?: SessionStorageAdapter;
};

/** Authentication provider dependencies. */
export type AuthProviderProps = AuthProviderBaseProps &
  (
    | {
        /** Deployment URL used when credentials do not select a server. */
        defaultServerUrl: string;
        api?: undefined;
      }
    | {
        defaultServerUrl?: string;
        /** API override for isolated tests and stories. */
        api: AuthApi;
      }
  );

export const AuthProvider = ({
  api,
  children,
  defaultServerUrl = "",
  requireStoredServerUrl = false,
  storage = platformSessionStorage,
}: AuthProviderProps) => {
  const tokenRef = useRef<string | null>(null);
  const serverUrlRef = useRef(defaultServerUrl);
  const getApi = useCallback(
    (baseUrl = serverUrlRef.current) =>
      api ??
      createAuthApi({
        baseUrl,
        getToken: () => tokenRef.current,
      }),
    [api],
  );
  const apiContext = useMemo(
    () => ({ defaultServerUrl, getApi, serverUrlRef, tokenRef }),
    [defaultServerUrl, getApi],
  );

  return (
    <AuthApiContext.Provider value={apiContext}>
      <AuthSessionProvider
        requireStoredServerUrl={requireStoredServerUrl}
        storage={storage}
      >
        {children}
      </AuthSessionProvider>
    </AuthApiContext.Provider>
  );
};
