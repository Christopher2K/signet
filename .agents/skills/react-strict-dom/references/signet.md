# Signet React Strict DOM Integration

This reference describes the configuration verified in this repository. Re-read the files before editing; treat this as a map, not a substitute for the source.

## Architecture

- `libs/design-system` publishes `@signet/design-system` as workspace TypeScript source. There is deliberately no package build step; each consumer's bundler compiles the source.
- The package currently uses `react-strict-dom` `0.0.55`. Keep the version aligned with both clients.
- `src/tokens.css.ts` contains semantic light/dark colors, spacing, radii, and typography using `css.defineVars()`.
- `src/components/button.tsx` is the initial shared component; `button.stories.tsx` supplies the same stories to web and native.
- Dimensional token values use pixel strings because the current `css.defineVars()` typings rejected raw numbers. Ordinary RSD styles can still use supported numeric values.
- Space Mono is named by the typography token. Mobile and web bundle its Regular 400 and Bold 700 files; native consumers register both cuts with Expo Font and web provides matching `@font-face` rules.

## File Map

### Shared package

- `libs/design-system/src/index.ts` — public exports
- `libs/design-system/src/tokens.css.ts` — tokens
- `libs/design-system/src/components/` — components and shared CSF stories
- `libs/design-system/README.md` — consumer guidance

### Web consumer

- `apps/web-client/babel.config.js` — RSD web Babel preset
- `apps/web-client/vite.config.ts` — `vite-plugin-babel`, platform extensions, Rolldown optimizer extensions, and SSR `noExternal`
- `apps/web-client/postcss.config.js` — RSD static CSS extraction
- `apps/web-client/src/strict.css` — required `@react-strict-dom` directive
- `apps/web-client/src/routes/__root.tsx` — application stylesheet import
- `apps/web-client/.storybook/preview.tsx` — Storybook stylesheet import
- `apps/web-client/.storybook/main.ts` — shared story discovery and docgen exclusions

The Vite Babel include covers app `src`, `libs/design-system`, and `react-strict-dom`. The PostCSS include separately covers:

```text
src/**/*.{js,jsx,mjs,ts,tsx}
../../libs/design-system/src/**/*.{js,jsx,mjs,ts,tsx}
```

These paths are relative to `apps/web-client`. Do not copy the Storybook glob into PostCSS: their base directories differ.

### Native consumer

- `apps/mobile-client/babel.config.js` — Expo preset followed by RSD preset
- `apps/mobile-client/tsconfig.json` — native conditions and module suffixes
- `apps/mobile-client/.rnstorybook/main.ts` — shared story discovery
- `apps/mobile-client/.rnstorybook/storybook.requires.ts` — generated native story registry; do not hand-edit

Both Storybooks use this glob from their respective config directories:

```text
../../../libs/design-system/src/**/*.stories...
```

Native Storybook is enabled with `STORYBOOK_ENABLED=true`.

## Storybook Conventions

Shared stories use `@storybook/react` types and `storybook/test` utilities. Decorators use `<html.div data-layoutconformance="strict">`, not a web-only DOM wrapper.

The web docgen configuration excludes `.storybook/preview.tsx` and `libs/design-system`; the shared stories declare portable `argTypes` explicitly. This avoids active-TypeScript-project warnings without disabling docgen for the rest of the web app. Revisit this choice if workspace project references later make automatic docgen reliable.

## Verification Commands

Run through the repository's development environment:

```sh
devenv shell -- pnpm exec biome check libs/design-system/src
devenv shell -- pnpm --filter @signet/design-system typecheck
devenv shell -- pnpm --filter @signet/web-client exec tsc --noEmit
devenv shell -- pnpm --filter @signet/mobile-client exec tsc --noEmit
devenv shell -- pnpm --filter @signet/web-client build
devenv shell -- pnpm --filter @signet/web-client build-storybook
devenv shell -- pnpm --filter @signet/web-client exec vitest run --project storybook
```

Export native Storybook after shared component, story, or RSD configuration changes:

```sh
devenv shell -- env STORYBOOK_ENABLED=true \
  pnpm --filter @signet/mobile-client exec expo export \
  --platform ios --output-dir "$TMPDIR/signet-mobile-storybook"
```

For interactive use:

```sh
devenv shell -- pnpm --filter @signet/web-client storybook
devenv shell -- pnpm --filter @signet/mobile-client storybook
```

A web build can pass even when RSD was not compiled correctly, and a native export can pass without proving native rendering. Inspect the browser story and an actual native runtime whenever available. If no simulator/device exists, state that limitation rather than marking native visual verification complete.

## Lessons from the Initial Integration

1. Shipping workspace source avoids maintaining a second RSD compilation pipeline, but every consumer must transform that source.
2. Vite 8 requires `vite-plugin-babel`; passing Babel options to `@vitejs/plugin-react@6` has no effect.
3. Babel and PostCSS includes are both required on web and have different path bases.
4. `css.firstThatWorks()` does not provide font-availability detection. Bundle fonts rather than treating it as a missing-font fallback mechanism.
5. A shared story registry and a successful export verify native discovery/bundling, not device behavior.
6. Biome flags the custom `@react-strict-dom` at-rule; the local suppression in `strict.css` is intentional because PostCSS replaces that required directive.
