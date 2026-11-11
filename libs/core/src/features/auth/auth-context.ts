import { createContext, useContext } from "react";
import type { AuthContextValue } from "./auth-types";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

/** Returns the nearest authentication provider value. */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
};
