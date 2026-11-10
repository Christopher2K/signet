import { useMutation } from "@tanstack/react-query";
import { useAuthApi } from "../auth-api-context";

/** Logs in with email and password through TanStack Query. */
export const useLoginMutation = () => {
  const api = useAuthApi();

  return useMutation({ mutationFn: api.login });
};
