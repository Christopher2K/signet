# Signet - Product Specification

**Version:** v1 draft - 2026-11-07  
**Status:** Scope locked for first implementation  
**Owner:** Product

---

## 1. What is Signet?

Signet is a self-hostable, multi-user bookmark sync system with three clients that share one server:

- **Website** — the primary, full-featured manager (v1 focus)
- **Browser extensions** — Firefox, Safari, and Chromium-based (Chrome, Edge, Brave) for saving and 2-way sync with native bookmarks
- **Mobile apps** — React Native for iOS and Android, with Share Sheet integration

Every client connects to a self-hosted Signet server via a user-entered server URL. The server is the source of truth and pushes changes in real time to all logged-in clients.

### Goals

- One bookmark collection, synced across website, browsers, and phones
- Self-hostable in one `docker compose` step, usable by many email accounts on the same instance
- Fast capture from browser and mobile share sheet, full management on website
- Search, tags, notes, and offline edits are first-class, not add-ons

### Non-goals for v1

- Email verification, password reset, OIDC/OAuth, or admin invites
- Two-way sync of full native browser history (only bookmark bar mirroring)
- Native browser bookmark file (Netscape HTML) import/export
- See [Out of Scope](#9-out-of-scope-for-v1) for full list

---

## 2. Clients at a Glance

| Client | Platforms | Role in v1 | Priority |
|---|---|---|---|
| **Website** | Any modern browser, responsive | Full bookmark manager, search, import/export, public links management | **P0 — defines v1** |
| **Browser extension** | Firefox, Safari (macOS/iOS), Chromium (MV3) | Save current tab + 2-way sync with native bookmark bar | **P0** |
| **Mobile app** | iOS + Android (React Native) | Manager + Share Sheet save, offline edit queue | **P0** |

All three clients authenticate with the same email/password against the same server URL.

---

## 3. Users, Server, and Auth

### 3.1 Server model

- One server instance serves many users (multi-user).
- Self-hosted via Docker. A single `docker compose up` brings up API + database (+ website static). No additional services required for v1.
- Server is reachable over HTTPS at a user-supplied URL, e.g. `https://bookmarks.example.com`.

> **Assumption:** Users trust their own instance. No central Signet cloud, no telemetry in v1.

### 3.2 Account model

- Accounts have a display name and authenticate with email + password only.
- **Signup:** First-time user creates an account with name + email + password on the configured server → logged in immediately. No verification email.
- **Login:** Enter email + password on the configured server → session token stored securely.
- **Website backend:** The website uses the backend URL configured by its deployment. Signup and login forms do not show a server URL field.
- **Logout:** Clears local token. Does not delete server data.
- **Password reset:** Not in v1. Admin resets by directly updating the database. Must be documented in server README.

| Flow | Acceptance Criteria |
|---|---|
| Signup | **Given** a reachable configured server, **When** a new user submits name + email + password, **Then** account is created, session is issued, and user sees an empty library within 2s. |
| Login | **Given** account exists, **When** correct email + password are submitted, **Then** session is issued and library syncs. **When** password is wrong, **Then** `Invalid credentials` is shown, no info leak about email existence. |
| Server URL | **Given** a fresh non-web client, **When** user opens login, **Then** server URL field is shown first with `https://` placeholder. URL is persisted per client after first login. The website uses its deployment-configured backend instead. |
| Logout | **Given** logged-in user, **When** they log out, **Then** local token is revoked on server and UI returns to login screen. Local cache is cleared. |
| Multi-user isolation | **Given** two users A and B on same server, **When** A creates a bookmark, **Then** B cannot see it unless accessed via a public link. |

### 3.3 Session

- Session token is long-lived until logout or password change (no auto-expiry in v1).
- Clients must survive app restart without re-login.

---

## 4. Data Model

### 4.1 Bookmark

| Field | Required | Description |
|---|---|---|
| `id` | system | UUID |
| `ownerId` | system | User who created it |
| `title` | yes | Page title or user-entered title |
| `url` | yes | Canonical URL. Must be valid absolute URL. |
| `image` | no | OG image URL. If missing, client shows favicon placeholder. Server fetches OG image from URL on create. |
| `notes` | no | Free-text description. Plain text, max 2000 chars in v1. |
| `tags` | no | List of strings. Free-form, case-insensitive, trimmed. |
| `folderId` | no | Parent folder. `null` = unfiled / root. |
| `createdAt` / `updatedAt` | system | Timestamps |

**Rules:**

- Title defaults to page `<title>` when available, else to hostname.
- Image defaults to OG `image` meta. User can override with custom URL in edit UI.
- Notes and tags are editable on all clients.

### 4.2 Folder

| Field | Required | Description |
|---|---|---|
| `id` | system | UUID |
| `ownerId` | system | User who created it |
| `name` | yes | Folder name, max 100 chars |
| `parentId` | no | Parent folder id. `null` = top-level. Unlimited depth. |
| `createdAt` / `updatedAt` | system | Timestamps |

**Rules:**

- Unlimited nesting depth.
- Deleting a folder **cascades**: all child folders and all bookmarks inside them are deleted. No undo in v1, but UI must confirm.
- Moving a folder moves its entire subtree.

### 4.3 Tag (implicit)

Tags are strings on bookmarks, not a separate table. Search and filter match tags exactly (case-insensitive).

---

## 5. Feature Set — v1

### F01 — Account & Session
Covered in §3.2.

### F02 — Bookmark CRUD

**Description:** Create, view, edit, delete bookmarks. Create from URL with automatic metadata fetch.

| Scenario | Acceptance Criteria |
|---|---|
| Create via URL | **Given** logged-in user, **When** they submit a valid URL, **Then** bookmark appears in library within 2s with title + OG image fetched server-side. If fetch fails, bookmark is still created with hostname as title and no image. |
| Edit | **Given** existing bookmark, **When** user edits title/notes/tags/folder/image, **Then** changes persist server-side and reflect on other clients via push within 5s. |
| Delete | **Given** existing bookmark, **When** user confirms delete, **Then** bookmark is removed from all clients within 5s and is not recoverable via API. |
| Duplicate URL | **Given** user tries to add a URL already saved by them, **When** they save, **Then** UI warns "Already saved" and offers "Open existing" or "Save anyway". Save anyway creates a second entry. |
| Validation | **Given** empty title or malformed URL, **When** submitting, **Then** inline error is shown and no request is sent. |

### F03 — Folder CRUD (nested)

**Description:** Create top-level and nested folders, rename, move, delete.

| Scenario | Acceptance Criteria |
|---|---|
| Create nested | **Given** logged-in user, **When** they create a folder inside another, **Then** hierarchy displays correctly on website and mobile within 5s. |
| Move | **Given** folder A contains B, **When** user moves B under C, **Then** B and its subtree appear under C on all clients. |
| Delete cascade | **Given** folder with child folders/bookmarks, **When** user confirms delete, **Then** folder, all children, and all contained bookmarks are deleted on all clients within 5s. |
| Rename | **Given** existing folder, **When** user renames to empty string, **Then** validation error is shown. |

### F04 — Notes & Tags

**Description:** Notes field and free-form tags on each bookmark.

| Scenario | Acceptance Criteria |
|---|---|
| Add tags | **Given** bookmark editor, **When** user enters `work, reading`, **Then** tags `["work","reading"]` persist, trimmed and lower-cased for filter. |
| Filter by tag | **Given** bookmark with tags, **When** user filters by one tag, **Then** only matching bookmarks are shown on website and mobile. |
| Notes | **Given** bookmark, **When** user saves notes, **Then** notes are visible in list detail on all clients and searchable. |

### F05 — Search & Filter

**Description:** Full-text search across title, notes, tags, and URL hostname. Filter by folder and tag.

| Scenario | Acceptance Criteria |
|---|---|
| Search | **Given** ≥10 bookmarks, **When** user types query into search, **Then** results update as-you-type (debounced ≤300ms) and match title/notes/tags. |
| Filter | **Given** folders and tags, **When** user selects a folder, **Then** list shows only that folder’s direct bookmarks (and option to include subfolders on website). |
| Empty state | **Given** no matches, **When** search yields zero, **Then** empty-state message with clear-search action is shown. |

### F06 — Real-time Push Sync

**Description:** Server pushes changes to all connected clients. No manual refresh required.

| Scenario | Acceptance Criteria |
|---|---|
| Cross-device visibility | **Given** two devices A (website) and B (mobile) logged into same account and connected, **When** A creates a bookmark, **Then** B sees it without manual refresh within 5 seconds. |
| Edit/delete propagation | **Given** synced clients, **When** A deletes a folder, **Then** B removes it from UI within 5s. |
| Connection drop | **Given** client disconnects, **When** it reconnects, **Then** it fetches delta since last sync and converges to server state without duplicate entries. |
| Conflict | If two clients edit same bookmark offline, last-write-wins applies (no conflict UI in v1). Timestamp of `updatedAt` decides. |

### F07 — Offline Edit Queue (Website + Mobile)

**Description:** Clients work offline. Edits made offline are queued locally and synced when connectivity returns.

| Scenario | Acceptance Criteria |
|---|---|
| Offline create | **Given** offline, **When** user creates a bookmark, **Then** it appears locally with “pending sync” badge and is stored in local DB. |
| Reconnect sync | **Given** pending items, **When** connectivity returns, **Then** queue drains in FIFO order within 10s and badges clear. |
| Offline delete | **Given** offline, **When** user deletes, **Then** item disappears locally and delete is queued. Server deletion confirmed on reconnect. |
| Data safety | **Given** app closed while offline, **When** reopened, **Then** queued items are still present. |

*Browser extension does not require offline queue in v1; it reports a clear error when offline.*

### F08 — OG Metadata Fetch

**Description:** Server fetches Open Graph title/image when a bookmark is created. Used to enrich list views.

| Scenario | Acceptance Criteria |
|---|---|
| Happy path | **Given** URL with `og:title` and `og:image`, **When** bookmark is created, **Then** stored title/image match OG (title fallback to `<title>`). |
| Failure | **Given** URL unreachable or no OG, **When** created, **Then** bookmark still created; title falls back to hostname, image is null. No error shown to user. |
| Override | **Given** bookmark, **When** user manually edits title/image, **Then** manual values persist and are not overwritten by re-fetch. |

### F09 — Import / Export (JSON only)

**Description:** Full backup and restore via Signet JSON. No Netscape HTML in v1.

**Export:**
- Export current user’s data (bookmarks, folders, tags, notes) as a single JSON file.
- Structure: `{ version: 1, exportedAt, folders: [], bookmarks: [] }`.
- Download triggered from website.

**Import:**
- Upload a previously exported JSON file → creates folders/bookmarks under current user.
- Import is additive by default; existing data is not deleted.
- Imported items are de-duplicated by `id` if present, else new ids are assigned.

| Scenario | Acceptance Criteria |
|---|---|
| Export | **Given** user with ≥1 folder/bookmark, **When** they click Export, **Then** a `.json` file downloads containing all their folders/bookmarks with correct parent refs. |
| Import round-trip | **Given** export file, **When** imported into a clean account, **Then** folder hierarchy and bookmarks (title/url/notes/tags) are restored identically. |
| Invalid file | **Given** non-Signet JSON or malformed file, **When** imported, **Then** error is shown and no partial data is written (atomic). |
| Import into non-empty | **Given** account with data, **When** importing, **Then** existing data remains and imported data is merged. No overwrite. |

### F10 — Public Links (Sharing v1)

**Description:** Any bookmark or folder can be shared as a read-only public URL. No account required for recipients. Internal same-server sharing is deferred to v2.

- Link format: `https://<server>/s/<token>` where token is random ≥32 chars.
- Supports both single bookmark and folder (recursive).
- Owner can revoke/delete link at any time. Revoked links return 410 Gone.
- Public page shows title, notes, tags, and linked items. Read-only, no edit.

| Scenario | Acceptance Criteria |
|---|---|
| Create link | **Given** owner of bookmark, **When** they generate a public link, **Then** URL is copyable and renders that bookmark without login. |
| Folder link | **Given** folder, **When** link is opened, **Then** all bookmarks in folder + subfolders are listed. |
| Unauthenticated | **Given** anonymous visitor, **When** they open link, **Then** they see read-only content and no signup/login prompt. |
| Revoke | **Given** active link, **When** owner deletes it, **Then** subsequent visits return “Link revoked” page. Content no longer accessible. |
| Private by default | **Given** bookmark without link, **When** anonymous user guesses URL, **Then** no data is exposed (404). |

---

## 6. Client Descriptions

### 6.1 Website (Primary — v1)

**Purpose:** The full manager. If a feature works anywhere, it works here first. Website is P0 and defines acceptance for all shared features.

**Platform:** Responsive web app. Must work on desktop and mobile browsers. No install required.

**Key flows:**
1. Signup/login on the deployment-configured backend → empty library or synced library
2. Browse folders (tree) + bookmark list (grid/list toggle)
3. Create/edit bookmark (title, URL, image, notes, tags, folder)
4. Search/filter by text, folder, tag
5. Manage folders (create nested, rename, move, cascade delete)
6. Copy public link for any bookmark/folder, revoke
7. Import/Export JSON
8. Logout

**Features in scope (all F01–F10):**
- Full CRUD for bookmarks/folders
- Search + tag/folder filters
- Realtime updates (WebSocket or SSE)
- Offline edit queue with pending badges (see F07)
- Public link creation/management + public landing pages
- Import/Export UI

**Out of native bookmarks sync:** Website does not read/write native browser bookmarks; that is extension-only.

**Acceptance Criteria — Website:**

| ID | Criterion |
|---|---|
| W-01 | First load shows email/password login with a signup CTA. After login, library renders without manual refresh. |
| W-02 | User can create a bookmark via URL only (title/image auto-filled) and see it in list within 2s. |
| W-03 | User can create a 3-level deep folder hierarchy and see it in tree on reload. |
| W-04 | Search for a tag returns the correct bookmark in <1s for <5k items. |
| W-05 | Editing a bookmark on website is visible on mobile within 5s (push). |
| W-06 | Export downloads valid JSON that can be imported into a fresh account to restore data 1:1. |
| W-07 | Public link for a folder shows nested bookmarks anonymously and can be revoked from website. |
| W-08 | Offline: create bookmark while offline, reload page, item persists with “pending” badge, syncs after reconnect. |
| W-09 | Responsive: on 390px width, folder tree collapses to drawer and list remains usable with touch. |

### 6.2 Browser Extension

**Purpose:** Capture from the browser and keep Signet in sync with the native bookmark bar. It is a power-user companion, not a full manager replacement.

**Platforms:**
- **Firefox** — WebExtensions (Manifest V2/V3 compatible)
- **Chromium** (Chrome/Edge/Brave) — Manifest V3 WebExtensions
- **Safari** — WebExtensions + Xcode native wrapper for macOS and iOS (same web codebase as Chromium where possible)

**Key flows:**
1. Install → enter server URL → login
2. Click toolbar button → popup shows current tab (title, URL, OG image preview) → edit tags/notes/folder → Save
3. Right-click page → “Save to Signet” context menu → saves with defaults
4. Bookmark bar mirroring: on first login, user selects a Signet folder to mirror to native bookmark bar. From then on, changes sync both ways.

**Features in scope:**

- Toolbar popup with current-tab detection (F02, F08)
- Context menu save (F02)
- Options page: server URL, login/logout, choose mirrored folder, toggle “use Signet bookmark bar” (F01, F03)
- 2-way native bookmark bar sync:
  - Signet → Native: bookmarks created in mirrored folder appear in native bookmark bar.
  - Native → Signet: bookmarks added/moved/deleted in native bookmark bar appear in mirrored Signet folder.
  - Sync loop prevention via origin tracking (e.g., ignore echo within 1s).
- Saves respect Notes/Tags/Folder choice in popup (F04)
- Offline: show error toast; no queue in v1.

**Out of scope for extension v1:**
- Full folder tree management (create nested folders — can select existing only; new folders created on website/mobile; extension can create top-level only)
- Search UI (search is website/mobile only)
- Import/Export (website only)
- Public link creation (website only)

**Acceptance Criteria — Extension:**

| ID | Criterion |
|---|---|
| E-01 | On Chromium, Firefox, and Safari: toolbar button on any http(s) page shows title + URL + favicon/OG preview within 1s. Save completes and bookmark appears on website within 5s. |
| E-02 | Right-click “Save to Signet” saves page to default folder with auto title/image; toast confirms. |
| E-03 | User can set `notes`, `tags`, and `folder` in popup before saving; saved values match selection. |
| E-04 | **Native → Signet:** Add a bookmark to native bookmark bar → it appears in the chosen Signet folder on website within 10s. |
| E-05 | **Signet → Native:** Create bookmark in mirrored folder on website → it appears in native bookmark bar within 10s. |
| E-06 | Delete in native bar removes from Signet mirrored folder; delete in Signet mirrored folder removes from native bar. No resurrection after sync. |
| E-07 | Logout clears token and stops native sync. Native bookmarks remain untouched. |
| E-08 | On unsupported pages (`about:`, `chrome://`, PDF viewer), popup shows “Cannot save this page” instead of blank. |

**Risks / Notes:**
- Safari iOS extension has stricter review; test TestFlight early.
- Chromium MV3 service worker must survive popup close for sync; use `alarms` heartbeat if needed.
- Native→Signet sync must debounce native `onChanged` events to avoid loops.

### 6.3 Mobile Apps (React Native — iOS + Android)

**Purpose:** Everyday manager + share-sheet saver. Same library as website, optimized for quick save and on-the-go organization.

**Platform:** React Native shared codebase, iOS and Android. One build pipeline, platform-specific Share Sheet / Share Intent.

**Key flows:**
1. Enter server URL → login
2. Browse folders → bookmark list → detail edit (title, notes, tags, folder)
3. Search by text/tag
4. Share Sheet: in any app (browser, Slack, etc.) → Share → “Save to Signet” → prefilled URL + title → add notes/tags/folder → Save
5. Work offline → queue → sync on reconnect

**Features in scope (all F01–F08, F10 view):**
- Full Bookmark/Folder CRUD (F02, F03)
- Notes/Tags (F04)
- Search/Filter (F05)
- Realtime push (F06) via WebSocket/Expo push when backgrounded
- Offline edit queue + local SQLite/AsyncStorage (F07)
- Share Sheet save with metadata prefill via server OG fetch (F08)
- View public links (read-only)

**Out of scope for mobile v1:**
- Import/Export (website only — JSON file picker is fiddly on mobile)
- Public link creation (view yes, create on website)
- Native bookmark bar sync (extension only)

**Acceptance Criteria — Mobile:**

| ID | Criterion |
|---|---|
| M-01 | iOS and Android builds from same React Native repo; both can login with same server URL and see same library. |
| M-02 | Share from Safari/Chrome on both OSes: prefilled title/URL appears in Signet share sheet within 1s; save creates bookmark on website within 5s. |
| M-03 | User can create nested folder, move bookmark into it, and see change on website within 5s. |
| M-04 | **Offline:** Go offline, create/edit/delete 3 items, close app, reopen — items persist with pending badge. Reconnect → all sync within 10s, no duplicates. |
| M-05 | Search for a tag returns results; filter by folder works. |
| M-06 | App survives background/kill without re-login. Token persists in secure storage. |
| M-07 | Push: with app backgrounded, receive change on another device and see badge/update on foreground within 10s. |
| M-08 | Edit bookmark notes/tags on mobile; open on website — values match. |

---

## 7. Cross-Cutting Behavior

### 7.1 Realtime sync

- Transport: WebSocket (preferred) or SSE. Channel is per-user: `user:<id>`.
- Events: `bookmark.created/updated/deleted`, `folder.created/updated/deleted`.
- Client reconnect resumes with `?since=<lastEventTs>` delta fetch.
- No event = no refresh needed; client must not poll in tight loop.

### 7.2 Offline

- Website + Mobile support offline create/edit/delete via local DB.
- Queue order is FIFO. On reconnect, ops are replayed. Server is authoritative.
- Delete-wins vs edit on same item: last-write-wins by `updatedAt`.

### 7.3 Search performance

- Server-side search for website; indexed `title`, `notes`, `tags`, `hostname`.
- Target: <500ms for 10k bookmarks on single Docker instance.

### 7.4 Metadata fetch

- Server fetches OG on create only (not on edit unless URL changes).
- Timeout 5s, follow redirects, strip query for image? No — use OG image as-is.
- Store image URL, not binary. Clients fetch lazily with `loading=lazy`.

---

## 8. Security & Privacy

- Passwords are hashed with bcrypt/argon2 server-side. Never logged.
- Session token is opaque random, stored hashed server-side, rotatable on logout.
- Public links use 32+ char random tokens. No tokens in analytics.
- All traffic over HTTPS (user’s reverse proxy — Caddy/Traefik — required in Docker docs).
- CORS restricted to client origins configured via env.

---

## 9. Out of Scope for v1

| Feature | Deferred to | Reason |
|---|---|---|
| Email verification | v1.1 | Email+password only simplifies self-hosting |
| Password reset | v1.1 | Admin DB reset documented |
| OIDC/OAuth, MFA | v2 | Need provider config UX |
| Internal same-server sharing (user→user) | v2 | Public links cover share need for v1 |
| Netscape HTML import/export | v2 | JSON only keeps round-trip perfect |
| Browser history sync | — | Only bookmark bar mirrors |
| Duplicate detection beyond warning | v2 | Warn only in v1 |
| Archive / Read-later | v2 | No extra flag in v1 |
| Public link edit / password protection | v2 | Read-only v1 |
| Admin dashboard | v1.1 | Server README + env only |

---

## 10. Success Metrics for v1

- P95 bookmark create from website <2s (incl. OG fetch)
- P95 cross-device sync <5s
- Fresh Docker install to first bookmark <10 min (documented steps)
- Extension save from toolbar in ≤2 clicks

---

## 11. Monorepo Layout (suggested)

```
signet/
 ├─ server/          # API, Docker, DB migrations
 ├─ web/             # Website (P0)
 ├─ extension/       # Browser extension (Firefox, Chromium, Safari wrapper)
 └─ mobile/          # React Native (iOS/Android)
```

Shared types/schemas should live in `packages/types` to keep clients aligned.

---

## 12. Open Questions

1. Should public links support folder-level “include subfolders” toggle? (Website UI only — proposed default: include)
2. What is the exact JSON export schema versioning strategy? (`version: 1` and server validates on import)
3. Mobile push: Expo Push vs FCM/APNs directly? (Pick Expo for React Native speed)

---

## 13. Glossary

- **Server URL** — base URL of the self-hosted instance, entered per client
- **Mirrored folder** — Signet folder 2-way synced to native bookmark bar by extension
- **Pending** — local change queued for sync, not yet acknowledged by server
