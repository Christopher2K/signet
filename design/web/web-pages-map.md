# Signet — Web Pages Map

> **Design system & principles:** See [DESIGN.md](../../DESIGN.md). This file is web-specific page inventory only — pages, dialogs, sitemap, states, and traceability derived from the spec. Design tokens, components, and motion live in DESIGN.md; do not duplicate them here.

**Source:** `SPECIFICATION.md` v1 draft 2026-11-07 (§3–§10, F01–F10, W-01–W-09)  
**Canonical design doc:** [DESIGN.md](../../DESIGN.md)  
**Status:** Map v1 — for design, not final routes  
**Client:** Website — primary P0 manager (§6.1)

> Website must work responsive (desktop + 390px mobile, folder tree → drawer, W-09). No install required. All shared features work here first. This map includes every page, dialog, and state implied by the spec. Out-of-scope items from §9 are excluded.

---

## 1. Inventory summary

| Cluster | Pages | Dialogs / Overlays | Notes |
|---|---|---|---|
| **A. Auth** (unauthenticated) | 2 | 0 | Server URL first, persisted per client (§3.2) |
| **B. App Library** (authenticated) | 4 core + 2 filtered views | 7 | Browse, search, CRUD, sync, offline |
| **C. Settings & Data** | 3 sections (1 shell) | 2 | Import/Export (F09), Public links mgmt (F10), Session |
| **D. Public / Sharing** | 3 | 0 | Anonymous, read-only, no login prompt (§F10) |
| **E. System** | 2 | 0 | 404, error/offline states |

**Total to design: 9 full pages + 7 dialogs + 10+ states.** Design order in §7.

---

## 2. Sitemap (public + authenticated)

```
PUBLIC (no auth)
├── /login                    → A1 Login
├── /signup                   → A2 Signup
├── /s/:token                 → P1 Public Bookmark (single)
│                               P2 Public Folder (recursive list)
│                               P3 Revoked (410 Gone)
└── /404                      → P4 Not Found

AUTHENTICATED (app shell: topbar + folder tree + main)
├── /                         → L1 Library Home (All / Root)
├── /folders/:id              → L2 Folder View
├── /search?q=                → L3 Search Results
├── /tags/:tag                → L4 Tag Filtered View
├── /unfiled                  → L5 Unfiled View (filter of L1)
│
├── /settings                 → S1 Settings Shell
│   ├── /settings/account     → S1 Account & Session
│   ├── /settings/data        → S2 Data — Import / Export
│   └── /settings/links       → S3 Public Links Management
│
└── Dialogs (no route)
    ├── B1 Create Bookmark
    ├── B2 Edit Bookmark (detail pane / dialog)
    ├── F1 Create / Rename / Move Folder
    ├── D1 Delete Bookmark Confirm
    ├── D2 Delete Folder Cascade Confirm
    ├── D3 Duplicate URL Warning
    ├── D4 Copy Public Link + Folder link options
    └── D5 Import File Picker / Result
```

*Mobile 390px:* Folder tree becomes drawer (W-09). Dialogs become bottom sheets. Library list remains touch-usable. No separate mobile routes.

---

## 3. Page & Dialog inventory — traceable

### A. Auth — unauthenticated

| ID | Name | Route | Spec refs | Purpose | Key zones & actions |
|---|---|---|---|---|---|
| **A1 Login** | Login | `/login` | §3.2, F01, W-01 | Log in to self-hosted server | Server URL first (placeholder `https://`, persisted), email, password, [Log in], link to Signup, inline `Invalid credentials` error (no email leak) |
| **A2 Signup** | Create account | `/signup` | §3.2, F01, W-01 | Create account on same instance | Server URL, email, password, [Create account], link to Login. On success → empty library within 2s. No verification email |

**Shared auth states:** Server URL unreachable / invalid URL, login failure, signup success redirect, session persist across restart (§3.3), logout → back to A1 + cache clear.

*Out of scope for v1 (§9):* No forgot/reset password, no email verification, no OIDC/OAuth, no admin invites.

---

### B. App Library — authenticated (core v1)

App shell (applies to L1–L5 + S1–S3):
- **Topbar:** Signet wordmark, Search input, [New Bookmark], Sync status (connected / offline / syncing), Account menu (server URL display, Settings, Logout)
- **Sidebar:** Folder tree (unlimited nesting, §4.2), counts, [New Folder], collapsible to drawer on mobile (W-09)
- **Main:** List header (view toggle grid/list, sort, filter chips), Content list, Toolbar (Import/Export quick actions optional)

