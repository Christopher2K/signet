# Signet Design System

> **Source of truth for design direction.** Product scope is defined in `SPECIFICATION.md`. This file defines the design language; per-client page inventory lives in `design/web/web-pages-map.md` and is not duplicated here.

**Status:** v1 draft — Web scope first  
**Source:** `SPECIFICATION.md` v1 draft 2026-11-07

---

## 1. Scope

| Client | Priority | Design doc |
|---|---|---|
| **Website** | P0 — defines v1 | This file for system + [design/web/web-pages-map.md](design/web/web-pages-map.md) for pages |
| Browser extension | P0 | TBD |
| Mobile (iOS/Android) | P0 | TBD |

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

_To be defined as designs land. Web-first; tokens extracted from Pencil designs under `design/web/`._

### 3.1 Color — Signet Paper & Cobalt

Source palette (Coolors, [`design/assets/palette.png`](design/assets/palette.png), sampled — do not alter):

| Token | Hex | RGB | Role in palette |
|---|---|---|---|
| `ink` | `#3C3744` | 60, 55, 68 | Dark plum-slate — ink, text, dark surfaces |
| `cobalt` | `#090C9B` | 9, 12, 155 | Deep cobalt-indigo — emphasis, focused/selected, dark primary |
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
| `--selection` | `mist` `#B4C5E4` + `ink` text | Selected rows, tags | 6.61:1 (AA) |
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
| `--selection` | `cobalt` `#090C9B` + `paper` text | Selected rows (13.45:1) |
| `--accent` | `azure-200` `#B4C5E4` | Links, highlights on dark |

#### Color rules

- **Text:** Only `ink` on `paper`, `paper`/`mist` on `ink`, and `cobalt` on `paper`/`mist` meet AA. `mist` is never text on light (1.72:1). `azure` is text/link only on `paper`/`white`, never body copy.
- **Primary action:** Light = `azure` fill with `paper`/`white` text. Emphasized/hero and selected states = `cobalt` fill with `paper`/`mist` text. Do not use `cobalt` for body backgrounds on light.
- **Surfaces:** `paper` canvas vs `white` cards distinguished by `border` `#8FA3C6`, not by paper/white contrast (1.02). Sidebar = `azure-50` tint.
- **Selection/tags:** `mist` fill + `ink` text everywhere; it survives both themes.
- **Status (not in source palette — extend minimally):** Success `#2E7D52`, Warning `#9A6A00`, Error `#B42318` on `paper` for toasts and field errors; same hues lightened for dark. Always pair with icon/text, never color alone.
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
    --primary:#5C84C6; --accent:var(--signet-mist);
  }
  ```

- **Type / Spacing / Radii / Elevation:** TBD
- **Components (Web):** App shell, Folder tree, Bookmark card (grid/list), Tag chip, Search input, Folder picker, Dialog / Bottom sheet, Toast, Empty state, Skeleton, Sync status dot, Public header, Settings nav. Map to components as `03-library-home.pen` lands.
- **Motion:** Reflect sync state, not decoration. Create feedback <2s, remote updates <5s, queue drain <10s must be visible, not silent.
- **Responsive:** Desktop ≥1024px (3-zone shell), mobile 390px (drawer, bottom sheets). Public pages single-column, auth centered card.

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
design/web/web-pages-map.md  web pages, dialogs, states, sitemap
design/web/*.pen          pencil designs, named in web-pages-map §9
```
