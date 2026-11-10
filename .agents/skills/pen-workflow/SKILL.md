---
name: pen-workflow
description: Work with Signet Pen design files — open design/client-designs.pen via Pen CLI headless, keep artboards vertically stacked, and always ground every change in DESIGN.md
---

# Pen Workflow — Signet

Use this skill whenever creating or iterating on `design/client-designs.pen` (or any `.pen` file under `design/`). It encodes the conventions that keep the canvas readable and the system consistent.

## 1. The canonical file

- **Single source of truth:** `design/client-designs.pen` carries **all** client designs (web first, then extension / mobile as new sections). Do not create `designs/` (plural) files. Do not scatter other `.pen` files.
- **Web page inventory:** `design/web/web-pages-map.md` + `DESIGN.md`. Never duplicate inventory tables back into `DESIGN.md`.
- **Palette source:** `design/assets/palette.png` + `DESIGN.md` §3.1.

## 2. Always open the right file — Pen CLI, headless

`.pen` files are **encrypted**. Never use Read / Grep / Edit on them.

The Pen MCP via the desktop app writes to the **active editor document** (e.g. it previously polluted `libre-chat-expo.pen`). Do not use that path for Signet work.

Use the global CLI in headless mode, which pins `--in` / `--out` to the target file (`file path is automatically injected — you never need to pass it`):

```bash
export PATH="$HOME/.local/share/mise/shims:$PATH"
pen interactive --in design/client-designs.pen --out design/client-designs.pen
# then in the shell:  execute({input:`...`})  save()  exit()
```

- `pen status` / `pen version` to verify auth before work (CLI is `0.3.15`, signed in as christopher2k).
- `pen --out <file.pen> --prompt "..."` spins up an AI agent (Claude/Codex) which needs extra login — prefer `pen interactive` headless for deterministic `execute()` ops unless the user asks for AI generation.
- Driving headless from this harness: pipe tool calls as stdin lines via a tiny runner (each line = one tool call), don't try to attach to a TTY. Pattern used for §5:

```python
# /tmp/run_pen.py — feed cmds file, expect save() + exit() as last lines
stdin_data = "\n".join(cmds) + "\n"
proc = subprocess.run(["pen","interactive","--in","design/client-designs.pen","--out","design/client-designs.pen"], input=stdin_data, ...)
```

- After any `execute()`, call `save()` then `exit()`. Verify the file exists on disk (`ls -lh design/client-designs.pen`) — if it doesn't, the write went to the wrong doc.
- `execute()` takes **no `uri` arg** in headless mode. Inside `execute`, use `document`, `Insert(document, ...)`, `Update(id, ...)`, `Delete(id)`, `Get(n => ...)`, `SetVariables(...)`, `Print(...)`, `Export(...)`.
- Batch related inserts into one `execute()` call. Never set `id` manually — pen.dev generates it. Capture returned ids (`sec5 = Insert(...)`) and reuse them in later `Insert(sec5, ...)` calls in the same or later calls (globals persist across calls).
- **`execute` input is one line — separate statements with `;`.** Collapsing multi-line JS with plain spaces (`}) Insert(`) fails with `SyntaxError: expecting ';'` and rolls back the whole block (`editId` in the error). Generate the snippet by joining stripped lines with `;`, e.g. `";".join(line.strip() for line in js.splitlines() if line.strip())`, and append a trailing `;`. Keep no single-quote inside the wrapped `'...'` input; use `"` for JS strings and `\uXXXX` escapes for `§/—/·` if shell encoding is a risk.
- Keep `fontFamily` to an **installed** monospace for canvas rendering (`IBM Plex Mono`). Production token stays `Necto Mono` — Necto Mono is not shipped with the canvas (see DESIGN.md §3.2).

Verify layout without screenshots:

```js
Print(Get((n,c)=>{ if(c.depth===0) Print(n.name, c.bounds.x, c.bounds.y, c.bounds.width, c.bounds.height); }))
Get(frameId, (n,c)=>c.problems && Print(n.name, c.problems))  // must print nothing
Get(n=>n.reusable && Print(n.name, n.id))                     // component inventory
```

