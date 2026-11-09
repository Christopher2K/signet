---
name: phoenix-contexts
description: Organize Signet Phoenix contexts, Ecto schemas, and per-entity repositories. Use when creating or refactoring domain entities, contexts, CRUD/query modules, or deciding where business logic belongs in apps/api.
---

# Phoenix Contexts and Repositories

Use function-oriented Phoenix contexts with per-entity repositories. Load and follow the `phoenix-api` and `elixir-style` skills for general API and Elixir rules.

## Structure

Name contexts after their domain, schemas after their singular entity, and repositories after the entity:

```text
lib/signet/
├── bookmarks.ex
└── bookmarks/
    ├── bookmark.ex
    └── bookmark_repo.ex
```

This produces `Signet.Bookmarks`, `Signet.Bookmarks.Bookmark`, and `Signet.Bookmarks.BookmarkRepo`. Apply the same convention to every entity.

## Responsibilities

### Context

- Provide the public boundary for business operations.
- Own domain rules, error semantics, and orchestration involving multiple repositories.
- Wrap multi-step operations that must be atomic in a transaction.
- Translate persistence results into meaningful domain results.

### Schema

- Define the Ecto schema, associations, changesets, and validations.
- Use UUIDv7 primary keys and matching UUID foreign keys.
- Keep password hashes, token hashes, and other secrets redacted and out of API serialization.
- Never cast fields that must be set programmatically, such as `user_id` or token hashes.

### Repository

- Own CRUD operations and Ecto queries for one entity.
- Return `{:ok, data}` or `{:error, reason}` from fallible functions and side effects.
- Preload associations that callers are expected to access.
- Do not implement authentication, authorization, or other business rules.

## Web boundary

Controllers and LiveViews must call the context for business operations. They may call a repository directly only for simple CRUD or query operations with no domain invariants.

Authentication and account operations must always go through `Signet.Accounts`; web code must never call `UserRepo` or `SessionRepo` directly.

## Avoid unnecessary abstractions

- Do not create a generic `BaseRepo`, generic CRUD behaviour, or an abstraction over Ecto.
- Do not create one service module per action, such as `CreateBookmarkService`.
- Keep ordinary queries in the entity repository. Introduce a finder only when complex queries justify a separate module.
- Prefer a few clear functions over designing around module or class-like boundaries.

## Testing

Mirror the responsibility boundaries:

- Repository tests cover persistence, constraints, preloads, and query behavior.
- Context tests cover business rules, errors, and cross-repository operations.
- Controller and LiveView tests cover HTTP or UI behavior without duplicating domain tests.

## Reference

This convention follows the repository guidance in [Resurrect your Phoenix Context](https://peterullrich.com/resurrect-your-phoenix-context), while keeping security-sensitive operations behind their contexts.
