import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthApiContext } from "./auth-api-context";
import type { LoginValues, SignupValues } from "./auth-types";

/** Logs in with email and password through TanStack Query. */
export const useLoginMutation = () => {
  const { getApi } = useAuthApiContext();

  return useMutation({
    mutationFn: ({ serverUrl, ...values }: LoginValues) =>
      getApi(serverUrl).login(values),
  });
};

/** Revokes the current session through TanStack Query. */
export const useLogoutMutation = () => {
  const { getApi } = useAuthApiContext();

  return useMutation({ mutationFn: () => getApi().logout() });
};

/** Current-user query options. */
export type UseMeQueryOptions = {
  enabled?: boolean;
  serverUrl?: string;
};

/** Restores the current user through TanStack Query. */
export const useMeQuery = (options: UseMeQueryOptions = {}) => {
  const { getApi, serverUrlRef } = useAuthApiContext();
  const serverUrl = options.serverUrl ?? serverUrlRef.current;

  return useQuery({
    enabled: options.enabled ?? true,
    queryFn: () => getApi(serverUrl).currentUser(),
    queryKey: ["auth", "me", serverUrl],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/** Creates an account through TanStack Query. */
export const useSignupMutation = () => {
  const { getApi } = useAuthApiContext();

  return useMutation({
    mutationFn: ({ serverUrl, ...values }: SignupValues) =>
      getApi(serverUrl).signup(values),
  });
};
