---
name: version-management
description: "Manage Signet's JavaScript dependency versions with pnpm workspace catalogs. Use when adding, upgrading, deduplicating, auditing, or removing dependencies; editing pnpm-workspace.yaml catalogs or catalog: references; or updating pnpm-lock.yaml."
---

# Version Management

Use `pnpm-workspace.yaml` as the source of truth for shared dependency version ranges. Read it and the relevant workspace `package.json` files before editing; do not rely on remembered versions.

## How the pnpm catalog works

The top-level `catalog` field in `pnpm-workspace.yaml` defines the **default catalog**:

```yaml
catalog:
  react: 19.3.0
  react-dom: 19.3.0
```

A manifest references an entry with the `catalog:` protocol:

```json
{
  "dependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

`catalog:` is shorthand for `catalog:default`. pnpm substitutes the range from the catalog during resolution. A catalog entry does **not** install a dependency by itself; each consuming package must still declare it.

The catalog stores version ranges, while `pnpm-lock.yaml` records the selected catalog range and the exact resolved version. Never edit the lockfile manually. pnpm replaces `catalog:` with the concrete range when packing or publishing a package.

Catalog entries are keyed by exact package name. One entry cannot configure a whole scope such as `@storybook/*`; related packages need separate entries and deliberate version alignment.

### Named catalogs

Prefer the default catalog when the workspace should share one range. Use a named catalog only when different ranges must coexist, such as during an incremental migration:

```yaml
catalogs:
  react18:
    react: ^18.3.1
```

```json
{
  "dependencies": {
    "react": "catalog:react18"
  }
}
```

Do not create named catalogs merely to group related packages.

## Signet conventions

- Move repeated external dependencies with the **same intended range** into the default catalog and use `"catalog:"` in their manifests.
- Preserve the existing range during a catalog refactor. Changing `~` to `^`, pinning a range, or upgrading a version is a separate behavioral change.
- Leave single-use dependencies direct unless the user asks to centralize all versions or a future consumer needs alignment.
- Keep React, React DOM, React Native, React Strict DOM, TypeScript, and Storybook versions aligned across their consumers. Check compatibility before changing any of them.
- `catalog:` is valid in dependencies, dev dependencies, optional dependencies, and peer dependencies. However, preserve broad library peer ranges such as `^19.0.0` or `>=0.79.5`; replacing them with an application version can unnecessarily exclude valid consumers.
- Keep internal package references such as `@signet/design-system: workspace:*` unless there is a specific reason to change the workspace protocol.
- Do not force packages onto one catalog range when they intentionally require different versions. Use a direct range or a named catalog instead.
- The repository uses pnpm's default manual catalog mode. Adding a dependency does not automatically create or use a catalog entry.
- Unused entries are not automatically pruned. Remove a catalog entry when no manifest or workspace override references it.

## Catalog refactor workflow

1. Inspect `pnpm-workspace.yaml`, the root manifest, and every `apps/*/package.json` and `libs/*/package.json`.
2. Compare dependencies, dev dependencies, optional dependencies, and peer dependencies. Report or replace only exact matches unless an upgrade or alignment was requested.
3. Add the package and range under the top-level `catalog` key, keeping entries alphabetically ordered.
4. Replace each equivalent manifest range with `"catalog:"`. Do not alter unrelated dependencies or peer ranges.
5. Regenerate lockfile metadata through the repository environment:

   ```sh
   devenv shell -- pnpm install --lockfile-only
   ```

6. Check that `pnpm-lock.yaml` contains the catalog entry and `catalog:` importer specifiers. For a refactor with no version change, confirm resolved versions remain unchanged.
7. Run `git diff --check` and relevant package checks when the change affects installed versions or code paths.

## Upgrades and additions

- To upgrade a catalog-managed dependency, edit its catalog range and regenerate the lockfile. All consumers using that catalog entry receive the new range together.
- Use `devenv shell -- pnpm install` instead of `--lockfile-only` when `node_modules` must also be updated for local verification.
- After an upgrade, run the affected packages' typechecks, tests, and builds. A successful lockfile update does not prove compatibility.
- For a new shared dependency, either edit the catalog and manifests explicitly or use pnpm's `--save-catalog` option. Verify the resulting files rather than assuming the command chose the desired range.
- Keep supply-chain settings such as `minimumReleaseAgeExclude` separate from catalog edits unless the requested version change requires them.

## Audit output

When asked only to find opportunities, do not edit files. Report a table with the package, identical range, and consuming manifests. Separate direct replacements from version-alignment suggestions, and explicitly exclude broad peer ranges, workspace protocols, and single-use dependencies when they do not meet the conventions above.

Official reference: <https://pnpm.io/catalogs>.
