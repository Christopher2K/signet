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
- After any `execute()`, call `save()` then `exit()`. Verify the file exists on disk (`ls -lh design/client-designs.pen`) — if it doesn't, the write went to the wrong doc.
- `execute()` takes **no `uri` arg** in headless mode. Inside `execute`, use `document`, `Insert(document, ...)`, `Update(id, ...)`, `Delete(id)`, `Get(n => ...)`, `SetVariables(...)`, `Print(...)`.
- Batch related inserts into one `execute()` call. Never set `id` manually — pen.dev generates it.
- Keep `fontFamily` to an **installed** monospace for canvas rendering (`IBM Plex Mono`). Production token stays `Necto Mono` — Necto Mono is not shipped with the canvas (see DESIGN.md §3.2).

Verify layout without screenshots:

```js
Print(Get((n,c)=>{ if(c.depth===0) Print(n.name, c.bounds.x, c.bounds.y, c.bounds.width, c.bounds.height); }))
```

Export QA images only when a section is complete:

```js
Export(["<frame-id>"], "png", "/tmp/<name>.png")
```

## 3. Artboards: vertically stacked

All top-level artboard frames live in **one vertical column**, top-to-bottom in section order (§0 → §1 → §2 …), same width, no overlaps.

- `x = 0` for every frame. Width `1200` unless a section needs otherwise.
- `y` = previous frame's `y + height + 48` (48px gutter). Recompute after inserts and `Update()` the `y` positions to fix stragglers.
- Do not use 2-column grids, horizontal rows, or free placement that forces scrolling to find a frame.
- If a new section is added, append it below the last frame; do not insert it mid-column without re-stacking the tail.
- After re-stacking, re-read bounds to confirm no overlap (all `x=0`, strictly increasing `y`).

## 4. Always refer to `DESIGN.md` — never deviate silently

Before any design op, read `DESIGN.md` **and** `design/web/web-pages-map.md`.

- **Colors:** use only `DESIGN.md` §3.1 primitives and derived scales (`ink #3C3744`, `cobalt #090C9B`, `azure #3066BE`, `mist #B4C5E4`, `paper #FBFFF1`) and the semantic tokens in that section. **Never invent a hex.** If a needed token doesn't exist, flag it as a *proposed addition* in the frame and in `DESIGN.md` — do not silently introduce it.
- **Type:** `Necto Mono` (Collettivo, SIL OFL, Marco Condello) for everything (DESIGN.md §3.2). Sizes/weights only from the type scale in that section (Display 48/700, Headline 32/700, Title 20/600, Body 15/400, Caption 12/400, Code 13/400). Canvas may render in IBM Plex Mono as a stand-in, but the token stays Necto Mono.
- **Spacing / radii:** 4pt grid only (`sp-*` = 4, 8, 12, 16, 24, 32, 48; radii 4/8/12/16 + pill — DESIGN.md §3.3). Bind to variables (`$sp-*`, `$radius-*`), don't hard-code.
- **Components / sections:** name frames with stable IDs from the web map (`A1`, `L1`, `B1`…) and keep them discoverable as top-level frames. Mirror the map's zones, actions, and states — don't add chrome the spec doesn't ask for.
- **New system component?** Only add a token/component/section if you also **update `DESIGN.md`** in the same change, documenting the new addition and its tokens. If you are just implementing an existing token, don't edit `DESIGN.md`.
- When in doubt, ask before deviating. A deviating design is a bug, not a variant.

## 5. Don'ts

- No `designs/` (plural) paths — always `design/`.
- No MIME of `.pen` contents into Read/Grep/Edit shell pipelines.
- No horizontal grids, no overlapping artboards at `0,0`.
- No new hex / font / spacing value without a corresponding `DESIGN.md` entry.
- No `pen --prompt` AI-generation runs without explicitly flagging that they need agent auth and may not match `DESIGN.md`.
