import type { AuthApi } from "@signet/core/auth";
import { AuthProvider as CoreAuthProvider } from "@signet/core/auth/react";
import type { ReactNode } from "react";

export type { AuthContextValue, AuthState } from "@signet/core/auth";
export { useAuth } from "@signet/core/auth/react";

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
  if (api) {
    return <CoreAuthProvider api={api}>{children}</CoreAuthProvider>;
  }

  return (
    <CoreAuthProvider defaultServerUrl={getConfiguredApiUrl()}>
      {children}
    </CoreAuthProvider>
  );
};
