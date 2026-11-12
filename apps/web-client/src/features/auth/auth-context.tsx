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

export const getApiUrl = (
  configuredApiUrl: string | undefined = import.meta.env.API_URL,
  origin = window.location.origin,
): string => configuredApiUrl?.trim() || origin;

export const AuthProvider = ({ api, children }: AuthProviderProps) => {
  if (api) {
    return <CoreAuthProvider api={api}>{children}</CoreAuthProvider>;
  }

  return (
    <CoreAuthProvider defaultServerUrl={getApiUrl()}>
      {children}
    </CoreAuthProvider>
  );
};
