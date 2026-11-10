# Signet Agent Instruction files 

---

This is a multi repo for the Signet application ecosystem.

## Repository structure

- `apps` contains all applications.
  - The backend API is built with Elixir and Phoenix.
  - The mobile app is built with React Native and Expo.
  - The web app is built with TanStack Start, React, and Vite.
- `libs` contains all shared libraries that clients can reuse.

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

