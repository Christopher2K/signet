---
name: cross-platform-development
description: Build and refactor shared TypeScript and React features across Signet's Expo mobile and web clients. Use when introducing or extending libs/core, extracting duplicated feature logic, designing .native/.web platform adapters, sharing React Query hooks or providers, configuring cross-platform module resolution, deciding what should remain app-specific, or testing asynchronous session and persistence behavior. For shared visual components use react-strict-dom; for design tokens and component conventions use expo-design-system.
---

# Cross-Platform Development

Share behavior without erasing intentional platform differences. Put domain rules and common state orchestration in `libs/core`, hide infrastructure differences behind narrow adapters, and leave navigation, environment configuration, and user experience in each client.

For Signet's concrete auth implementation and verification commands, read [references/signet-auth.md](references/signet-auth.md). Re-read the source before editing; the reference is a map, not a substitute for it.

## Start With Both Implementations

Before extracting code, inspect both clients, their tests, the relevant product/design requirements, and the workspace package/bundler configuration.

Classify each piece of behavior:

1. **Identical:** move it unchanged with its tests.
2. **Common with platform inputs:** share the algorithm and inject the differing values or services.
3. **Intentionally different:** keep it in the client or behind a small platform adapter.
4. **Duplicated but diverging:** do not force it into a common abstraction merely to remove lines.

Preserve differences required by the product. Native server selection, browser deployment configuration, secure storage, keyboard behavior, and router semantics are not accidental duplication.

Load `typescript-style`, `react-style`, and `version-management` for implementation work. Load `expo-overview` for Expo-specific setup and `react-strict-dom` when shared UI is involved.

## Dependency Boundaries

Use this direction:

```text
mobile-client ─┐
               ├─> @signet/core ─> @signet/api
web-client ────┘

mobile/web ─────> @signet/design-system
```

- Apps may consume core, API, and design-system packages.
- Core may consume generated API contracts, but never either app.
- Core must not import app aliases, routers, environment variables, or screen components.
- API and design-system packages remain independent of core.
- Declare every imported dependency explicitly; hoisted workspace modules can hide missing manifest entries.
- Use `workspace:*` for internal packages and the pnpm catalog conventions for shared external versions.

## Feature Package Structure

Organize core by feature, not by technical layer:

```text
libs/core/src/features/<feature>/
├── index.ts                 # Pure feature entry point
├── react.ts                 # Optional React entry point
├── api.ts
├── errors.ts
├── types.ts
├── validation.ts
├── hooks/
├── <provider>.tsx
├── <resource>-storage.types.ts
├── <resource>-storage.native.ts
└── <resource>-storage.web.ts
```

Expose deliberate package subpaths:

- `@signet/core/<feature>` for platform-neutral TypeScript.
- `@signet/core/<feature>/react` when React contexts, hooks, or providers are shared.

Keep the pure entry free of React and platform dependencies. Follow the existing source-shipping package pattern: conditional exports into `src`, `sideEffects: false`, and no redundant library build step.

Apps should import these entry points directly. Do not leave client files that only re-export core symbols. A client wrapper is justified only when it adds configuration or platform behavior, such as reading an environment variable or supplying a native default server.

## What Belongs Where

| Shared pure feature code | Shared React integration | Platform adapters | Client applications |
| --- | --- | --- | --- |
| Domain types and validation | Contexts and providers | Storage | Screens and layouts |
| API orchestration | Query/mutation hooks | Connectivity | Navigation and guards |
| Error normalization | Shared async lifecycle | Browser/native services | Environment selection |
| Normalization and policies | Cache coordination | Platform capabilities | Keyboard and safe areas |

Do not share complete screens just because the underlying logic is shared. The design system owns visual primitives; core owns feature behavior; apps compose them into platform-appropriate experiences.

## Platform Extensions

Use `.native.ts`, `.web.ts`, and more specific `.ios.ts` or `.android.ts` files only at genuine platform boundaries. Good candidates include storage, connectivity, file systems, notifications, and secure enclaves. Do not fork validation, errors, or other pure logic.

A shared module imports the adapter without a suffix:

```ts
import { sessionStorage } from "./session-storage";
```

Both implementations must satisfy the same contract. When one platform is asynchronous, make the shared contract asynchronous on every platform:

```ts
/** Persisted session data available on the current platform. */
export type StoredSession = {
  token: string | null;
  serverUrl: string | null;
};

/** Asynchronous platform adapter for session persistence. */
export type SessionStorageAdapter = {
  readStoredSession: () => Promise<StoredSession>;
  writeStoredSession: (token: string, serverUrl: string) => Promise<void>;
  clearSessionToken: () => Promise<void>;
};
```

A web adapter can wrap synchronous `localStorage`; a native adapter can use AsyncStorage or SecureStore without changing the consumer.

### Adapter Rules

