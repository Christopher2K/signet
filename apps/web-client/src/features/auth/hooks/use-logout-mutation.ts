import { useMutation } from "@tanstack/react-query";
import { useAuthApi } from "../auth-api-context";

/** Revokes the current session through TanStack Query. */
export const useLogoutMutation = () => {
  const api = useAuthApi();

  return useMutation({ mutationFn: api.logout });
};
