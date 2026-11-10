# Signet Design System

> **Source of truth for design direction.** Product scope is defined in `SPECIFICATION.md`. This file defines the design language; per-client page inventory lives in `design/web/web-pages-map.md` and is not duplicated here.

**Status:** v1 draft — Web system + native core screens
**Source:** `SPECIFICATION.md` v1 draft 2026-11-07

---

## 1. Scope

| Client | Priority | Design doc |
|---|---|---|
| **Website** | P0 — defines v1 | This file for system + [design/web/web-pages-map.md](design/web/web-pages-map.md) for pages |
| Browser extension | P0 | TBD |
| Mobile (iOS/Android) | P0 | `design/client-designs.pen` §37–§40 (auth, library, session feedback) |

Website is the primary manager: responsive (desktop + 390px), no install, email/password against a self-hosted server URL. If a feature works anywhere, it works on web first.

---

## 2. Web — what to design

**See [design/web/web-pages-map.md](design/web/web-pages-map.md) for the full inventory:** sitemap, page dialogs (A1/A2, L1–L5, B1/B2, F1, D1–D4, S1–S3, P1–P4), system states (E1–E8), responsive rules, spec traceability (F01–F10, W-01–W-09), design order, and file naming.

Summary only:

- **9 full pages + 7 dialogs + 10+ states** — do not duplicate the table here.
- **App shell:** topbar (search, New Bookmark, sync status) + folder tree → drawer on mobile (W-09) + main list.
- **Cross-cutting to visualise:** real-time push <5s (F06), offline queue + pending badges (F07), OG auto-fill (F08).

Out of scope for web v1 (§9 of SPEC): password reset, email verification, OIDC, admin dashboard, Netscape HTML, user→user sharing, link passwords, archive, history sync.

---

## 3. Design language

_Web-first tokens and components are maintained in `design/client-designs.pen`; this document defines their semantic roles and production rules._

### 3.1 Color — Signet Paper & Cobalt

Source palette (Coolors, [`design/assets/palette.png`](design/assets/palette.png), sampled — do not alter):

| Token | Hex | RGB | Role in palette |
|---|---|---|---|
| `ink` | `#3C3744` | 60, 55, 68 | Dark plum-slate — ink, text, dark surfaces |
| `cobalt` | `#090C9B` | 9, 12, 155 | Deep cobalt-indigo — emphasis, focused/selected |
| `azure` | `#3066BE` | 48, 102, 190 | Mid blue — primary interactive (buttons, links) |
| `mist` | `#B4C5E4` | 180, 197, 228 | Pale periwinkle — tints, selection, soft surfaces |
| `paper` | `#FBFFF1` | 251, 255, 241 | Warm off-white — app canvas |

**Palette character:** warm paper + cool blue gradient from deep cobalt to mist, anchored by plum-slate ink. Use `paper` as the default canvas (not pure white) for the bookmark-list warmth; use blues for action and wayfinding, never for body text except `cobalt` on `paper` (13.45:1) and `ink` on `paper` (11.35:1).

#### Derived scales

For tints/shades between source tones (interpolated, keep hue):

| Step | Azure scale | Cobalt scale | Ink scale |
|---|---|---|---|
| 50 | `#EEF3FB` | `#ECECF6` | `#F5F4F7` |
| 100 | `#DBE6F7` | `#C9C9E9` | `#E9E7EC` |
| 200 / Mist | `#B4C5E4` | `#9A9DDD` | `#CFCBD6` |
| 300 | `#8CA7D8` | `#6B6FD0` | `#ABA3B8` |
| 400 | `#5C84C6` | `#2F34B8` | `#6B6578` |
| 500 / Source | `#3066BE` | `#090C9B` | `#3C3744` |
| 600 | `#2752A6` | `#070A80` | `#2F2B3A` |
| 700 | `#1E428A` | `#06086A` | `#211E2B` |
| 900 | `#142A5C` | `#030426` | `#131220` |

#### Semantic tokens

**Light (default):**

