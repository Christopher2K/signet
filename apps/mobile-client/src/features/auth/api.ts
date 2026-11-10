import {
  createApiClient,
  currentUser,
  login,
  logout,
  signup,
} from "@signet/api";
import { toAuthError } from "./errors";
import type { AuthApi } from "./types";

/** Runtime dependencies for the native auth API. */
export type CreateAuthApiOptions = {
  baseUrl: string;
  getToken: () => string | null | undefined;
  fetch?: typeof fetch;
};

/** Creates auth operations backed by the deployment-configured API. */
export const createAuthApi = ({
  baseUrl,
  fetch,
  getToken,
}: CreateAuthApiOptions): AuthApi => {
  const client = createApiClient({
    auth: () => getToken() ?? undefined,
    baseUrl,
    fetch,
  });

  return {
    login: async (body) => {
      try {
        const result = await login({ body, client });
        if (result.data) {
          return result.data.data;
        }
        throw toAuthError(result.error);
      } catch (error) {
        throw toAuthError(error);
      }
    },
    signup: async (body) => {
      try {
        const result = await signup({ body, client });
        if (result.data) {
          return result.data.data;
        }
        throw toAuthError(result.error);
      } catch (error) {
        throw toAuthError(error);
      }
    },
    currentUser: async () => {
      try {
        const result = await currentUser({ client });
        if (result.data) {
          return result.data.data;
        }
        throw toAuthError(result.error);
      } catch (error) {
        throw toAuthError(error);
      }
    },
    logout: async () => {
      try {
        const result = await logout({ client });
        if (result.error) {
          throw toAuthError(result.error);
        }
      } catch (error) {
        throw toAuthError(error);
      }
    },
  };
};
