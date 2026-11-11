import { createContext, type RefObject, useContext } from "react";
import type { AuthApi } from "./auth-types";

/** API dependencies shared by the auth provider and mutation hooks. */
export type AuthApiContextValue = {
  defaultServerUrl: string;
  getApi: (baseUrl?: string) => AuthApi;
  serverUrlRef: RefObject<string>;
  tokenRef: RefObject<string | null>;
};

export const AuthApiContext = createContext<AuthApiContextValue | undefined>(
  undefined,
);

/** Returns the API dependencies configured by the nearest provider. */
export const useAuthApiContext = (): AuthApiContextValue => {
  const api = useContext(AuthApiContext);
  if (!api) {
    throw new Error("Auth API hooks must be used within AuthProvider.");
  }
  return api;
};
