---
name: pen-design-audit
description: Audit and fix Signet Pen design files for dark-mode contrast, clipping, responsive layouts, reusable-component drift, missing actions or states, and documentation inconsistency. Use for design audits, audit follow-ups, design-system cleanup, or final QA of design/client-designs.pen and other .pen files under design/.
---

# Pen Design Audit

Audit the design against its product and design-system sources, then verify every permitted fix structurally and visually. Use this for both audit-only reports and audit-and-fix requests.

## 1. Establish scope and sources

1. Load `pen-workflow` before opening or changing any `.pen` file. Follow its headless CLI, canvas, stacking, and export rules.
2. Read `AGENTS.md`, `DESIGN.md`, `design/web/web-pages-map.md`, and the relevant parts of `SPECIFICATION.md`. For a different `.pen` file, identify its corresponding design and product sources before judging it.
3. Determine the requested mode:
   - **Audit only:** inspect and report; do not modify the design.
   - **Audit and fix:** correct confirmed findings, then rerun the complete audit.
   - If the request is only “audit,” default to audit-only. A request to “follow up,” “fix,” or “get back to work” authorizes the fix pass.
4. Run `git status --short` and record pre-existing changes. Never overwrite or include unrelated user work in the fix scope.
5. Before a substantial fix pass, copy the canonical file to an approved temporary directory. Do not create backup or variant `.pen` files under `design/`.

The sources of truth outrank the current canvas. Do not treat an existing screen as proof that its colors, actions, or states are correct.

## 2. Build a fresh inventory

Use Pen queries, not memory or documentation alone, to inventory:

- Top-level artboard IDs, names, bounds, order, and section purpose.
- Breakpoints and themes present in each section.
- Reusable component IDs and names.
- Instance counts and missing refs.
- Shared validation, feedback, sync, and empty-state sheets.
- Documented intentional exceptions, such as non-essential placeholder text.

Re-lookup generated IDs after structural edits. Record counts and representative IDs in the working notes, but do not hard-code them into a reusable audit script.

## 3. Audit in six dimensions

Run the mechanical checks in [references/audit-queries.md](references/audit-queries.md), then perform the manual checks below. A screenshot is not a substitute for structural or resolved-instance inspection.

### A. Structure and layout

- Every `c.problems` finding, including `partially clipped` and `fully clipped`.
- Broken refs, collapsed frames, unintended fixed dimensions, and stale component overrides.
- Top-level artboards at `x=0`, in section order, with 48px vertical gutters and no overlap.
- Text wrapping for titles, notes, URLs, timestamps, field values, and helper text.
- Horizontal rows that exceed narrow containers, especially chips and action rows.

Audit again after every layout fix because wrapping changes ancestor heights.

### B. Color and contrast

Check **resolved instances**, not just reusable source frames. Traverse each top-level artboard with `resolveInstances:true` and compare text against its effective background.

- Body and small text: target at least 4.5:1.
- Large text: 3:1 is acceptable only at WCAG large-text sizes; when in doubt, retain 4.5:1.
- Inspect primary, secondary, ghost, destructive, selected, tag, status, sync, error, success, and placeholder treatments in both themes.
- Check component overrides: a valid source component can still produce an invalid instance.
- Group failures by foreground/background pair and include artboard, node, content, and ratio examples.

The nearest opaque ancestor fill is a useful approximation, not a complete rendering engine. Manually inspect gradients, transparency, images, absolute positioning, and sibling backgrounds. Never invent a contrast exception. Keep documented intentional exceptions in a separate result with their count and rationale.

### C. Component reuse and overrides

- Find detached duplicates of buttons, chips, badges, searches, cards, topbars, folder trees, and other repeated UI.
- Compare structure and intent, not just node names. Similar names alone do not prove duplication.
- Keep page-specific compositions as ordinary frames; do not mark section shells, rows, cells, or decorative placeholders reusable.
- Preserve canonical component IDs and instance overrides. Reparent existing nodes with `Move` when wrapping or restructuring them; avoid delete-and-recreate conversions.
- Instantiate repeated UI with `type:"ref"` and explicit descendant overrides. Audit the resolved result afterward.

