import { useMutation } from "@tanstack/react-query";
import { useAuthApiContext } from "../auth-api-context";

/** Revokes the current session through TanStack Query. */
export const useLogoutMutation = () => {
  const { getApi } = useAuthApiContext();

  return useMutation({ mutationFn: () => getApi().logout() });
};
