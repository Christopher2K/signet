import { useQuery } from "@tanstack/react-query";
import { useAuthApi } from "../auth-api-context";

/** Current-user query options. */
export type UseMeQueryOptions = {
  enabled?: boolean;
};

/** Restores the current user through TanStack Query. */
export const useMeQuery = ({ enabled = true }: UseMeQueryOptions = {}) => {
  const api = useAuthApi();

  return useQuery({
    enabled,
    queryFn: api.currentUser,
    queryKey: ["auth", "me"],
    refetchOnWindowFocus: false,
    retry: false,
  });
};