### D. Product actions and states

Trace each page and dialog to the web map and specification. Check:

- Every required field, action, destructive confirmation, and recovery path.
- Validation, loading, empty, error, offline, pending, success, and sync states where applicable.
- Mobile equivalents of desktop actions.
- Public/read-only behavior and anonymous-sharing boundaries.
- Realistic long content and state-specific actions, not only happy-path labels.

Group genuinely shared validation and feedback variants in the shared-state sheet (currently §36) rather than duplicating complete variants across every screen. Page screens should still show the local placement and actions needed to understand the flow.

### E. Responsive behavior

Inspect every breakpoint and theme exported for the affected section:

- Desktop and tablet shell proportions, sidebar/main behavior, and card widths.
- Mobile navigation, single-column content, compact cards, and touch-usable actions.
- Dialog-to-bottom-sheet behavior; full-screen or content-growing editors where needed.
- Long URLs, multiline notes, tags, action rows, public headings, skeletons, banners, and toasts.
- No clipped bottom actions or content hidden behind fixed-height containers.

Do not merely shrink desktop. Check that the shell changes shape where the design rules require it.

### F. Documentation consistency

Compare the final canvas with `DESIGN.md`, the web map, and workflow guidance:

- Canonical file paths and single-file inventory statements.
- Primitive and semantic token values and their assigned roles.
- Selection versus tags, dark primary versus emphasis, and status treatments.
- Typography, spacing, responsive, and component rules.
- Artboard and reusable-component inventories.
- Contradictions between different sections of the same document.

Update documentation in the same change when tokens, components, page structure, or workflows change. Do not duplicate the web inventory table back into `DESIGN.md`.

## 4. Report findings precisely

Classify findings before fixing them:

- **Blocker:** broken core flow, missing required action, broken refs, inaccessible primary action, or privacy/data-exposure issue.
- **Major:** contrast failure, clipping, missing state, responsive breakage, or systemic detached duplication.
- **Minor:** localized inconsistency, unclear caption, stale inventory, or documentation drift.
- **Intentional:** documented exception that is explicitly excluded from failures.

For each finding, record the artboard and stable page ID, node ID where useful, expected source rule, actual behavior, evidence, and proposed correction. Separate confirmed findings from hypotheses and manual-review items. Use [references/report-template.md](references/report-template.md).

## 5. Fix in verified batches

When fixes are authorized:

1. Fix semantic tokens and canonical components before their instances.
2. Fix shared patterns and missing shared states.
3. Complete page-specific actions and content.
4. Correct responsive layouts and grow containers to fit content.
5. Update documentation and inventories.
6. Restack the complete artboard column last.

Work in small independent groups such as browse/folder screens, forms, sharing, public pages, and feedback. Test substantial batches on a temporary copy first. If one operation fails, inspect its actual structure and repair that group; do not regenerate an entire screen or repeat already successful mutations blindly.

Prefer the smallest change that satisfies the source rules. Preserve the established palette, typography, canonical file structure, component IDs, and instance overrides unless the sources require a change.

## 6. Final gate

Do not declare completion until all applicable checks pass on the **canonical saved file**:

- Zero clipping/layout problems.
- Zero missing refs.
- Zero artboard stacking errors.
- No unapproved contrast failures; documented exceptions listed separately.
- No unintended detached duplicates in the audited component families.
- Required actions and states traced to the product sources.
- Documentation matches the canvas.
- Affected frames exported after the final edits and visually inspected.
- `save()` completed and the canonical file's on-disk size/timestamp was verified.
- Text diffs pass `git diff --check`; final `git status --short` is reported.

Include audit counts, remaining exceptions, modified files, and representative export links in the response. Do not commit or mutate git history unless explicitly asked.
