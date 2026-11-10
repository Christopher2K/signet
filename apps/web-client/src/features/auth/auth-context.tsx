import { type ReactNode, useMemo } from "react";
import { createAuthApi } from "./api";
import { AuthApiContext } from "./auth-api-context";
import { AuthSessionProvider } from "./auth-session-provider";
import { readSessionToken } from "./session-storage";
import type { AuthApi } from "./types";

export { useAuth } from "./auth-context-value";
export type { AuthContextValue, AuthState } from "./types";

/** Authentication provider dependencies. */
export type AuthProviderProps = {
  children: ReactNode;
  /** Optional API override for isolated tests and stories. */
  api?: AuthApi;
};

const getConfiguredApiUrl = (): string => {
  const apiUrl = import.meta.env.API_URL?.trim();
  if (!apiUrl) {
    throw new Error("API_URL must be configured for the web application.");
  }
  return apiUrl;
};

export const AuthProvider = ({ api, children }: AuthProviderProps) => {
  const resolvedApi = useMemo(
    () =>
      api ??
      createAuthApi({
        baseUrl: getConfiguredApiUrl(),
        getToken: readSessionToken,
      }),
    [api],
  );

  return (
    <AuthApiContext.Provider value={resolvedApi}>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </AuthApiContext.Provider>
  );
};
