# @signet/design-system

Shared Signet UI built with [React Strict DOM](https://facebook.github.io/react-strict-dom/). Components, design tokens, and CSF stories are consumed directly as TypeScript source by the web and mobile bundlers.

## Usage

```tsx
import { Button, colors, spacing, Typography } from "@signet/design-system";

export const SaveButton = () => (
  <Button variant="primary" size="md" onClick={() => {}}>
    Save bookmark
  </Button>
);
```

`Button` supports `primary` and `secondary` variants, `sm`, `md`, and `lg` sizes, and the native `disabled` state. Additional React Strict DOM button properties can be passed through.

`Typography` centralizes the six type variants from `DESIGN.md`. Its polymorphic `as` prop accepts React Strict DOM tags while preserving tag-specific properties, and `tone` selects a semantic text color.

```tsx
<Typography as="h1" variant="headline">
  Your library
</Typography>
<Typography as="p" tone="secondary">
  Your saved bookmarks will appear here.
</Typography>
```

## Consumers

Both clients depend on the package with `@signet/design-system: workspace:*` and use the same `react-strict-dom` version.

- **Web:** `apps/web-client/vite.config.ts` transforms workspace and React Strict DOM sources with Babel. `postcss.config.js` extracts their styles, and `src/strict.css` imports the generated CSS. The root route and Storybook preview load this stylesheet.
- **Mobile:** `apps/mobile-client/babel.config.js` applies `babel-preset-expo` followed by the React Strict DOM preset. Shared stories are registered in `.rnstorybook/main.ts`.
- **Stories:** add stories next to components under `src`; both Storybooks discover them automatically.

Run Storybook with `pnpm --filter @signet/web-client storybook` or `pnpm --filter @signet/mobile-client storybook`. After changing native story globs, regenerate `.rnstorybook/storybook.requires.ts` with the native Storybook CLI or an Expo export.

## Tokens and fonts

Semantic light/dark colors, spacing, radii, and typography are exported from `src/tokens.css.ts`. Color values come from the Paper & Cobalt palette in `DESIGN.md`. Native-only chrome and layout tokens are available from `@signet/design-system/native-theme`, keeping React Native out of web bundles.

The typography token names **Necto Mono**. The mobile client bundles and registers Necto Mono with Expo Font; web consumers must provide a matching `@font-face` rule to render that exact typeface.
