# @signet/api

Shared TypeScript client generated from `apps/api/openapi.json`.

## Generate

From the repository root, run `generate-api-client` inside devenv. This regenerates both the OpenAPI document and the TypeScript client. Use `check-api-client` to verify that neither artifact has drifted.

Within this package, `pnpm generate` regenerates only the TypeScript client, `pnpm check-generated` checks its output, and `pnpm typecheck` validates it.

## Use

Create a client in each application with its own base URL and optional bearer-token provider:

```ts
import { createApiClient } from "@signet/api";

const apiClient = createApiClient({
  baseUrl: "https://api.example.com",
  auth: () => getAccessToken(),
});
```

Pass the client to generated SDK functions or TanStack Query options. Create a separate client for each web SSR request rather than storing user authentication in a process-global client.

```ts
import { currentUserOptions } from "@signet/api/react-query";

const options = currentUserOptions({ client: apiClient });
```

Generated files under `src/generated` must not be edited manually. Token storage, unauthorized handling, Query providers, and router integration remain application responsibilities.
