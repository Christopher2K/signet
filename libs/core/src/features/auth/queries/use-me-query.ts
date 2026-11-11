import { useQuery } from "@tanstack/react-query";
import { useAuthApiContext } from "../auth-api-context";

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
