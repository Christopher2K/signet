import { useMutation } from "@tanstack/react-query";
import { useAuthApiContext } from "../auth-api-context";
import type { LoginValues } from "../types";

/** Logs in with email and password through TanStack Query. */
export const useLoginMutation = () => {
  const { getApi } = useAuthApiContext();

  return useMutation({
    mutationFn: ({ serverUrl, ...values }: LoginValues) =>
      getApi(serverUrl).login(values),
  });
};