| Token | Value | Usage | Contrast note |
|---|---|---|---|
| `--bg` | `paper` `#FBFFF1` | App canvas, auth, public pages | — |
| `--surface` | `#FFFFFF` | Cards, dialogs, list rows | 1.02 vs paper — use border to separate |
| `--surface-alt` | `azure-50` `#EEF3FB` | Sidebar, selected filter area | Decorative only |
| `--text` | `ink` `#3C3744` | Primary text | 11.35:1 on paper (AAA) |
| `--text-secondary` | `ink-400` `#6B6578` | Secondary text, metadata | ~5.9:1 on paper (AA) |
| `--text-muted` | `#8A8499` | Placeholders, pending hints | Do not use for essential text |
| `--border` | `#8FA3C6` (mist darkened) | Inputs, dividers | Use mist `#B4C5E4` alone fails 3:1 (1.72 on paper) — darken for borders |
| `--border-soft` | `mist` `#B4C5E4` | Subtle separators on dark-blue fills | Fails on paper — only on ink/cobalt fills |
| `--primary` | `azure` `#3066BE` | Default buttons, links | 5.48:1 on paper (AA) |
| `--primary-hover` | `azure-600` `#2752A6` | Hover | — |
| `--primary-active` | `cobalt` `#090C9B` | Pressed / emphasized | 13.45:1 on paper |
| `--accent` | `cobalt` `#090C9B` | Selected nav, focus ring, public header | Use `mist` text on cobalt (7.84:1) |
| `--selection` | `mist` `#B4C5E4` + `ink` text | Selected rows and navigation | 6.61:1 (AA) |
| `--focus-ring` | `cobalt` `#090C9B` + 2px `azure-200` outer | Keyboard focus | Must be visible on paper and mist |

**Dark (derived from ink + paper):**

| Token | Value | Usage |
|---|---|---|
| `--bg` | `ink` `#3C3744` | Canvas |
| `--surface` | `#2F2B3A` (ink-600) | Cards, dialogs |
| `--text` | `paper` `#FBFFF1` | Primary text (11.35:1 on ink) |
| `--text-secondary` | `mist` `#B4C5E4` | Secondary (6.61:1 on ink) |
| `--border` | `#4F4A62` (ink lightened) | Borders |
| `--primary` | `azure-400` `#5C84C6` | Buttons/links on dark (`azure` `#3066BE` is only 2.07:1 on ink — never use it on dark) |
| `--on-primary` | `ink-900` `#131220` | Text on dark primary buttons (4.91:1; ink-500 and paper both fail) |
| `--text-muted` | `ink-300` `#ABA3B8` | Placeholders only (5.67:1 on ink-600) |
| `--selection` | `cobalt` `#090C9B` + `paper` text | Selected nav and rows (13.45:1) |
| `--tag` | `mist` `#B4C5E4` + `ink` text | Tag chips and filter chips in both themes |
| `--accent` | `azure-200` `#B4C5E4` | Links, ghost-button text/strokes, highlights on dark |

#### Color rules

