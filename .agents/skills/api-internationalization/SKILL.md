---
name: API Internationalization
description: Use when adding, editing, reviewing, or testing user-facing messages in Signet's Phoenix API, including Ecto validation and request-validation errors; when changing Gettext catalogs, Accept-Language negotiation, locale plugs, Content-Language, Vary, or locale-related CORS behavior.
---

# API internationalization

Every human-readable API message must be available in English (`en`) and French (`fr`). Translate messages without changing stable error codes, field paths, response schemas, or generated-client boundaries.

## Translate messages

1. Find every user-facing message in the changed request path, including controller and plug errors, fallback responses, Ecto changeset errors, request-body validation, rate limits, and framework error responses where applicable.
2. Route messages through `SignetWeb.Gettext`:
   - Use `gettext` for the default domain.
   - Use `dgettext("errors", ...)` for the errors domain.
   - Use `dngettext` for count-dependent messages.
   - Keep interpolation bindings such as `%{name}` and `%{count}` identical in every translation.
3. Extract and merge catalogs after changing Gettext calls:

   ```sh
   devenv shell -- bash -c 'cd apps/api && mix gettext.extract --merge'
   ```

4. Fill the corresponding `msgstr` values in both `apps/api/priv/gettext/en/LC_MESSAGES/` and `apps/api/priv/gettext/fr/LC_MESSAGES/`. Keep the source English `msgid` stable where possible so existing translations are not orphaned. Include the updated POT and PO files with the change.
5. Add or update tests proving the affected response is translated in both languages. Include plural and interpolation cases when relevant.

Do not translate machine-readable error codes, field names, or field paths. Clients must be able to keep handling errors independently of the selected language.

## Request locale lifecycle

`apps/api/lib/signet_web/plugs/set_locale.ex` negotiates the locale for each request, sets the Gettext locale, assigns `conn.assigns.locale`, emits `Content-Language`, and merges `Accept-Language` into `Vary` without duplication or replacing `Vary: *`.

`apps/api/lib/signet_web/accept_language.ex` owns weighted header parsing, regional-tag normalization, unsupported-language filtering, and English fallback. `apps/api/lib/signet_web/endpoint.ex` installs the plug before request handling and allows `Accept-Language` through CORS.

Preserve per-request locale isolation: do not replace request-local Gettext state with a global application locale. Keep response-header and CORS behavior intact when moving plugs or middleware.

## Verification

Run focused tests for changed negotiation or response behavior, then the API suite:

```sh
devenv shell -- bash -c 'cd apps/api && mix test test/signet_web/accept_language_test.exs test/signet_web/plugs/set_locale_test.exs'
devenv shell -- bash -c 'cd apps/api && mix test'
```

Test at least one English and one French request for new translated API responses, asserting both the body and `Content-Language` where practical. Include unsupported and missing language coverage when negotiation changes.

If an endpoint or its request/response schemas also changed, follow the root `AGENTS.md` requirement to regenerate and check the OpenAPI document and shared TypeScript client. Translation-only message changes must not alter generated schemas.
