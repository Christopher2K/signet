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

### Current inventory (as of §5 — ids are pen-generated, re-lookup with `Get`)

| Frame | id | y | w × h (re-read) | Notes |
|---|---|---|---|---|
| §0 Cover — Signet Paper & Cobalt | `mApjQ` | `0` | `1277 × ~215` | Cover is the width exception (`1277`); don't "fix" to 1200 |
| §1 Foundations — Color Scales | `G5z73D` | `260` | `1200 × ~245` | |
| §2 Variants — Light / Dark Tokens | `mtl7O` | `549` | `1200 × ~352` | |
| §3 Typography — Necto Mono | `YYynH` | `946` | `1200 × ~362` | |
| §4 Spacing & Radii — 4pt grid | `jd3QR` | `1346` | `1200 × ~229` | |
| §5 Components — Button + Bookmark Card | `H6jw09` | `1619` | `1200 × ~678` | Next section: `y = 1619 + h + 48` (≈ `2345` — recompute) |

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
- **New system component?** Only add a token/component/section if you also **update `DESIGN.md`** in the same change, documenting the new addition and its tokens. If you are just implementing an existing token, don't edit `DESIGN.md`. §5 added no token and no new component (Bookmark card + Tag chip already inventoried; Button implements existing `--primary`/`--accent`/`--selection`), so `DESIGN.md` was left untouched — that's the pattern to follow.
- When in doubt, ask before deviating. A deviating design is a bug, not a variant.

## 5. Components — Button + Bookmark Card (§5)

First component sheet: `§5 Components — Button + Bookmark Card` (`H6jw09`, y `1619`, w `1200`). Two component families, each as a section inside the one frame: `Buttons` (`Uzsf8`) and `BookmarkCard` (`ACaVo`). Both carry a `Title-20/600` heading plus a `Caption-12 ink-400` notes line citing tokens and SPEC refs. Labels in the sheet use `Body 15` (`normal`) and captions `12` (`normal`); only section heads use `18/700` and subsection heads `20/600`.

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

Conventions: all sample buttons labelled `New Bookmark` (Body 15) to isolate variant styling; token notes under each button name the fills + hex + role. Dark rule to always caption: dark primary is `azure-400 #5C84C6`, never `azure #3066BE` on ink (2.07:1). Secondary doubles as the selection token.

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
| Chips | `mist #B4C5E4` + `ink`, pill `999`, `padding:[4,12]`, `Caption 12` | same mist + ink | `--selection` survives both themes; `work, reading` example is F04 |
| Pending badge | `#9A6A00` + `paper`, pill | same | F07 / W-08 offline queue (`Pending sync`), always paired with text |

Why side-by-side in one frame: Light + Dark belong in the same §5 sheet (per section brief). Only top-level artboards are forbidden from 2-column grids — rows inside a sheet use `width:fill_container` columns, which is how `CardPair` works. New components sections follow the same rule: one top-level sheet, rows inside.

### Component marking — what is `reusable`

In Pen, `reusable: true` = component/symbol; `type:"ref"` with `ref:<id>` = instance. §5 was marked in place (no instances created — the showcase nodes themselves are the components):

```js
// batch — one Update per id, then verify:
Update("cTUQz",{reusable:true});Update("D8CdJ",{reusable:true});  // …for every id below…;
Get(n=>n.reusable && Print(n.name, n.id))
```

Inventory (16 — re-lookup with `Get`, ids are pen-generated):

- **Buttons (8 `Btn`):** `cTUQz` Primary, `D8CdJ` Secondary, `aoaIT` Accent, `DHIm0` Ghost, `qYDBk` Disabled, `P3dgHI` Hover, `LkNZO` Pressed, `F6uXZ` Focus-inner.
- **Cards (2):** `AVo6i` LightCard, `FfqnB` DarkCard.
- **Chips (4 `Chip`):** `RQEbD`, `ZEk0l` (light), `AMK69`, `O7BFSN` (dark) — each displays its own label (`work`/`reading`).
- **Badges (2 `Badge`):** `eAiUm` (light), `IVX47` (dark).

**Not reusable (intentional):** the §5 shell, `Buttons` / `BookmarkCard` sections, `VariantRow` / `StateRow` / `CardPair` rows, variant cells + `Lab`/`Tok` wrappers, `FocusOuter`/`FocusInner` wrappers, `OG` placeholders, `TextCol` / `MetaRow`. Don't mark section shells, rows, or placeholder/decoration wrappers as components — only leaf repeatable UI (`Btn` / Card / `Chip` / `Badge`) is marked. If you add instances later, instantiate with `{type:"ref", ref:<componentId>}` and override descendants via `Update(instanceId+"/childId", {...})` or `Replace(...)` for slots; never `Update` a descendant id of a `Copy` (ids are regenerated) and never `Get` an instance without `resolveInstances:true` to discover its children.

## 6. Don'ts

- No `designs/` (plural) paths — always `design/`.
- No MIME of `.pen` contents into Read/Grep/Edit shell pipelines.
- No horizontal grids, no overlapping artboards at `0,0`. One vertical column, `x=0`, 48px gutter (§3).
- No `reusable` on section shells, rows, cells, `OG` placeholders, or focus wrappers — only leaf components (§5).
- No new hex / font / spacing value without a corresponding `DESIGN.md` entry. Disabled, Pending, Focus, Ghost must reuse derived/status tokens (§4).
- No `$sp-*` / `$radius-*` variable refs until the file migrates to variables as a whole (§4).
- No `pen --prompt` AI-generation runs without explicitly flagging that they need agent auth and may not match `DESIGN.md`.
