# Signet Design System

> **Source of truth for design direction.** Product scope is defined in `SPECIFICATION.md`. This file defines the design language; per-client page inventory lives in `design/web/web-pages-map.md` and is not duplicated here.

**Status:** v1 draft — Web system + native core screens
**Source:** `SPECIFICATION.md` v1 draft 2026-11-07

---

## 1. Scope

| Client | Priority | Design doc |
|---|---|---|
| **Website** | P0 — defines v1 | This file for system + [design/web/web-pages-map.md](design/web/web-pages-map.md) for pages |
| **Browser extension** | P0 | Safari iOS quick save: this file §3.9 + `design/client-designs.pen` §45 |
| Mobile (iOS/Android) | P0 | `design/client-designs.pen` §37–§44 (auth, library, bookmark CRUD, session feedback, animated launch, custom top navigation bar) |

Website is the primary manager: responsive (desktop + 390px), no install, email/password against a self-hosted server URL. If a feature works anywhere, it works on web first.

---

## 2. Web — what to design

**See [design/web/web-pages-map.md](design/web/web-pages-map.md) for the full inventory:** sitemap, page dialogs (A1/A2, L1–L5, B1/B2, F1, D1–D4, S1–S3, P1–P4), system states (E1–E8), responsive rules, spec traceability (F01–F10, W-01–W-09), design order, and file naming.

Summary only:

- **10 full pages + 7 dialogs + 10+ states** — do not duplicate the table here.
- **M1 Marketing Landing:** `design/client-designs.pen` §43 is the public promotional entry, with 1440px desktop and 390px mobile designs. Self-hosting is currently the only onboarding path; M1 links to the Docker quickstart and GitHub, not a hosted signup/login. Authenticated `/` remains L1, standalone A1/A2 auth remains available on each self-hosted deployment, and anonymous public-link behavior is unchanged.
- **App shell:** topbar (search, New Bookmark, sync status) + folder tree → drawer on mobile (W-09) + main list.
- **Cross-cutting to visualise:** real-time push <5s (F06), offline queue + pending badges (F07), OG auto-fill (F08).

Out of scope for web v1 (§9 of SPEC): password reset, email verification, OIDC, admin dashboard, Netscape HTML, user→user sharing, link passwords, archive, history sync.

---

## 3. Design language

_Web-first tokens and components are maintained in `design/client-designs.pen`; this document defines their semantic roles and production rules._

### 3.1 Color — Signet Ink & Amber

Source palette (canvas study frame `2. Ink & Ember` in `design/client-designs.pen`, sampled — do not alter):

| Token | Hex | RGB | Role in palette |
|---|---|---|---|
| `ink` | `#2E2620` | 46, 38, 32 | Warm charcoal-brown — ink, text, dark surfaces |
| `rust` | `#7C2D12` | 124, 45, 18 | Deep rust — emphasis, pressed, focused/selected |
| `ember` | `#C2410C` | 194, 65, 12 | Ember orange — primary interactive (buttons, links) |
| `peach` | `#F2C9A4` | 242, 201, 164 | Soft peach — tints, selection, tag chips, focus halo |
| `paper` | `#FDF6EE` | 253, 246, 238 | Cream paper — app canvas |

**Palette character:** warm cream paper + ember-orange gradient from deep rust to soft peach, anchored by charcoal-brown ink. Use `paper` as the default canvas (not pure white) for the bookmark-list warmth; use ember for action and wayfinding, never for body text except `rust` on `paper` (8.75:1) and `ink` on `paper` (12.9:1).

#### Derived scales

For tints/shades between source tones (interpolated, keep hue):