| ID | Name | Route / Type | Spec refs | Purpose | Key zones & actions |
|---|---|---|---|---|---|
| **L1 Library Home** | All Bookmarks | `/` | §6.1 flows 2–4, F02, F05, W-01–W-02, W-04 | Default landing after login. Browse everything | Folder tree, bookmark list (grid/list toggle), search input, tag chips, [New Bookmark], [New Folder], subfolder cards + bookmark cards, pending badges (F07), empty-library onboarding (if 0 items) |
| **L2 Folder View** | Folder detail | `/folders/:id` | §4.2, F03, F05, W-03 | Browse one folder + manage it | Breadcrumb, folder name (rename inline), list of direct bookmarks only (+ [Include subfolders] toggle for website, F05), subfolder list, [New Folder inside], [Move Folder], [Delete Folder], [Copy Public Link] |
| **L3 Search Results** | Search | `/search?q=` | F05, W-04 | As-you-type search | Debounced ≤300ms, matches title/notes/tags/hostname, highlight results, filter chips (folder, tag), empty-state with [Clear search], result count |
| **L4 Tag Filtered View** | Tag browse | `/tags/:tag` (or `/?tag=`) | §4.3, F04, F05 | Filter by one tag | Tag chip header, list of matching bookmarks, [Clear tag], secondary tag filter |
| **L5 Unfiled View** | Unfiled | `/unfiled` (or `/?folder=null`) | §4.1 `folderId=null` | Bookmarks with no folder | Same list component as L1, header “Unfiled”, quick [Move to folder] CTA |
| **B1 Create Bookmark** | New Bookmark | Dialog | F02, F08, W-02 | Create via URL, auto-fetch title/image | URL input, auto-filled title + OG image preview, image override, notes (≤2000 chars), tags input (`work, reading` → chips), folder picker, [Save] → appears <2s, hostname fallback if fetch fails |
| **B2 Edit Bookmark** | Bookmark editor | Dialog / side pane | F02, F04, F08 | Edit one bookmark | Same fields as B1 + created/updated timestamps, image override, [Save], [Delete], [Copy Public Link] |
| **F1 Folder dialog** | Create / Rename / Move Folder | Dialog | F03, W-03 | Top-level + nested CRUD | Name (max 100, empty = error), parent picker, on move: destination picker. Creates 3-level hierarchy persists on reload |
| **D1 Delete Bookmark Confirm** | Confirm delete | Dialog | F02 | Remove bookmark | “Bookmark removed on all clients within 5s, not recoverable” |
| **D2 Delete Folder Confirm** | Cascade delete | Dialog | §4.2, F03 | Confirm destructive cascade | Lists counts: X child folders + Y bookmarks will be deleted. No undo. Requires confirm |
| **D3 Duplicate URL Warning** | Already saved | Inline / Dialog | F02 | Warn on duplicate URL | “Already saved” + [Open existing] / [Save anyway] → creates second entry |
| **D4 Public Link Dialog** | Share | Dialog | F10, W-07 | Create/copy/revoke link for any bookmark/folder | URL `https://<server>/s/<token>` (≥32 chars), [Copy link], revoke action, note: read-only, anonymous |

**Cross-cutting in library:**
- Real-time push: New/edited/deleted items appear without refresh <5s (F06). No polling.
- Offline queue (F07, W-08): Banner “Offline — changes queued”, pending badge on items, queue drains FIFO <10s after reconnect. Survives reload.
- Validation: Empty title / malformed URL → inline errors, no request sent.
- Toasts: Save confirmation, sync errors, offline toast.

---

### C. Settings & Data

| ID | Name | Route | Spec refs | Purpose | Key zones & actions |
|---|---|---|---|---|---|
| **S1 Account & Session** | Account | `/settings` / `/settings/account` | §3.2, F01 | Show session + logout | Server URL (persisted, editable?), signed-in email, [Logout] → token revoked, cache cleared → A1 |
| **S2 Data — Import / Export** | Backup | `/settings/data` | F09, W-06 | Full JSON backup/restore (no HTML in v1) | [Export] → downloads `{ version:1, exportedAt, folders:[], bookmarks:[] }` as `.json`, [Import] file picker → validates atomic, additive merge, dedupe by `id`, error on malformed file with no partial write |
| **S3 Public Links Mgmt** | Links | `/settings/links` | F10, W-07 | Manage all active public links | Table: type (bookmark/folder), title, URL, created, [Copy], [Revoke/Delete] → subsequent visits show P3, [Revoke all] |

*Settings is a shell with left nav. All three use same authenticated app shell.*

---

### D. Public / Sharing — anonymous, read-only

All under `/s/:token`. No signup/login prompt (F10). Internal same-server sharing deferred to v2.

| ID | Name | Route | Spec refs | Purpose | Key zones & actions |
|---|---|---|---|---|---|
| **P1 Public Bookmark** | Shared bookmark | `/s/:token` | F10 | Read-only single bookmark | Title, OG image, notes, tags, [Open link] (outbound), Signet branding, no edit |
| **P2 Public Folder** | Shared folder | `/s/:token` (folder) | F10, W-07 | Recursive folder listing | Folder name, list of all bookmarks in folder + subfolders, each with title/notes/tags/link. Read-only |
| **P3 Revoked** | Link revoked | `/s/:token` revoked | F10 | 410 Gone state | “Link revoked — content no longer accessible”, no data exposed |
| **P4 Not Found** | 404 | `/404` / unknown `/s/*` | F10 private by default | No data leak | Generic 404, no indication whether bookmark exists |

