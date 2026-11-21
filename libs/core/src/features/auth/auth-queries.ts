import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthApiContext } from "./auth-api-context";
import { AuthError } from "./auth-errors";
import type { LoginValues, SignupValues } from "./auth-types";

const restoreTimeoutMs = 5000;

/** Bounds session restoration and aborts its request on timeout. */
export const withRestoreTimeout = async <T>(
  operation: (signal: AbortSignal) => Promise<T>,
  parentSignal: AbortSignal,
): Promise<T> => {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (parentSignal.aborted) {
    abort();
  } else {
    parentSignal.addEventListener("abort", abort, { once: true });
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      controller.abort();
      reject(new AuthError("common:errors.unavailable", "unavailable"));
    }, restoreTimeoutMs);
  });

  try {
    return await Promise.race([operation(controller.signal), timeoutPromise]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
    parentSignal.removeEventListener("abort", abort);
  }
};

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
    queryFn: ({ signal }) =>
      withRestoreTimeout(
        (requestSignal) => getApi(serverUrl).currentUser(requestSignal),
        signal,
      ),
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
