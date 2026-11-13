# Signet website

The public marketing site, built with TanStack Start, React Strict DOM, the shared Signet design system, and Vite.

## Develop

```sh
pnpm --filter @signet/website dev
```

The development server runs on `http://localhost:3001`.

## Static build

```sh
pnpm --filter @signet/website build
```

TanStack Start prerenders the static landing route during the build. Deploy the contents of `dist/client` to any static host; the prerendered page is written to `dist/client/index.html` alongside the hydrated client assets.