| Step | Ember scale | Rust scale | Ink scale |
|---|---|---|---|
| 50 | `#FBEEE1` | `#F3E9E4` | `#F5EFE8` |
| 100 | `#FAE3CC` | `#E5CDBF` | `#EAE3DB` |
| 200 / Peach | `#F2C9A4` | `#D4A98C` | `#D8CDBF` |
| 300 | `#E9A677` | `#B97B4F` | `#A89484` |
| 400 | `#F97316` | `#93391C` | `#6E5F53` |
| 500 / Source | `#C2410C` | `#7C2D12` | `#2E2620` |
| 600 | `#9A3412` | `#661F0D` | `#241E19` |
| 700 | `#7C2D12` | `#4E1709` | `#1B1611` |
| 900 | `#4A1B0A` | `#2E0D05` | `#1C1510` |

#### Semantic tokens

**Light (default):**

| Token | Value | Usage | Contrast note |
|---|---|---|---|
| `--bg` | `paper` `#FDF6EE` | App canvas, auth, public pages | — |
| `--surface` | `#FFFFFF` | Cards, dialogs, list rows | use border to separate |
| `--surface-alt` | `ember-50` `#FBEEE1` | Sidebar, selected filter area | Decorative only |
| `--text` | `ink` `#2E2620` | Primary text | 12.9:1 on paper (AAA) |
| `--text-secondary` | `ink-400` `#6E5F53` | Secondary text, metadata | ~5.9:1 on paper (AA) |
| `--text-muted` | `#9A8A7C` | Placeholders, pending hints | Do not use for essential text |
| `--border` | `#B08350` | Inputs, dividers | 3.16:1 on paper — do not use peach alone for borders |
| `--border-soft` | `peach` `#F2C9A4` | Subtle separators on dark fills | Fails on paper — only on ink/rust fills |
| `--primary` | `ember` `#C2410C` | Default buttons, links | 4.84:1 on paper (AA) |
| `--primary-hover` | `ember-600` `#9A3412` | Hover | — |
| `--primary-active` | `rust` `#7C2D12` | Pressed / emphasized | 8.75:1 on paper |
| `--accent` | `rust` `#7C2D12` | Selected nav, focus ring, public header | Use `paper` text on rust |
| `--selection` | `peach` `#F2C9A4` + `ink` text | Selected rows and navigation | 9.67:1 (AAA) |
| `--focus-ring` | `rust` `#7C2D12` + 2px `peach` outer | Keyboard focus | Must be visible on paper and peach |

**Dark (derived from ink + paper):**

| Token | Value | Usage |
|---|---|---|
| `--bg` | `ink` `#2E2620` | Canvas |
| `--surface` | `#241E19` (ink-600) | Cards, dialogs |
| `--text` | `paper` `#FDF6EE` | Primary text (12.9:1 on ink) |
| `--text-secondary` | `peach` `#F2C9A4` | Secondary (10.7:1 on ink-600) |
| `--border` | `#57493C` (ink lightened) | Borders |
| `--primary` | `ember-400` `#F97316` | Buttons/links on dark (`ember` `#C2410C` fails on ink — never use it on dark) |
| `--on-primary` | `ink-900` `#1C1510` | Text on dark primary buttons (6.4:1) |
| `--text-muted` | `ink-300` `#A89484` | Placeholders only |
| `--selection` | `rust` `#7C2D12` + `paper` text | Selected nav and rows |
| `--tag` | `peach` `#F2C9A4` + `ink` text | Tag chips and filter chips in both themes |
| `--accent` | `peach` `#F2C9A4` | Links, ghost-button text/strokes, highlights on dark |

#### Color rules

