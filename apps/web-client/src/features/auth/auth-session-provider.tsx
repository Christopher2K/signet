import type { User } from "@signet/api";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { AuthContext } from "./auth-context-value";
import { AuthError, getAuthErrorMessage } from "./errors";
import { useLoginMutation } from "./hooks/use-login-mutation";
import { useLogoutMutation } from "./hooks/use-logout-mutation";
import { useMeQuery } from "./hooks/use-me-query";
import { useSignupMutation } from "./hooks/use-signup-mutation";
import {
  clearSessionToken,
  readSessionToken,
  writeSessionToken,
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
  const [sessionUser, setSessionUser] = useState<User>();
  const token = readSessionToken();
  const { mutateAsync: loginRequest } = useLoginMutation();
  const { mutateAsync: signupRequest } = useSignupMutation();
  const { mutateAsync: logoutRequest } = useLogoutMutation();
  const meQuery = useMeQuery({ enabled: Boolean(token) && !sessionUser });
  const restoreUnauthorized = isUnauthorized(meQuery.error);

  const login = useCallback(
    async (values: LoginValues) => {
      const session = await loginRequest(values);
      queryClient.clear();
      writeSessionToken(session.token);
      setSessionUser(session.user);
    },
    [loginRequest, queryClient],
  );

  const signup = useCallback(
    async (values: SignupValues) => {
      const session = await signupRequest(values);
      queryClient.clear();
      writeSessionToken(session.token);
      setSessionUser(session.user);
    },
    [queryClient, signupRequest],
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Local logout succeeds even when the server cannot revoke the token.
    } finally {
      clearSessionToken();
      queryClient.clear();
      setSessionUser(undefined);
    }
  }, [logoutRequest, queryClient]);

  const retryRestore = useCallback(() => {
    void meQuery.refetch();
  }, [meQuery.refetch]);

  useEffect(() => {
    if (restoreUnauthorized) {
      clearSessionToken();
      queryClient.clear();
      setSessionUser(undefined);
    }
  }, [queryClient, restoreUnauthorized]);

  const user = sessionUser ?? meQuery.data ?? null;
  const state: AuthState =
    user && token
      ? { status: "authenticated", user }
      : !token || restoreUnauthorized
        ? { status: "unauthenticated", user: null }
        : meQuery.isFetching
          ? { status: "restoring", user: null }
          : meQuery.error
            ? {
                status: "unavailable",
                user: null,
                message: getAuthErrorMessage(meQuery.error),
              }
            : { status: "restoring", user: null };

  return (
    <AuthContext.Provider
      value={{ state, login, logout, retryRestore, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};
