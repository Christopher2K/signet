import { createContext, useContext } from "react";
import type { AuthApi } from "./types";

export const AuthApiContext = createContext<AuthApi | undefined>(undefined);

/** Returns the auth API configured by the nearest provider. */
export const useAuthApi = (): AuthApi => {
  const api = useContext(AuthApiContext);
  if (!api) {
    throw new Error("Auth API hooks must be used within AuthProvider.");
  }
  return api;
};
