import { AuthProvider } from "@signet/core/auth/react";
import type { ReactNode } from "react";
import { DEFAULT_SERVER_URL } from "../../config";

/** Native session provider properties. */
type AuthSessionProviderProps = {
  children: ReactNode;
};

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => (
  <AuthProvider defaultServerUrl={DEFAULT_SERVER_URL} requireStoredServerUrl>
    {children}
  </AuthProvider>
);