- **Text:** Core body combinations are `ink` on `paper`, `paper`/`mist` on `ink`, and `cobalt` on `paper`/`mist`. Dark primary buttons additionally use `ink-900` on `azure-400` (4.91:1); status combinations are listed below. `mist` is never text on light (1.72:1). `azure` is text/link only on `paper`/`white`, never body copy.
- **Primary action:** Light = `azure` fill with `paper`/`white` text. Emphasized/hero and selected states = `cobalt` fill with `paper`/`mist` text. Do not use `cobalt` for body backgrounds on light.
- **Surfaces:** `paper` canvas vs `white` cards distinguished by `border` `#8FA3C6`, not by paper/white contrast (1.02). Sidebar = `azure-50` tint.
- **Selection:** light = `mist` fill + `ink` text; dark = `cobalt` fill + `paper` text. Use for selected nav and rows, not tags.
- **Tags/filter chips:** `mist` fill + `ink` text in both themes (`--tag`). Cobalt is reserved for selection and emphasis.
- **Dark secondary actions:** `mist` fill + `ink` text. Do not use cobalt for Cancel next to an azure-400 primary; the primary action must remain the strongest action.
- **Status (not in source palette — extend minimally):** Light: Success `#2E7D52`, Warning `#9A6A00`, Error `#B42318`. Dark text/icons: Success `#75D6A0`, Warning `#F2C14E`, Error `#F97066` (4.93:1 or better on ink-600). Filled badges/toasts may keep the light status fills with `paper` text in both themes. Always pair with icon/text, never color alone.
- **CSS starter:**
  ```css
  :root {
    --signet-ink:#3C3744; --signet-cobalt:#090C9B; --signet-azure:#3066BE;
    --signet-mist:#B4C5E4; --signet-paper:#FBFFF1;
    --bg:var(--signet-paper); --surface:#FFFFFF; --text:var(--signet-ink);
    --primary:var(--signet-azure); --accent:var(--signet-cobalt);
  }
  [data-theme="dark"] {
    --bg:var(--signet-ink); --surface:#2F2B3A; --text:var(--signet-paper);
    --primary:#5C84C6; --on-primary:#131220; --accent:var(--signet-mist);
    --tag:var(--signet-mist); --on-tag:var(--signet-ink);
    --text-muted:#ABA3B8; --success:#75D6A0; --warning:#F2C14E; --error:#F97066;
  }
  ```

### 3.2 Type — Necto Mono