Export QA images only when a section is complete. `outputPath` for PNG is a **directory** — each node writes to `<nodeId>.png` at 2×:

```js
Export(["<frame-id>"], "png", "/tmp")  // → /tmp/<frame-id>.png
```

## 3. Artboards: vertically stacked

All top-level artboard frames live in **one vertical column**, top-to-bottom in section order (§0 → §1 → §2 …), same width, no overlaps.

- `x = 0` for every frame. Width `1200` unless a section needs otherwise.
- `y` = previous frame's `y + height + 48` (48px gutter). Recompute after inserts and `Update()` the `y` positions to fix stragglers. **Always re-read bounds** — heights drift a few px between reads due to font metrics, so never trust a memorized height.
- Do not use 2-column grids, horizontal rows, or free placement that forces scrolling to find a frame. (Side-by-side Light/Dark inside one frame is fine — it's a row inside a sheet, not top-level frames.)
- If a new section is added, append it below the last frame; do not insert it mid-column without re-stacking the tail.
- After re-stacking, re-read bounds to confirm no overlap (all `x=0`, strictly increasing `y`).

### Current inventory (§0–§40 — ids are pen-generated, re-lookup with `Get`)

All 41 top-level frames are vertically stacked at `x=0` with 48px gutters. Re-read bounds after every edit; heights and y positions drift as content changes.

| Frame | id | Notes |
|---|---|---|
| §0 Cover — Signet Paper & Cobalt | `mApjQ` | Width exception (`1277`); don't "fix" to 1200 |
| §1 Foundations — Color Scales | `G5z73D` | |
| §2 Variants — Light / Dark Tokens | `mtl7O` | |
| §3 Typography — Necto Mono | `YYynH` | |
| §4 Spacing & Radii — 4pt grid | `jd3QR` | |
| §5 Components — Button + Bookmark Card | `H6jw09` | Foundational component variants |
| §6–§35 Screens and states | `VXf93` … `fq5mP` | Stable page/state IDs and titles are inventoried in `design/web/web-pages-map.md`; re-lookup frame IDs with `Get` |
| §36 Shared States & Component Inventory | `V4X15` | Cross-page auth/form validation, toasts, sync/pending states, component inventory, and official Phosphor regular paths; keep shared variants here rather than duplicating them across every screen |
| §37 Native A1 Login | `R1otS` | Native iOS/Android login, 390 × 844, light + dark, safe-area-aware cardless form |
| §38 Native A2 Create account | `s2Tm4J` | Native iOS/Android signup, 390 × 844, light + dark, safe-area-aware cardless form |
| §39 Native L1 Library Home | `RcLY9` | Current web-client `/` route: native navigation title, large-title empty-library state, and Library/Account bottom tabs; Account owns email and logout |
| §40 Native Server unavailable | `YV4VF` | Saved-session restore failure with exact web-client message and retry action |

## 4. Always refer to `DESIGN.md` — never deviate silently

Before any design op, read `DESIGN.md` **and** `design/web/web-pages-map.md`.

- **Colors:** use only `DESIGN.md` §3.1 primitives and derived scales (`ink #3C3744`, `cobalt #090C9B`, `azure #3066BE`, `mist #B4C5E4`, `paper #FBFFF1`) and the semantic tokens in that section. **Never invent a hex.** If a needed token doesn't exist, flag it as a *proposed addition* in the frame and in `DESIGN.md` — do not silently introduce it. Patterns landed in §5 (all from existing tokens, no new hex):
  - Disabled = `azure-100 #DBE6F7` fill + `ink-400 #6B6578` text (+ `mist` stroke) — derived scale, not a new gray.
  - Pending badge = `Warning #9A6A00` fill + `paper #FBFFF1` text (DESIGN.md status token).
  - Focus ring = `azure-200 #B4C5E4` outer (2px pad, r12) + `cobalt #090C9B` inner (2px pad, r10) around a Primary button — hand-built from fills, strokes can't layer.
  - Ghost = no fill + `azure` stroke/text.
- **Type:** `Necto Mono` (Collettivo, SIL OFL, Marco Condello) for everything (DESIGN.md §3.2). Sizes/weights from the type scale (Display 48/700, Headline 32/700, Title 20/600, Body 15/400, Caption 12/400, Code 13/400). Canvas renders in IBM Plex Mono as a stand-in, token stays Necto Mono. Established section-shell pattern (§1–§5): header `18 / 700` in cobalt, note `12` in `ink-400 #6B6578` — caption the stand-in in the note so samples are never mistaken for the production font.
- **Spacing / radii:** 4pt grid only (`sp-*` = 4, 8, 12, 16, 24, 32, 48; radii 4/8/12/16 + pill — DESIGN.md §3.3). **File convention is literals + token captions:** `design/client-designs.pen` currently holds **no variables** (`GetVariables()` returns `{variables:{}}`) and all foundations use literal numbers (`padding:24`, `gap:12`, `cornerRadius:8`). Match that: use literal 4pt-multiples for padding/gaps/radii and name the token in the adjacent caption (e.g. `sp-12 × sp-24`, `r-8 radius-md`). Do not introduce `$sp-*` / `$radius-*` references mid-file (half-migrated file). If a future migration binds variables, migrate the whole column at once.
- **Components / sections:** name frames with stable IDs from the web map (`A1`, `L1`, `B1`…) and keep them discoverable as top-level frames. Mirror the map's zones, actions, and states — don't add chrome the spec doesn't ask for. Sections use `clip:true`, `cornerRadius:16`, `stroke:#8FA3C6` 1px, `layout:"vertical"`, `gap:12`, `padding:24`, starting with an `H` text node.
- **New system component?** Only add a token/component/section if you also **update `DESIGN.md`** in the same change, documenting the new addition and its tokens. If you are just implementing an existing token, don't edit `DESIGN.md`. The current semantic color rules live in `DESIGN.md` §3.1 and the component inventory pointer in §3.4; keep both synchronized with the canvas.
- When in doubt, ask before deviating. A deviating design is a bug, not a variant.

## 5. Components — Button + Bookmark Card (§5)

Foundational component sheet: `§5 Components — Button + Bookmark Card` (`H6jw09`, w `1200`; re-read `y`). Two component families, each as a section inside the one frame: `Buttons` (`Uzsf8`) and `BookmarkCard` (`ACaVo`). Both carry a `Title-20/600` heading plus a `Caption-12 ink-400` notes line citing tokens and SPEC refs. Labels in the sheet use `Body 15` (`normal`) and captions `12` (`normal`); only section heads use `18/700` and subsection heads `20/600`. Shared topbar, folder-tree, search, and dark-action components are also instanced throughout the screen sheets.

### Button — variants & states

Structure per variant: vertical cell (`width:fill_container`, `gap:8`) holding `Lab` (caption `15` ink), `Btn` (horizontal, `padding:[12,24]`, `cornerRadius:8`, centered), and `Tok` (caption `12 ink-400`, `fixed-width fill_container` so it wraps). Rows: `VariantRow` (5 cells `fill_container`, `gap:12`) + `StateRow` (3 cells).

| Variant | Fill / stroke | Label text | DESIGN.md token |
|---|---|---|---|
| Primary | `#3066BE` | `#FBFFF1` | `--primary` (`azure-500` + `paper`), default New Bookmark |
| Secondary | `#B4C5E4` | `#3C3744` | `--selection` (`mist` + `ink`), Cancel/select |
| Accent | `#090C9B` | `#FBFFF1` | `--accent` / `--primary-active` (`cobalt` + `paper`), emphasized/Save |
| Ghost | *(no fill)* + `#3066BE` 1px stroke | `#3066BE` | `--primary` as text/stroke, low emphasis |
| Disabled | `#DBE6F7` + `#B4C5E4` stroke | `#6B6578` | Derived `azure-100` + `ink-400`, no interaction |
| Hover (Primary Hover) | `#2752A6` | `#FBFFF1` | `--primary-hover` (`azure-600`) |
| Pressed (Primary Pressed) | `#090C9B` | `#FBFFF1` | `--primary-active` (`cobalt`) |
| Focus Ring | `Primary` inside cobalt/azure-200 wrap | `#FBFFF1` | `--focus-ring` — see construction above |

Conventions: all foundational sample buttons are labelled `New Bookmark` (Body 15) to isolate variant styling; token notes under each button name the fills + hex + role. Dark primary is `azure-400 #5C84C6` with `ink-900 #131220` text (4.91:1), never `azure #3066BE` on ink (2.07:1). Dark secondary uses mist + ink; dark ghost uses mist text/strokes. Light secondary doubles as the light selection token, but dark selection is cobalt + paper and is distinct from tags and secondary actions.

Build pattern (proven in §5): capture ids in the same call — `btnId = Insert(cell, bo); Insert(btnId, {...label})` — don't try to fetch a fresh child's id via `Get(cell).children`. The shell pattern is `bo = {type:"frame", ...}` then `if(b[1]) bo.fill=b[1]; if(b[2]){bo.stroke=b[2]; bo.strokeWidth=1}` so Ghost works with an empty fill slot.

### Bookmark Card — list row (L1 · B1 · SPEC 4.1)

One list row used by L1 (and L2/L3/L4/L5/B2, plus read-only P1/P2). Layout: `CardPair` horizontal (`gap:16`) with `LightCol` / `DarkCol` vertical (`fill_container`, `gap:8`, `ColLab` `12/700` cobalt). Each card: horizontal frame (`padding:16`, `cornerRadius:16`, `width:fill_container`, `gap:16`) holding `OG` (`72×72`, `cornerRadius:8`, `justify/align:center`, `OGLab` `15/700`) + vertical `TextCol` (`fill_container`, `gap:4`):

```
Title  (20/600, fixed-width)  "Signet — self-hosted bookmarks"
Host   (12, ink-400 / mist)   "signet.example.com"
Notes  (15 ink/paper, fixed-width)  "Search, offline queue and public links for self-hosting."
MetaRow (horizontal, gap:8)   [Chip work] [Chip reading] [Badge Pending sync]
Folder (12, ink-400 / mist)   "Folder: Guide / Self-hosting"
```

| Zone | Light token | Dark token | SPEC / map note |
|---|---|---|---|
| Card surface + border | `#FFFFFF` + `#8FA3C6` | `#2F2B3A` (`ink-600`) + `#4F4A62` | `--surface` / `--border` per theme, separated by border not paper/white contrast |
| OG placeholder | `#EEF3FB` (`azure-50`) | `#3C3744` (`ink`) | `image` missing → favicon placeholder (§4.1); fetch failure keeps hostname title (§4.1/F08) |
| Title | `ink #3C3744` | `paper #FBFFF1` | `<title>` else hostname |
| Host / Folder | `ink-400 #6B6578` | `mist #B4C5E4` | search/hostname context; Folder shows `folderId` name (`null` = Unfiled) |
| Notes | `ink` | `paper` | snippet of ≤2000 chars (list detail) |
| Chips | `mist #B4C5E4` + `ink`, pill `999`, `padding:[4,12]`, `Caption 12` | same mist + ink | `--tag` in both themes; cobalt stays reserved for selection/emphasis; `work, reading` example is F04 |
| Pending badge | `#9A6A00` + `paper`, pill | same | F07 / W-08 offline queue (`Pending sync`), always paired with text |

Why side-by-side in one frame: Light + Dark belong in the same §5 sheet (per section brief). Only top-level artboards are forbidden from 2-column grids — rows inside a sheet use `width:fill_container` columns, which is how `CardPair` works. New components sections follow the same rule: one top-level sheet, rows inside.

### Component marking — what is `reusable`

In Pen, `reusable: true` = component/symbol; `type:"ref"` with `ref:<id>` = instance. The §5 showcase nodes were marked in place, then shared components were instanced across the screen sheets. Preserve component IDs and instance overrides when restructuring: reparent existing nodes with `Move` instead of recreating them.

```js
// batch — one Update per id, then verify:
Update("cTUQz",{reusable:true});Update("D8CdJ",{reusable:true});  // …for every id below…;
Get(n=>n.reusable && Print(n.name, n.id))
```

Inventory (31 — re-lookup with `Get`, ids are pen-generated):

- **Buttons (11):** `cTUQz` Primary, `D8CdJ` Secondary, `aoaIT` Accent, `DHIm0` Ghost, `qYDBk` Disabled, `P3dgHI` Hover, `LkNZO` Pressed, `F6uXZ` Focus-inner, `vumi8` DarkPrimary, `J8Fs0U` DarkGhost, `n37HS` Error.
- **Cards (2):** `AVo6i` LightCard, `FfqnB` DarkCard.
- **Chips (4 `Chip`):** `RQEbD`, `ZEk0l` (light), `AMK69`, `O7BFSN` (dark) — each displays its own label (`work`/`reading`).
- **Badges (2 `Badge`):** `eAiUm` (light), `IVX47` (dark).
- **Search (2):** `O5Ha8B` Light, `OHy6I` Dark.
- **Topbars (6):** `iSLzd` Desktop Light, `AZE8U` Desktop Dark, `wPuYy` Tablet Light, `yN4nW` Tablet Dark, `P1Fcih` Mobile Light, `HjKP7` Mobile Dark.
- **Folder trees (4):** `rRXjr` Desktop Light, `VnuC4` Desktop Dark, `k7B2RV` Tablet Light, `NR0NI` Tablet Dark.

**Not reusable (intentional):** the §5 shell, `Buttons` / `BookmarkCard` sections, `VariantRow` / `StateRow` / `CardPair` rows, variant cells + `Lab`/`Tok` wrappers, `FocusOuter`/`FocusInner` wrappers, `OG` placeholders, `TextCol` / `MetaRow`. Don't mark section shells, rows, or placeholder/decoration wrappers as components. Instantiate repeatable UI with `{type:"ref", ref:<componentId>}` and override descendants via the instance `descendants` map, `Update(instanceId+"/childId", {...})`, or `Replace(...)` for slots; never `Update` a descendant id of a `Copy` (ids are regenerated) and never `Get` an instance without `resolveInstances:true` to discover its children.

## 6. Don'ts

- No `designs/` (plural) paths — always `design/`.
- No MIME of `.pen` contents into Read/Grep/Edit shell pipelines.
- No horizontal grids, no overlapping artboards at `0,0`. One vertical column, `x=0`, 48px gutter (§3).
- No `reusable` on section shells, rows, cells, `OG` placeholders, or focus wrappers — only repeatable UI components (§5).
- No new hex / font / spacing value without a corresponding `DESIGN.md` entry. Disabled, Pending, Focus, Ghost must reuse derived/status tokens (§4).
- No `$sp-*` / `$radius-*` variable refs until the file migrates to variables as a whole (§4).
- No `pen --prompt` AI-generation runs without explicitly flagging that they need agent auth and may not match `DESIGN.md`.

## 7. Build at scale — HOW (v3 template)

- **One top-level frame per screen**, `w=1200`, `x=0`, `clip`, `r-16`, `stroke #8FA3C6 1px`, `layout vertical gap 12 padding 24`, starting with `H 18/700 cobalt`. No side-by-side Desktop columns — each breakpoint is a full-width stacked device so Desktop reads as Desktop.
- Inside the sheet, stack sections vertically in fixed order: `Desktop` → `Tablet` → `Mobile`. Each section has a `12/700 cobalt` label (`Desktop` / `Tablet` / `Mobile`), then Light device over Dark device. Never side-by-side Light/Dark at 390 — at `(390-16)/2=187` per column everything clips and turns illegible. Side-by-side is only safe ≥1024.
- **Device widths (inner of 1200 sheet, padding 24 → 1152):** Desktop `width fill_container` (1152), Tablet `768` centered via parent `alignItems center`, Mobile `390` centered. Device `padding 24` (desktop/tablet) / `16` (mobile), `r-16`.
- **Center the card by parent alignment:** vertical `Device` with `alignItems center` + fixed-width card (`480` desktop / `440` tablet / `fill_container` mobile) centers it. Do not use auto margins.
- **Compute card width from column inner width before inserting:** inner = column − 2×device padding. Card must satisfy `card < inner`. At Tablet, column `376` (768 pair / 2) minus `48` = `328`, so a `440` card will always clip — use `320` there. At Mobile stacked `390`, `fill_container` works because the device *is* full width. Measure first; do not guess.
- **Authenticated shell responsive rule:** Desktop = Topbar + `Sidebar 240` + `Main fill_container` in a horizontal `Body` row. Tablet = same shell, `Main` narrower. Mobile = no sidebar (drawer closed), Topbar becomes `Menu + Signet + sync`, search moves below Topbar full-width, `Main` single column. The shell changes shape per breakpoint; do not just shrink Desktop.

## 8. Overflow playbook — HOW (run before save)

- **Audit every build, never skip it:** after inserts, run `Get(frameId,(n,c)=>c.problems && Print(n.name, c.problems))` for each new frame and iterate to *nothing printed*. "Looks fine in the PNG" is not enough — `partially clipped` hides at 2× scale. Export only after audit is clean.
- **Text measure:** mono at `15px` ≈ `9px` per char. Worst-case inner for a wrapped line = container − card padding − input padding. If `chars × 9 > inner`, the single-line node *will* clip. Either shorten the sample value to fit the worst breakpoint or wrap it.
- **`T` vs `TW`:** `T(p,n,c,s,w,f)` (no wrap, auto width) only for short labels that provably fit (`Signet`, `Log in`, counts). Everything that can exceed its container — Titles, Notes, Host, Sub, field values with sentences/URLs, empty-state bodies, footers — must use `TW` (`textGrowth fixed-width width fill_container`) so it wraps instead of clipping. Wrapping grows height; that is correct.
- **Inputs:** a bare `T` value inside an `Input` frame (`padding [12,12]`) clips when the sample is long (e.g. 40-char Title in a 320 card). Wrap the value (`Update(id,{textGrowth:"fixed-width",width:"fill_container"})`) or shorten the sample. Do not leave long sentences in unwrapped inputs.
- **MetaRow (no `flexWrap` in canvas):** horizontal chip rows have no wrap — `Update` with `flexWrap` fails schema validation (`unexpected property`). Padding/gap trims saved ~32px and still clipped. When `sum(chip widths + gaps) > TextCol width`, set the row `layout vertical` (stack). Stacked pills always fit; do not keep squeezing a horizontal row into a narrow column.
- **Titles at 32px:** `Headline 32/700` needs `≈19px` per mono char. In a `326` inner (mobile card) only ~17 chars fit on one line — anything longer must wrap or drop to the next line, never stay single-line `T`.
- **After any fix, re-stack:** wrapping/stacking grows heights. Re-read bounds, recompute `y = prev y + prev height + 48` for the whole tail, `Update` each `y`, re-read again to confirm `x=0` + strictly increasing `y` and `problems` still empty. Stale `y` overlaps are the next bug after a successful wrap.

## 9. Generator + session HOW

- **Helpers do not persist across `execute` calls** (function-valued globals are dropped; only node-id globals like `sec6` survive). Redefine `T`/`TW`/`FR` at the top of *each* `execute` input string, or generate explicit `Insert` statements. Do not assume a helper from the previous block exists.
- **One-line blocks:** each `execute` input is a single line, statements joined by `;`, no newlines, no single quotes (tool wrapper breaks). Generate strings with ASCII-safe JSON escaping (`ensure_ascii=True` → `\uXXXX` for `§/—/·/•`), double quotes only, no backticks, no `${`. Single-quoted contractions (`don't`) break the wrapper — write `do not`.
- **Compute JS widths outside the f-string:** `card_w = "480" if bp=="desktop" else ...` computed in Python, then interpolated as `{width:{card_w}}`. Writing a ternary *inside* the JS braces (`{width:"480" if ...}`) emits Python into JS and fails with `expecting '}'`. Same trap for any Python logic inside JS objects.
- **Do not memorize heights for `y`:** query `Get((n,c)=>{if(c.depth==0) Print(...)})` before each screen, insert at `max(y+height)+48`, then re-query after building. Heights drift with font metrics even on re-read. Hard-coded `y` (e.g. `5207`) overlaps on the second screen.
- **Empty frame collapses:** inserting a `frame` with no children logs `Collapsed size` / `fit_content(0)`. Add at least `H` + content in the same block, or give a fixed height.
- **Batch + verify:** build in blocks of ~15–20KB of JS (one `execute` per breakpoint group), `save()` only after the last block, then audit + bounds in fresh blocks. Rollbacks are per-block — a syntax error drops only that block; fix that block, do not regenerate the whole screen.
- **Runner:** file-based (`run_pen.py` feeding `cmds.txt` lines as stdin) beats TTY attach. Prefer `/private/var/folders/.../T/opencode` over `/tmp` per harness env. After `save()`, `ls -lh design/client-designs.pen` to confirm the write hit the right file.
- **Screenshot every edit:** whenever you change `design/client-designs.pen` (new sections, fixes, restacks), `Export` the affected top-level frames and embed the PNGs in your reply so the user can inspect. Do not finish an edit turn without at least one screenshot of the change.

## 10. Icons — Phosphor — HOW

- **Pack:** [Phosphor Icons](https://phosphoricons.com) (open source, MIT, 6 weights: Thin/Light/Regular/Bold/Fill/Duotone; drawn at `16` and scaled). Use it for every icon — no custom glyphs, no emoji, no text substitutes like `Menu`. Name icons by their exact Phosphor name in code (`List`, `MagnifyingGlass`, `Plus`, `BookmarkSimple`, `Folder`, `Tag`, `Gear`, `Export`, `DownloadSimple`, `Link`, `Share`, `Trash`, `X`, `Check`, `Copy`, `SquaresFour`). Phosphor has no `Import` glyph; use `DownloadSimple` for the Import action and caption that mapping.
- **Default weight / size:** `regular` at `20` (form fields / buttons) or `24` (nav / headers); `bold` for emphasis; `fill` only for active/selected. Color follows the text token of the slot (`--text` on light, `paper/mist` on dark, `paper` on primary fill). Hit target `36×36` with `r-8`; never below `24` visible or `36` tappable.
- **Canvas geometry:** Pen does not ship the Phosphor font, so embed the **official SVG path data** from `phosphor-icons/core/assets/<weight>/` — never approximate an icon with invented circles, rectangles, or chevrons. Keep the source `viewBox:[0,0,256,256]`, use a `path` node named `Phosphor-Regular-<Name>`, and apply the slot's color as `fill`. In a `36×36` target, render the path at `20×20`, `x=8`, `y=8`; in a `20×20` inline slot, render at `20×20`, `x=0`, `y=0`. Preserve the outer target's dimensions, fill, stroke, and theme color when replacing its glyph.
- **Gallery mapping:** keep the exact Phosphor name in the frame (`Icon-List`, `Icon-MagnifyingGlass`) and the design note. If an action has no same-named Phosphor glyph, choose an official equivalent and document it (Import → `DownloadSimple`) rather than inventing a one-off glyph.
