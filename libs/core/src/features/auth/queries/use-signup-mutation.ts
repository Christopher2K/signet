import { useMutation } from "@tanstack/react-query";
import { useAuthApiContext } from "../auth-api-context";
import type { SignupValues } from "../types";

/** Creates an account through TanStack Query. */
export const useSignupMutation = () => {
  const { getApi } = useAuthApiContext();

  return useMutation({
    mutationFn: ({ serverUrl, ...values }: SignupValues) =>
      getApi(serverUrl).signup(values),
  });
};