**Primary typeface (all text): Necto Mono** — Collettivo, [collletttivo.it/typefaces/necto-mono](https://www.collletttivo.it/typefaces/necto-mono). Designed by Marco Condello (2019), 1 family / 1 style, SIL OFL. Low contrast, medium apertures, slanted terminals — "aseptic" monospace. Chosen as the sole monospace in the Collettivo catalogue; fits bookmark UX where URLs, tags, and tables must scan at 12–15px.

> Canvas trade-off: pen.dev does not ship Necto Mono, so `design/client-designs.pen` renders samples in IBM Plex Mono as a stand-in. Production token remains `font-primary: "Necto Mono"`.

| Style | Token | Size / Weight | Usage |
|---|---|---|---|
| Display | `type-display` | 48 / 700 | Public pages (P1/P2), empty states |
| Headline | `type-h1` | 32 / 700 | Auth (A1/A2), Settings headers |
| Title | `type-h2` | 20 / 600 | Folder (L2), bookmark cards |
| Body | `type-body` | 15 / 400 | Notes, titles, folder names |
| Caption | `type-caption` | 12 / 400 | URLs, metadata, timestamps, tags |
| Code | `type-mono` | 13 / 400 | JSON export, tokens, sync state |

Full specimen in `design/client-designs.pen` §3. Display is 48px on desktop/tablet and may step down to Headline 32px at 390px to avoid excessive wrapping. Code 13px is used for sync timestamps, share URLs, and machine-oriented values; it is the same Necto Mono family, not a second font.

### 3.3 Spacing & radii — 4pt grid

| Token | Value |
|---|---|
| `sp-1 … sp-12` | 4, 8, 12, 16, 24, 32, 48 |
| `radius-sm / md / lg` | 4 / 8 / 12 |
| `radius-card / pill` | 16 / 999 |

Base unit 4px in `design/client-designs.pen` §4. The canvas uses literal 4pt values with adjacent token captions until a whole-file variable migration; production code must use `--sp-*` and `--radius-*` variables rather than hard-coded values. Do not mix variable-bound and literal sections in the canvas.

### 3.4 Logo — The Stack

**Source of truth:** [`design/logo.pen`](design/logo.pen) — full guidelines (construction, colour, scaling, lockups, clear space, app icons, misuse, in-use references). This section is the summary; the `.pen` file decides details.

- **Mark:** three bookmark tabs stepped down and across, `mist #B4C5E4 → azure #3066BE → cobalt #090C9B` back to front (one collection, every client; the deepest blue is the one you touch). Front tab is always the deepest colour at every size.
- **Optical masters — pick by rendered size (CSS px), never scale across ranges:**

| Rendered size | Master | Tabs | Gap |
|---|---|---|---|
| ≤ 16px | 16 | 1 (front only) | none |
| 17–24px | 24 | 2 (azure, cobalt) | 2px |
| 25–40px | 32 | 3 | 2px |
| > 40px | 48 | 3 | 1/24 of size |

- **Dark colourway:** `#4F4A62 → azure-400 #5C84C6 → mist #B4C5E4` (azure #3066BE fails on ink; cobalt never on dark). Mono variants: ink on light surfaces, paper on cobalt/azure/photo.
- **Lockups:** horizontal default (wordmark 0.625M, gap M/3, min mark 24px); stacked (0.5M, gap M/5, min 32px). Wordmark = Necto Mono 700, "Signet". Clear space M/4; minimum mark 16px (favicon only).
- **Assets:** ship `logo-16/24/32/48.svg`; a `<Logo size>` component selects by the same thresholds. Export the gap as a cut-out, not an outline, so the mark works on any surface.

- **Type / Spacing / Radii / Elevation:** See 3.2–3.3 above; Elevation TBD
- **Components (Web):** App shell, Topbar, Account menu, Folder tree, Bookmark card (grid/list), Tag chip, Search input, Text field, Folder picker, View toggle, Sort control, Dialog / Bottom sheet, Toast, Empty state, Skeleton, Sync status dot, Public header, Settings nav. Repeated canvas UI uses Pen components and `ref` instances rather than detached copies; page-specific compositions stay ordinary frames. **Icons:** [Phosphor Icons](https://phosphoricons.com) (`regular 20–24`, `bold` emphasis, `fill` active) — production SVGs; the canvas embeds official Phosphor SVG path geometry inside targets named by the exact Phosphor name (e.g. `Icon-List`). Import uses `DownloadSimple` because Phosphor has no `Import` glyph. The component and icon inventory lives in `design/client-designs.pen` §36.
- **Motion:** Reflect sync state, not decoration. Create feedback <2s, remote updates <5s, queue drain <10s must be visible, not silent.
- **Responsive:** Desktop ≥1024px (3-zone shell), mobile 390px (drawer, bottom sheets). Public pages single-column, auth centered card.

### 3.5 Native auth

Native A1/A2 live in `design/client-designs.pen` §37–§38, with light and dark 390 × 844 screens for iOS/Android. They use the existing color, type, spacing, and radii tokens: a full-bleed `paper`/`ink` canvas, safe-area-aware cardless layout, 48px full-width inputs and primary action, and `radius-lg` controls. Forms must remain keyboard-avoiding and scrollable so the action stays reachable. Both forms place an editable **Server URL** field before the account fields. Native authentication uses the selected absolute HTTP/HTTPS origin, normalizes trailing slashes, and persists the normalized URL with the session; the last selected server remains after logout and is used for restoration and retry. Other fields, cross-links, backend behavior, and inline errors match web A1/A2; do not duplicate the existing splash screen.

### 3.6 Native library and session feedback

Native L1 and the server-unavailable state live in `design/client-designs.pen` §39–§40. They mirror only the currently implemented `apps/web-client` `/` route and route guards. L1 uses a native navigation title and a bottom tab bar with **Library** (selected) and **Account**. Library contains only the empty-library message; Account owns the signed-in email and logout. §40 provides the saved-session retry. Do not add search, folders, bookmark creation, or other future web-map controls to these parity screens until those flows exist in the client. Logout uses the existing disabled button tokens while pending; session restoration remains covered by the native splash.

---

## 4. How to use this doc

- Start from the design order in [`design/web/web-pages-map.md` §7](design/web/web-pages-map.md#7-recommended-design-order).
- Page IDs in the map (A1, L1, B1…) are stable handles — link designs, code, and spec with them.
- If a decision affects system-wide visuals (tokens, components, motion), change it here. If it affects web page structure, change it in the web map.

---

## 5. File map

```
SPECIFICATION.md          product scope (source)
DESIGN.md                 this file — design system
design/client-designs.pen  all clients — tokens, type, spacing, screens (iterative)
design/logo.pen            logo guidelines — The Stack (§3.4): masters, colour, scaling, lockups, icons
design/web/web-pages-map.md  web pages, dialogs, states, sitemap
```
