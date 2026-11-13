# Signet Agent Instruction files 

---

This is a multi repo for the Signet application ecosystem.

## Repository structure

- `apps` contains all applications.
  - The backend API is built with Elixir and Phoenix.
  - The mobile app is built with React Native and Expo.
  - The web app is built with TanStack Start, React, and Vite.
- `libs` contains all shared libraries that clients can reuse.

## Internationalization

Everything user-facing must be translated into English (`en`) and French (`fr`). Never introduce hard-coded user-facing text or leave a message in only one language. This includes labels, placeholders, accessibility text, loading and empty states, validation, errors, alerts, and native metadata when applicable.

- Use the `client-internationalization` skill for mobile, web, and shared client messages, locale detection and formatting, and API language propagation.
- Use the `api-internationalization` skill for Phoenix messages, Gettext catalogs, and request locale negotiation.

## Native UI

Native navigation and toolbar elements must use Expo Router's native APIs, such as `Stack.Toolbar` and `Stack.Toolbar.Button`, instead of custom React Native substitutes. Do not recreate native chrome with custom views; preserve platform-native behavior, accessibility, touch targets, pressed states, and theming.

## API client generation

Whenever you add, change, or remove an API endpoint or its request/response schemas, regenerate the OpenAPI document and shared TypeScript client before finishing:

```sh
devenv shell -- generate-api-client
devenv shell -- check-api-client
```

Commit the endpoint changes together with `apps/api/openapi.json` and `libs/api/src/generated`. Never edit generated client files manually.

## Specifications

- For the design direction, follow the [design specification](./DESIGN.md).
- For the product direction, follow the [product specification](./SPECIFICATION.md).
- Whenever app designs change, update the corresponding screens in `design/client-designs.pen` in the same change so the implementation and canonical Pen designs stay in sync.