- Put the common contract in a separate `*.types.ts` file and use `satisfies` in both implementations.
- Access browser globals lazily and inside `try` blocks. Even reading `window.localStorage` can throw under security policies.
- Keep environment selection outside adapters; inject base URLs and other configuration.
- Declare native-only imports as optional library peers and install the concrete implementation in the native app.
- Allow API and storage adapters to be injected in provider tests.
- Treat persistence failure semantics explicitly. If authentication is intended to remain usable in memory, do not let a rejected storage write strand the operation.

### Resolution and Typechecking

Runtime and TypeScript resolution must agree:

- Expo/Metro resolves native platform extensions automatically.
- Vite must list web extensions before generic extensions in application and optimizer resolution.
- Native TypeScript uses native `moduleSuffixes` and the `react-native` condition.
- Web TypeScript needs `moduleSuffixes: [".web", ""]` when no generic implementation exists.
- Include both implementations in core typechecking, and typecheck both consumers to verify their selected modules.
- Configure the test runner to resolve the intended web adapter or import platform implementations explicitly in adapter tests.

A successful core typecheck alone does not prove that Metro and Vite selected the intended runtime files.

## Shared React Query Behavior

React Query can own server-state behavior on both web and React Native. Reuse query/mutation hooks and providers when their semantics match; do not build a second native state system around the same API.

Rules for shared providers:

- Hydrate asynchronous stored credentials before enabling a restoration query.
- Use an API factory for dynamic native servers rather than a process-global authenticated client.
- Include the selected server or resource identity in query keys.
- Never put bearer tokens or other secrets in query keys.
- Keep the active token in memory so a blocked persistence write does not invalidate a successful login.
- Clear or invalidate the correct cache entries after login, signup, logout, and account/server switches.
- Cancel in-flight restoration when logging out.
- Keep React Query's `QueryClientProvider` in the application root.

React Native does not automatically provide browser focus and connectivity events. Add `focusManager` with `AppState` and `onlineManager` with an Expo-compatible network API only when refetch-on-focus/reconnect is desired; they are not prerequisites for sharing queries.

## Async Lifecycle and Persistence Races

Shared session code must be correct under interleaving, not just the happy path.

- Use an operation generation or equivalent guard so stale reads cannot update state after logout, retry, or unmount.
- Check the generation after every asynchronous boundary before changing refs, cache, or state.
- Serialize competing authentication attempts when allowing them to run concurrently could persist a session that was never applied in memory.
- Serialize storage transitions so an older clear cannot remove a newer session after its write.
- Reset promise queues after rejection; otherwise one failed operation poisons every later operation.
- Decide whether storage is transactional or best-effort. Do not silently claim transactional behavior when an already-running stale write cannot be cancelled.
- Preserve local logout even if remote revocation fails.

A generation check is not a persistence transaction: a stale write can finish after it becomes stale. Serialize the complete attempt or add deliberate compensating persistence.

## Extraction Workflow

1. Extract pure domain types, errors, API orchestration, and validation with their existing tests.
2. Introduce the common adapter contract and thin `.native`/`.web` implementations.
3. Share React Query hooks, then the provider if its behavior can preserve both platforms' requirements.
4. Supply deployment/native configuration through thin app wrappers.
5. Update consumers to import core directly and delete pass-through re-export files.
6. Add missing adapter and concurrency tests before removing the old implementation.
7. Run core tests plus every consumer's typecheck, tests, and production bundle.
8. Exercise important flows in real runtimes when available; a bundle is not a behavioral test.

Prefer small, behavior-preserving extractions over redesigning storage, navigation, or visual presentation in the same change.

## Testing Matrix

Test each layer at its own boundary:

- **Pure core:** API envelopes, normalized errors, validation, normalization, and domain policies.
- **Web adapter:** round trips, blocked methods, and a throwing browser-storage getter.
- **Native adapter:** persisted fields, restoration, token-only clearing, and read/write failures using a mocked native module.
- **Shared provider:** empty restoration, valid restoration, unauthorized cleanup, server selection, unavailable retry, and persistence failures with injected API/storage doubles.
- **Concurrency:** logout during restoration, unauthorized cleanup versus login, competing authentication attempts, delayed writes, and rejected storage operations using deferred promises.
- **Consumers:** typechecks and production builds for web, iOS, and Android, followed by runtime login/logout/restoration checks when possible.

Do not duplicate core domain tests in each app. Keep app tests for app-specific composition and platform behavior.

## Completion Checklist

- Core is organized by feature with pure and React entry points as needed.
- No core module imports an app, router, environment variable, or app-owned alias.
- Platform extensions are limited to thin adapters with identical contracts.
- Both platform implementations and both consumer resolution paths are checked.
- Direct imports replaced pass-through client re-exports.
- Async lifecycle, stale operations, and storage failures have regression coverage.
- Core tests, consumer typechecks, and relevant production bundles pass.
- Runtime limitations and any unrelated pre-existing build failures are reported explicitly.
- Changed files pass the repository formatter, linter, and `git diff --check`.
