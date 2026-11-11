---
name: Client Internationalization
description: Use when adding, editing, reviewing, or testing user-facing text in Signet's mobile, web, or shared client code; when changing @signet/locale, locale detection or formatting, Accept-Language propagation, or native locale configuration.
---

# Client internationalization

Every user-facing message must be available in English (`en`) and French (`fr`). A client change is incomplete when copy is hard-coded, exists in only one catalog, or loses its translation during refactoring.

## Workflow

1. Inventory all user-facing text introduced or changed by the task: labels, titles, placeholders, help text, buttons, alerts, validation and server-error fallbacks, loading/empty states, notifications, accessibility labels, and native metadata.
2. Add matching keys and translations to both languages under `libs/locale/src/resources/`:
   - `common/`: genuinely shared client messages.
   - `mobile/`: Expo-specific messages.
   - `web/`: web-specific messages.
3. Keep English and French key structures identical. Preserve interpolation names and i18next plural suffixes such as `_one` and `_other` across both catalogs. Translate the whole phrase rather than assembling translated fragments.
4. Render messages with `useTranslation` from `@signet/locale/react`, selecting the appropriate namespace. Use `common:key` for common messages from a platform namespace. Do not create another catalog or translation provider for a feature.
5. Format dates, numbers, and counts with the active locale from `useLocale()` and `Intl` APIs. Pass formatted values through translation interpolation when they are part of a sentence.
6. Cover the changed behavior with tests, including catalog parity and any affected locale negotiation, formatting, or API-header behavior.

## Locale detection

Preserve the existing platform adapters unless the requirements explicitly change:

- Mobile: `apps/mobile-client/src/app/_layout.tsx` maps `useLocales()` from `expo-localization` through `resolveLocale()`.
- Web: `apps/web-client/src/app-locale.tsx` resolves ordered `navigator.languages`, then `navigator.language`, and synchronizes `<html lang>`.
- `libs/locale/src/locale.ts` owns supported-language normalization, ordered negotiation, and English fallback.
- Detection is automatic; do not add a language picker or persisted preference unless requested.
- Keep `LocaleProvider` above translation consumers and API-provider composition.

When native language support changes, also update the `expo-localization` plugin's `supportedLocales` in `apps/mobile-client/app.json` and regenerate native projects with Expo prebuild.

## API language propagation

Use `getLocale` from `useLocale()` as `getLanguage` when creating a handwritten API client. Keep request-header behavior centralized in `libs/api/src/client.ts`; do not add per-screen headers or edit generated client files. The interceptor must continue to respect an explicitly supplied `Accept-Language` header and read the language at request time.

## Verification

Run the locale checks and the relevant application tests/typechecks:

```sh
devenv shell -- pnpm --filter @signet/locale test
devenv shell -- pnpm --filter @signet/locale typecheck
```

Before finishing, search the touched client code for remaining hard-coded user-facing copy and verify English/French key and placeholder parity. Exercise both languages for behavior changes when practical, and check that longer French text wraps without clipping or obscuring actions.
