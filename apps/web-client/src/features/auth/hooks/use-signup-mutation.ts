import { useMutation } from "@tanstack/react-query";
import { useAuthApi } from "../auth-api-context";

/** Creates an account through TanStack Query. */
export const useSignupMutation = () => {
  const api = useAuthApi();

  return useMutation({ mutationFn: api.signup });
};
