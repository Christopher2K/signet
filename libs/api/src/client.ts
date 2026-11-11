import {
  type Client,
  type Config,
  createClient,
  createConfig,
} from "./generated/client";
import type { ClientOptions } from "./generated/types.gen";

/** Configured Signet API client. */
export type ApiClient = Client;

/** Runtime configuration supplied by each application. */
export type ApiClientOptions = Config<ClientOptions> & {
  /** Returns the current language for outgoing API requests. */
  getLanguage?: () => string;
};

/** Creates an isolated client with application-specific URL and authentication. */
export const createApiClient = (options: ApiClientOptions): ApiClient => {
  const { getLanguage = () => "en" } = options;
  const config = { ...options };
  delete config.getLanguage;
  const client = createClient(createConfig(config as Config<ClientOptions>));
  client.interceptors.request.use((request) => {
    if (!request.headers.has("Accept-Language")) {
      request.headers.set("Accept-Language", getLanguage());
    }
    return request;
  });
  return client;
};
