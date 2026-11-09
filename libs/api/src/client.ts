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
export type ApiClientOptions = Config<ClientOptions>;

/** Creates an isolated client with application-specific URL and authentication. */
export const createApiClient = (options: ApiClientOptions): ApiClient =>
  createClient(createConfig(options));