- **Text:** Core body combinations are `ink` on `paper`, `paper`/`peach` on `ink`, and `rust` on `paper`. Dark primary buttons additionally use `ink-900` on `ember-400` (6.4:1); status combinations are listed below. `peach` is never text on light. `ember` is text/link only on `paper`/`white`, never body copy.
- **Primary action:** Light = `ember` fill with `paper`/`white` text. Emphasized/hero and selected states = `rust` fill with `paper` text. Do not use `rust` for body backgrounds on light.
- **Surfaces:** `paper` canvas vs `white` cards distinguished by `border` `#B08350`, not by paper/white contrast. Sidebar = `ember-50` tint.
- **Selection:** light = `peach` fill + `ink` text; dark = `rust` fill + `paper` text. Use for selected nav and rows, not tags.
- **Tags/filter chips:** `peach` fill + `ink` text in both themes (`--tag`). Rust is reserved for selection and emphasis.
- **Dark secondary actions:** `peach` fill + `ink` text. Do not use rust for Cancel next to an ember-400 primary; the primary action must remain the strongest action.
- **Status (not in source palette — extend minimally):** Light: Success `#2E7D52`, Warning `#9A6A00`, Error `#B42318`. Dark text/icons: Success `#75D6A0`, Warning `#F2C14E`, Error `#F97066`. Filled badges/toasts may keep the light status fills with `paper` text in both themes. Always pair with icon/text, never color alone.
- **CSS starter:**
  ```css
  :root {
    --signet-ink:#2E2620; --signet-rust:#7C2D12; --signet-ember:#C2410C;
    --signet-peach:#F2C9A4; --signet-paper:#FDF6EE;
    --bg:var(--signet-paper); --surface:#FFFFFF; --text:var(--signet-ink);
    --primary:var(--signet-ember); --accent:var(--signet-rust);
  }
  [data-theme="dark"] {
    --bg:var(--signet-ink); --surface:#241E19; --text:var(--signet-paper);
    --primary:#F97316; --on-primary:#1C1510; --accent:var(--signet-peach);
    --tag:var(--signet-peach); --on-tag:var(--signet-ink);
    --text-muted:#A89484; --success:#75D6A0; --warning:#F2C14E; --error:#F97066;
  }
  ```

### 3.2 Type — Space Mono

