---
name: react-strict-dom
description: Build, style, test, and debug cross-platform components with React Strict DOM (RSD). Use whenever a task involves react-strict-dom, html.* elements, css.create/css.defineVars, shared web and React Native UI, RSD design tokens, Expo or Vite RSD setup, Babel/PostCSS style extraction, RSD Storybook stories, migration from React DOM or React Native Web, or errors such as a runtime stylex.create call or missing RSD styles.
license: MIT
---

# React Strict DOM

Use React Strict DOM as a strict, web-aligned API for shared web and React Native UI—not as a drop-in replacement for every DOM, CSS, or React Native feature.

## Resources

- Read [references/signet.md](references/signet.md) before changing Signet's RSD package, consumers, or Storybooks. It records the verified workspace configuration and commands.
- Consult [references/official-llms.txt](references/official-llms.txt) for the upstream API guide, element support, styling rules, DOM APIs, migration examples, and `compat.native`.
- Upstream documentation: https://github.com/facebook/react-strict-dom/tree/main/packages/website/docs
- Check the installed `react-strict-dom` version before relying on a documented API. Upgrade the vendored guide when upgrading RSD.

## Workflow

1. **Inspect before editing.** Read the package manifests, installed RSD version, existing tokens/components, and every consumer's Babel, bundler, PostCSS, TypeScript, and Storybook configuration. Preserve the existing architecture and keep RSD on one version across the workspace.
2. **Write shared components by default.** Use `<html.*>` elements and module-level `css.create()` styles. Keep platform forks rare and deliberate.
3. **Configure every consumer.** Native compilation alone is insufficient for web: each web consumer needs RSD Babel transformation, PostCSS extraction, and an import of the stylesheet containing `@react-strict-dom`.
4. **Share stories.** Keep portable CSF stories beside shared components and register their glob in both Storybooks. Use explicit `argTypes` when docgen cannot analyze workspace sources.
5. **Verify rendering, not just compilation.** Run typechecks and production builds, then exercise web stories and native stories on real runtimes. A successful build does not prove that styles were extracted or that a native device rendered the component.

## Component Rules

- Import `{ css, html }` from `react-strict-dom`; use `style`, not `className`.
- Define styles at module scope. Compose them with arrays such as `style={[styles.base, variantStyles[variant], props.style]}`; put caller styles last.
- Use `css.defineVars()` in `*.css.{js,jsx,ts,tsx}` files for tokens and `css.createTheme()` for overrides.
- Nest pseudo-states and media queries inside properties and include `default`.
- Keep dynamic style functions to the supported arrow-function/object-literal form.
- Use standard RSD props: `for` rather than `htmlFor`, and `role="none"` rather than `role="presentation"`.
- Add `data-layoutconformance="strict"` to the app or story's root RSD element.
- Prefer shared files. Use `.web.tsx` or `.native.tsx` only for genuine platform differences; use `compat.native` sparingly to wrap React Native primitives.
- Do not assume web CSS works on native. Grid, inline layout, CSS animation, complex shortform values, and several positioning/function features are outside RSD's native subset.

## Setup Guardrails

### Expo and React Native

- Apply `babel-preset-expo` followed by `react-strict-dom/babel-preset`, passing Metro's caller `platform` and development flags.
- Configure TypeScript with `customConditions: ["react-native"]` and native module suffixes so RSD types match native runtime resolution.
- For Expo Web, also configure PostCSS and import the RSD directive stylesheet.
- Do not claim native verification from a Metro export alone. Inspect a simulator/device for runtime warnings and visual behavior.

### Vite 8

- `@vitejs/plugin-react@6` no longer runs Babel. Add `vite-plugin-babel` and explicitly include TypeScript app source, every workspace package containing RSD UI, and `react-strict-dom` itself.
- Put web platform extensions before generic extensions in both Vite resolution and Rolldown optimizer resolution.
- Include app and workspace RSD sources in the PostCSS plugin. Resolve globs relative to the PostCSS configuration's working directory, not another package.
- For SSR, mark both RSD and source-shipping workspace UI packages as `noExternal`.

### Storybook

- Load the RSD directive stylesheet in the web preview as well as the application entry.
- Use portable decorators built from RSD elements rather than DOM elements.
- Keep shared story controls explicit when TypeScript docgen skips files outside its active project. Do not disable docgen globally just to silence those warnings.
- Regenerate native `storybook.requires.ts` after changing story globs.

## Troubleshooting

- **`Unexpected 'stylex.create' call at runtime`:** the RSD Babel preset did not transform that source file. Fix the Babel include/filter and restart the bundler.
- **Web elements render without styles:** check the PostCSS include paths, the `@react-strict-dom` directive, and stylesheet imports in both the app and Storybook preview.
- **Native types or implementations resolve to web:** check TypeScript `customConditions`, module suffixes, Metro resolution, and duplicate RSD versions.
- **Fonts do not fall back as expected:** `css.firstThatWorks()` provides fallback for unsupported CSS values; it does not detect whether a font is installed. Load the intended font on every platform.
- **Unsupported native style warnings:** replace the unsupported CSS with RSD's shared subset or make a justified platform fork. Do not suppress warnings as the default fix.

## Completion Checklist

- Shared component and token types pass for all consumers.
- Web app and web Storybook production builds pass.
- Native Storybook/app bundle exports successfully.
- Shared stories appear in both Storybooks with usable controls.
- Web rendering and computed styles are inspected.
- Native rendering is inspected on a device, or the missing device/runtime verification is reported explicitly.
- Changed files pass the repository formatter and linter.