---

### E. System states (design as components, not pages)

| ID | Name | Where | Spec refs | Notes |
|---|---|---|---|---|
| **E1 Empty Library** | First login, 0 bookmarks | L1 | §3.2 Signup, W-01 | Onboarding CTA: [Add your first bookmark by URL], [Import JSON] |
| **E2 Empty Folder** | Folder with 0 bookmarks | L2 | F05 | “No bookmarks here” + [New Bookmark] |
| **E3 No Results** | Search/tag yields 0 | L3/L4 | F05 | Empty-state message + [Clear search/tag] |
| **E4 Loading** | Skeletons | L1–L5, P1/P2 | §3.2 <2s | Skeleton list, spinner on create/edit |
| **E5 Error** | Inline + toast | All authenticated | §3.2, F02–F09 | Inline field errors, toast for server/sync failures, atomic import error |
| **E6 Offline** | Banner + queue | App shell | F07, W-08 | “You’re offline” banner, pending badges, [View queued changes] |
| **E7 Sync Status** | Connected/syncing/disconnected | Topbar | F06, §7.1 | Dot + label, reconnect does delta fetch `?since=…` |
| **E8 Tag Empty** | No tags yet | L4 | F04 | Prompt to add tags in editor |
| **E9 Unsupported URL** (extension only, not web) | — | — | E-08 | Not a web page — listed for completeness, do not design here |

---

## 4. What is *not* a web page (out of scope, §9)

- Password reset / email verification / OIDC — v1.1 / v2
- Admin dashboard — v1.1
- Netscape HTML import/export — v2 (JSON only)
- Internal user→user sharing, public-link passwords, archive/read-later, history sync — out
- Mobile Share Sheet, extension popup/options, native bookmark bar sync — other clients, not web

---

## 5. Responsive & layout notes (from spec)

- **Desktop ≥1024px:** 3-zone app shell (sidebar tree + main). Grid/list toggle in L1/L2.
- **Mobile 390px (W-09):** Sidebar → drawer (hamburger), list stays usable with touch, dialogs → bottom sheets, B1/B2 full-screen sheets.
- **Public pages (P1/P2):** Single column, max-width, OG image hero, tag chips, no app shell.
- **Auth (A1/A2):** Centered card, server URL first field.

---

## 6. Traceability — spec → pages

| Spec ID | Pages |
|---|---|
| F01 Auth | A1, A2, S1 |
| F02 Bookmark CRUD | L1, L2, B1, B2, D1, D3 |
| F03 Folder CRUD | L1, L2, F1, D2 |
| F04 Notes & Tags | L4, B1, B2, P1, P2 |
| F05 Search / Filter | L3, L4, L5, L2 (include-subfolders toggle) |
| F06 Realtime Push | App shell status, L1/L2 live updates, E7 |
| F07 Offline Queue | App shell banner, E6, pending badges, queue indicator |
| F08 OG Fetch | B1, B2 (auto-fill + override), L1 card image |
| F09 Import / Export | S2, D5, E1 (import CTA) |
| F10 Public Links | D4, S3, P1, P2, P3, P4 |
| W-01 First load → library | A1, A2, L1 |
| W-02 Create by URL <2s | B1, L1 |
| W-03 3-level folders persist | L1, L2, F1 |
| W-04 Tag search <1s | L3, L4 |
| W-05 Website edit → mobile <5s | B2 (push indicator) |
| W-06 Export → import round-trip | S2 |
| W-07 Folder public link + revoke | D4, S3, P2, P3 |
| W-08 Offline persist + sync | E6, E7, App shell |
| W-09 Responsive drawer | App shell (mobile) |

---

## 7. Recommended design order

1. **A1 + A2** (auth entry, defines shell + server URL affordance)
2. **L1 Library Home** (app shell, tree, list/grid, search — highest density)
3. **B1 Create Bookmark** + **B2 Edit Bookmark** (core CRUD)
4. **L2 Folder View** + **F1 + D2** (hierarchy)
5. **L3 Search** + **L4 Tag** + empty states E1–E3
6. **S2 Data** + **S3 Links** + **D4 Share dialog**
7. **P1/P2 Public** + P3/P4
8. **E6/E7 Offline/Sync** states + **S1 Account** + 390px responsive pass

---

## 8. Open questions for product/design (from spec §12)

1. Public folder link: default to *Include subfolders* ON? Spec proposes YES. Affects P2 design (toggle visible to owner in D4 vs recipient in P2).
2. JSON import schema versioning display — need schema version badge in S2?
3. Queue center design: full page vs popover? Spec only requires badges + drain. Propose popover from topbar status — confirm.

---

## 9. Naming in the canonical design file

All screens live as vertically stacked top-level sections in `design/client-designs.pen`; do not split pages into separate `.pen` files. Section names carry the stable page/state ID and title (for example `§6 A1 Login`, `§8 L1 All Bookmarks`, `§23 D4 Share`). Shared components and cross-page states live in their own sections. Keep this map as the page inventory and `DESIGN.md` as the token/component specification.