**Primary typeface (all text): Space Mono** — Colophon Foundry, [github.com/googlefonts/spacemono](https://github.com/googlefonts/spacemono). An original monospace display family with Regular 400 and Bold 700 cuts, licensed under SIL OFL 1.1. Its geometric slab core and distinctive letterforms give Signet a retro-editorial voice, while the true Bold cut provides reliable native navigation titles and URL, tag, and table text remains fixed-width.

> Canvas trade-off: pen.dev does not ship Space Mono, so `design/client-designs.pen` renders samples in IBM Plex Mono as a stand-in. Production token remains `font-primary: "Space Mono"`; mobile and web bundle the official Regular and Bold files.

| Style | Token | Size / Weight | Usage |
|---|---|---|---|
| Display | `type-display` | 48 / 700 | Public pages (P1/P2), empty states |
| Headline | `type-h1` | 32 / 700 | Auth (A1/A2), Settings headers |
| Title | `type-h2` | 20 / 600 | Folder (L2), bookmark cards |
| Body | `type-body` | 15 / 400 | Notes, titles, folder names |
| Caption | `type-caption` | 12 / 400 | URLs, metadata, timestamps, tags |
| Code | `type-mono` | 13 / 400 | JSON export, tokens, sync state |

Full specimen in `design/client-designs.pen` §3. Display is 48px on desktop/tablet and may step down to Headline 32px at 390px to avoid excessive wrapping. Code 13px is used for sync timestamps, share URLs, and machine-oriented values; it is the same Space Mono family, not a second font. Because the family has no intermediate cuts, requests for weight 600 resolve to Bold 700 rather than a synthetic weight.

### 3.3 Spacing & radii — 4pt grid

| Token | Value |
|---|---|
| `sp-1 … sp-12` | 4, 8, 12, 16, 24, 32, 48 |
| `radius-sm / md / lg` | 4 / 8 / 12 |
| `radius-card / pill` | 16 / 999 |

Base unit 4px in `design/client-designs.pen` §4. The canvas uses literal 4pt values with adjacent token captions until a whole-file variable migration; production code must use `--sp-*` and `--radius-*` variables rather than hard-coded values. Do not mix variable-bound and literal sections in the canvas.

### 3.4 Logo — The Stack

**Source of truth:** `design/client-designs.pen` §46–§54 — full guidelines imported from `design/logo.pen` (construction, colour, scaling, lockups, clear space, app icons, misuse, in-use references), recoloured to Ink & Amber. This section is the summary; the canonical sheets decide details. `design/logo.pen` remains a standalone, equally recoloured mirror.

- **Canvas sheets:** §46 cover · §47 optical masters · §48 colour · §49 scaling · §50 lockups · §51 clear space & minimum size · §52 app icons & favicons · §53 misuse · §54 in use (ZONE 01, three height-balanced columns).
- **Mark:** three bookmark tabs stepped down and across, `peach #F2C9A4 → ember #C2410C → rust #7C2D12` back to front (one collection, every client; the deepest tone is the one you touch). Front tab is always the deepest colour at every size.
- **Optical masters — pick by rendered size (CSS px), never scale across ranges:**

| Rendered size | Master | Tabs | Gap |
|---|---|---|---|
| ≤ 16px | 16 | 1 (front only) | none |
| 17–24px | 24 | 2 (ember, rust) | 2px |
| 25–40px | 32 | 3 | 2px |
| > 40px | 48 | 3 | 1/24 of size |

- **Dark colourway:** `#57493C → ember-400 #F97316 → peach #F2C9A4` (ember #C2410C fails on ink; rust never on dark). Mono variants: ink on light surfaces, paper on rust/ember/photo.
- **Lockups:** horizontal default (wordmark 0.625M, gap M/3, min mark 24px); stacked (0.5M, gap M/5, min 32px). Wordmark = Space Mono 700, "Signet". Clear space M/4; minimum mark 16px (favicon only).
- **Assets:** ship `logo-16/24/32/48.svg`; a `<Logo size>` component selects by the same thresholds. Export the gap as a cut-out, not an outline, so the mark works on any surface.

- **Type / Spacing / Radii / Elevation:** See 3.2–3.3 above; Elevation TBD
- **Components (Web):** App shell, Topbar, Account menu, Folder tree, Bookmark card (grid/list, shared `BookmarkCard`), Tag chip, Search input, Text field, Folder picker, View toggle, Sort control, Dialog / Bottom sheet, Toast, Empty state, Skeleton, Sync status dot, Public header, Settings nav. Repeated canvas UI uses Pen components and `ref` instances rather than detached copies; page-specific compositions stay ordinary frames. **Buttons:** one compact size on every artboard (including the palette explorations) — 36 px tall, `[8, 16]` padding, `radius-md`, a single 15 px Space Mono label, intrinsic width unless the row fills; there is no second, taller button scale, and only native screens use 48 px actions. **Icons:** [Phosphor Icons](https://phosphoricons.com) (`regular 20–24`, `bold` emphasis, `fill` active) — production SVGs; the canvas embeds official Phosphor SVG path geometry inside targets named by the exact Phosphor name (e.g. `Icon-List`). Import uses `DownloadSimple` because Phosphor has no `Import` glyph. The component and icon inventory lives in `design/client-designs.pen` §36.
- **Motion:** Reflect sync state, not decoration. Create feedback <2s, remote updates <5s, queue drain <10s must be visible, not silent.
- **Responsive:** Desktop ≥1024px (3-zone shell), mobile 390px (drawer, bottom sheets). Public pages single-column, auth centered card.

### 3.5 Native auth

Native A1/A2 live in `design/client-designs.pen` §37–§38, with light and dark 390 × 844 screens for iOS/Android. They use the existing color, type, spacing, and radii tokens: a full-bleed `paper`/`ink` canvas, safe-area-aware cardless layout, 48px full-width inputs and primary action, and `radius-lg` controls. Forms must remain keyboard-avoiding and scrollable so the action stays reachable. Both forms place an editable **Server URL** field before the account fields. Native authentication uses the selected absolute HTTP/HTTPS origin, normalizes trailing slashes, and persists the normalized URL with the session; the last selected server remains after logout and is used for restoration and retry. Other fields, cross-links, backend behavior, and inline errors match web A1/A2; do not duplicate the existing splash screen.

### 3.6 Native library and session feedback

Native L1 and the server-unavailable state live in `design/client-designs.pen` §39–§40. Native bookmark CRUD lives in §41 and mirrors the currently implemented `apps/web-client` `/` route. Native navigation titles use **Space Mono 700** on both iOS and Android for a bold, consistent screen hierarchy; §3.8 defines the reusable custom topbar that replaces the system stack header. Expo Font registers the official Regular 400 and Bold 700 cuts under one family so native chrome selects the real Bold face rather than synthesizing it. L1 uses the custom topbar (§3.8) with the **Library** title and a bottom tab bar with **Library** (selected) and **Account**. The Library topbar owns the primary create action: a trailing icon target with accessibility label **New Bookmark** — Phosphor `Plus`, tinted `ember`/`ember-400`, on the tinted target from §3.8 so it stays the strongest action at 44 × 44 (iOS) / 48 × 48 (Android). Keep system status-bar insets, touch targets, pressed states, and contrast intact when rendering the bar. Account uses the same bar in its compact form with a centered title only on iOS, and §39 shows both the expanded Library and the compact Account representations. Do not duplicate the create button in the collection header or empty state. The action remains available in loading, empty, error, and populated states. Library shows the newest-first bookmark collection with loading, error, and empty states; each card opens the external link or a modal editor. The three-state density control — a standard trailing `DotsThree` action immediately before **New Bookmark** that opens the platform-native popup menu (SwiftUI on iOS, Compose on Android), labelled through `library.density.*` with the active option checkmarked — replaces the former toolbar beneath the topbar and renders only while the collection has at least one bookmark. iOS uses **Card size** as the menu heading; Android relies on the native menu with no heading slot. The collection heading — **All Bookmarks** plus the count and sort note — keeps scrolling with the cards. **Medium** is the default and the principal card: one 40 px artwork tile (`radius-md`, `surface-alt`), a title with the hostname beneath, then notes and tags, and a single footer row that pairs the saved date with intrinsic-width Open (`primary`) and Edit (`secondary`) buttons. **Big** leads with a full-width preview banner locked to the 1200 × 630 Open Graph ratio (1.91:1) so the stored OG image fills it without cropping (`contentFit: cover`, `radius-md`, `surface-alt`, 1 px `border`), then the same title, hostname, notes, tags, and footer; without an image the banner centres a 64 px site icon instead. **Compact** is one row: a 24 px icon tile, the title with the hostname, and trailing 40 × 40 bordered icon buttons — Open (`ArrowSquareOut`) and Edit (`PencilSimple`) — carrying translated `library.itemOpen` / `library.itemEdit` labels. The choice persists per client (`signet.library.density` via AsyncStorage on native and `localStorage` on web), compact lists tighten the gap to 8 px, and every density keeps the platform hit targets. Artwork never blows up a 16 px favicon: cards prefer the stored site `icon` resolved at save time, then the origin's `/apple-touch-icon.png`, then `/favicon.ico`, and fall back to the bookmark glyph; the big banner prefers the stored `image` first. Updated timestamps belong to the editor, not the card. Account owns the signed-in email and logout. §40 provides the saved-session retry.

Both clients render this card from the shared `BookmarkCard` in `@signet/design-system` — `bookmark-card.native.tsx` implements the three native densities and `bookmark-card.web.tsx` keeps the web card. One signature serves both: `bookmark` (the `BookmarkCardData` that `@signet/core`'s `getBookmarkCardModel` derives from a saved bookmark), `density` (`big` / `medium` / `compact`, default `medium`), translated `strings` (`BookmarkCardStrings`, supplied by the app so each client keeps its own translation keys), and the `onEdit` / `onOpen` callbacks. Web keeps its List/Grid toggle by mapping List to `medium` and Grid to `big`, and passes the optional `updatedOn` string so its card can still show the edit timestamp. On web that toggle sits in a sticky toolbar above the content column — aligned to the 1280 px content width, trailing the toggle, on the page background with a 1 px bottom border — so it stays visible while the page scrolls; the "All Bookmarks" heading and count scroll away with the content. Keep the design system free of `@signet/api` and `@signet/core` imports: the contract is structural, and each call site type-checks the derived model against it.

Native create and edit use full-screen modal forms with 48px controls and keyboard-avoiding scroll content. Create and Edit dock their primary **Save** action above the home-indicator safe area in an 80px surface dock with 16px padding. Only fields and secondary actions scroll; Save stays outside the scroll view and remains visible while scrolling, with keyboard avoidance keeping it reachable. On Edit, **Delete** remains in the scrollable content. Create and Edit place **Cancel** in the leading slot of the custom topbar (§3.8) on both iOS and Android, without duplicating it in either form. iOS uses Cancel text in **Space Mono 400**; Android uses a **Phosphor X** icon target with **Cancel** as its accessibility label, derived from the official Phosphor SVG. Both dismissal controls use the theme's **danger** color to signal a destructive action. Create checks the canonical URL before saving and presents **Already saved** with **Open existing** / **Save anyway**; a failed duplicate check still permits a deliberate save. Edit includes notes, tags, image override, timestamps, and a platform confirmation before permanent deletion. Successful mutations update the visible collection without a manual refresh. Do not add search, folders, offline queues, or other future controls to these parity screens until those flows exist in the client. Logout uses the existing disabled button tokens while pending; session restoration remains covered by the native splash.

### 3.7 Native launch motion — Stack settles

The animated native launch design lives in `design/client-designs.pen` §42, with the full behavior and QA contract in [`design/native-animated-splash-proposal.md`](design/native-animated-splash-proposal.md). It uses a static native launch screen followed by a matching React Native Reanimated overlay; iOS and Android native launch assets remain static.

- **Concept:** the existing Stack gathers once, settles, and reveals the Space Mono Bold `Signet` wordmark. Motion represents collecting a bookmark and must not become a looping loading indicator.
- **Canvas and mark:** light uses `paper #FDF6EE` with the standard Stack; dark uses `ink #2E2620` with the existing dark Stack. Render the 48px optical master at 96 × 96. Replace the current off-palette chevron asset during implementation.
- **Timing:** gather 0–180ms, settle and identify 180–620ms, then a 240ms exit only after fonts load, session restoration finishes, and the destination mounts. Slow initialization holds the settled frame without replaying the intro.
- **Reduce Motion:** skip gather, stagger, and translation; retain the static identity and use a 120ms crossfade as soon as the destination is ready.
- **Lifecycle:** run once per cold JavaScript root mount, never on foreground resume or retry. Restore failure exits to Native §40. The splash has no spinner, status copy, haptics, or sound; its decorative content is hidden from accessibility services and the overlay unmounts after exit.
- **Implementation direction:** use the installed `expo-splash-screen`, Reanimated, and React Native SVG packages. Do not add Lottie solely for these three vector paths. Validate standalone release builds in light/dark and with reduced motion.

### 3.8 Native custom top navigation bar

The reusable native top bar lives in `design/client-designs.pen` §44 (anatomy, variants, states, platform presets). It replaces the system stack header on the screens that adopt it, so Signet owns one predictable bar — Space Mono title, Phosphor icons, tokenized surface — while keeping each platform's height, touch target, safe-area, and title conventions. Set `headerShown: false` on those stack screens and render the bar once per screen.

- **Surface:** the header is one block — status inset plus bar. The `surface` fill continues behind the status bar (never a floating pill or second card), and a 1px `border` hairline on the bottom (`#8FA3C6` light / `#4F4A62` dark) is the only separation from content. No shadow, gradient, or glass.
- **Height and targets:** iOS 44 compact, 60 on modal forms, or 92 with the expanded large title; Android 56. Accessibility targets remain 44 × 44 on iOS and 48 × 48 on Android, with visible feedback fills inset by 4 (36 × 36 / 40 × 40). Horizontal inset 8, or 16 for iOS modal forms to align with their content; slot gap 8 (4 on Android). Icons are Phosphor `regular` at 24, centred in the target.
- **Title:** `Title` 20/700 Space Mono, line height 1.3, a single line with an ellipsis. iOS centres it between symmetric slots; Android leads it at x=60 with a leading action, or x=16 without one. The title never wraps and never displaces the slots (270 max at 390).
- **Slots:** leading = navigation `CaretLeft` (chevron-left idiom) or a `Cancel` text action (15/400 `--error`, modal forms only — never both); Android renders that slot as a Phosphor `X` target labelled Cancel. Trailing = one to two icon actions: popup-menu trigger icons use `--text` to match the title, while other trailing actions remain `--primary`; the primary create action may take the tinted target (`ember-50` light / `ink` dark). A trailing action may open a platform-native popup menu; the menu uses native typography, selection marks, and dismissal rather than custom popup chrome. Every top-bar button animates its pressed feedback as a background-colour fill, with no scale or opacity change: standard targets fade to a `surface-alt` fill, and prominent targets fade from `surface-alt` to `logoBack`. The fill is always at `r-8`; text-action feedback adds 8px horizontal padding around the label. Press fades in and release fades back over 150ms ease-out. Reduce Motion switches the fill instantly. The iOS popup-menu trigger keeps the native system highlight, because the native menu does not expose press state to JavaScript; Android animates its menu trigger like any other button. Disabled actions use `--text-muted`.
- **Large title (iOS only):** 32/700 on Library-style screens; scrolling collapses to the 44 compact bar by height only, and Reduce Motion keeps that change instant. Android always uses the compact bar.
- **Icons and copy:** Phosphor `CaretLeft`, `Plus`, `Check`, `DotsThree`, `X`; the canvas embeds the official SVG path data. Every target carries an `accessibilityLabel` and hides the decorative glyph from accessibility. Strings stay in `@signet/locale` (en/fr) — `navigation.*` and `actions.cancel`/`actions.save`. RTL mirrors the slot row and swaps `CaretLeft` for `CaretRight`.

### 3.9 Safari iOS quick save

Safari iOS quick save lives in `design/client-designs.pen` §45. The extension popup is a 360px desktop-sized surface that expands to the full-width Safari sheet on iPhone. It uses the existing Ink & Amber tokens, bundled Space Mono Regular/Bold, 4pt spacing, and 12px control radii; light and dark appearances follow the semantic tokens in §3.1.

- **Ready:** a compact Signet identity header, editable **Title**, visible read-only **URL**, inline status region, and one full-width 48px **Save** action. The title uses the shared required/non-empty rule; only HTTP(S) tab URLs can be saved. No notes, tags, folder picker, artwork editor, browsing, or Safari bookmark controls appear.
- **Feedback:** loading, empty-title, unsupported-page, offline, generic failure, signed-out, expired-session, already-saved, and saved states use the same surface and live status region. Retryable failures keep Save enabled. Saved and duplicate states disable it; duplicate handling never replaces the existing bookmark title.
- **Authentication:** signed-out and expired-session states replace the bookmark fields with one full-width 48px **Open Signet** action that launches the containing app to sign in. There is no extension login form and no token visible in the popup.
- **Responsive/localization:** long URLs wrap anywhere and long English/French copy grows vertically without covering Save. The design includes light/dark ready, saved, already-saved, and signed-out examples.

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
design/client-designs.pen  all clients — tokens, type, spacing, M1 marketing, screens (iterative)
design/logo.pen            standalone mirror of the logo guidelines — The Stack (§3.4); canonical in client-designs.pen §46–§54
design/native-animated-splash-proposal.md  native launch motion proposal and QA contract (§3.7)
design/web/web-pages-map.md  web pages, dialogs, states, sitemap
```
