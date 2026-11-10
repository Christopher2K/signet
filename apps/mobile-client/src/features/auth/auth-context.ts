import { createContext, useContext } from "react";
import type { AuthContextValue } from "./types";

/** Native authentication context. */
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

/** Reads the nearest authentication provider. */
export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthSessionProvider.");
  }
  return value;
};
