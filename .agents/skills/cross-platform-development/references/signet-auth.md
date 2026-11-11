# Signet Cross-Platform Auth Reference

This reference records the architecture established for shared authentication. Re-read the working tree before changing it, and follow `../SKILL.md` for the general rules.

## File Map

### Shared package

- `libs/core/package.json` — source exports for `@signet/core/auth` and `@signet/core/auth/react`, plus optional React/platform peers.
- `libs/core/src/features/auth/auth-api.ts` — generated-client adapter with injected base URL, token callback, and optional fetch.
- `libs/core/src/features/auth/auth-errors.ts` — stable API/network error categories and messages.
- `libs/core/src/features/auth/auth-types.ts` — shared API, credential, session-state, and context contracts.
- `libs/core/src/features/auth/auth-validation.ts` — common email, name, and password rules.
- `libs/core/src/features/auth/auth-server-url.ts` — pure HTTP/HTTPS URL normalization and validation.
- `libs/core/src/features/auth/auth-provider.tsx` — API/storage configuration and provider composition.
- `libs/core/src/features/auth/auth-session-provider.tsx` — shared React Query session lifecycle and operation ordering.
- `libs/core/src/features/auth/auth-queries.ts` — shared login, signup, logout, and current-user hooks.
- `libs/core/src/features/auth/auth-session-storage.types.ts` — common asynchronous persistence contract.
- `libs/core/src/features/auth/auth-session-storage.native.ts` — AsyncStorage token and selected-server adapter.
- `libs/core/src/features/auth/auth-session-storage.web.ts` — guarded browser localStorage adapter.

### Native composition

- `apps/mobile-client/src/features/auth/auth-session-provider.tsx` supplies `DEFAULT_SERVER_URL` and requires a persisted server during restoration.
- `apps/mobile-client/src/features/auth/types.ts` adds the required native `serverUrl` form field.
- `apps/mobile-client/src/features/auth/validation.ts` composes shared credential validation with Server URL validation.
- Screens, forms, navigation, splash handling, and safe-area/keyboard behavior remain native-owned.

### Web composition

- `apps/web-client/src/features/auth/auth-context.tsx` reads `API_URL` only when no API override is injected.
- `apps/web-client/src/features/auth/index.ts` is the web feature's public composition boundary.
- Forms, TanStack Router guards, links, and layout remain web-owned.

Consumers import core directly. Do not recreate deleted pass-through modules such as client `errors.ts`, `api.ts`, or `validation.ts` files.

## Behavioral Requirements

- Web uses its deployment-configured backend and does not display a Server URL field.
- Native login/signup selects an absolute HTTP/HTTPS server, normalizes trailing slashes, and persists it with the session.
- Native restoration requires both token and server URL; the last selected server remains after logout.
- Remote logout is best-effort, while local logout always completes.
- Unauthorized restoration clears the saved token and query cache.
- Other restoration failures expose the unavailable state and retry behavior.
- A failed persistence write does not invalidate an otherwise successful in-memory session.
- Query keys include the server URL but never the bearer token.
- Competing session operations and storage transitions are ordered to avoid stale in-memory or persisted state.

The native adapter currently uses AsyncStorage. Product requirement M-06 calls for secure token persistence; use the existing adapter seam when migrating to SecureStore rather than weakening the shared contract or moving native storage into application screens.

## Test Map

- `auth-api.test.ts` — API URLs, response envelopes, bearer authentication, and error normalization.
- `auth-errors.test.ts` — stable messages, validation fields, network failures, and unexpected-error redaction.
- `auth-validation.test.ts` — shared credential rules.
- `auth-server-url.test.ts` — normalization, protocols, credentials, query strings, fragments, and malformed URLs.
- `auth-session-storage.web.test.ts` — browser round trips and blocked storage access.
- `auth-session-storage.native.test.ts` — token/server persistence, token-only clearing, and native read failures.
- `auth-provider.test.tsx` — restoration, server selection, persistence failures, unauthorized cleanup, and deferred concurrency cases.
- `auth-queries.test.tsx` — verifies that the query function and query key use the same server.

Keep provider tests independent of real native/browser storage by injecting API and storage adapters. Use deferred promises to control operation ordering explicitly.

## Verification Commands

```sh
devenv shell -- pnpm --filter @signet/core test
devenv shell -- pnpm --filter @signet/core typecheck
devenv shell -- pnpm --filter @signet/web-client test
devenv shell -- pnpm --filter @signet/web-client typecheck
devenv shell -- pnpm --filter @signet/web-client build
devenv shell -- pnpm --filter @signet/mobile-client exec tsc --noEmit
devenv shell -- pnpm exec biome check libs/core apps/mobile-client/src apps/web-client/src
```

Export native applications separately after changing shared provider or adapter code:

```sh
devenv shell -- pnpm --filter @signet/mobile-client exec expo export \
  --platform ios --output-dir "$TMPDIR/signet-core-ios"

devenv shell -- pnpm --filter @signet/mobile-client exec expo export \
  --platform android --output-dir "$TMPDIR/signet-core-android"
```

The separate Expo web target also involves the React Strict DOM pipeline; follow `react-strict-dom` for that target rather than treating it as a core-logic check. Inspect actual web and native auth flows when runtimes are available, and report any unavailable runtime verification explicitly.
