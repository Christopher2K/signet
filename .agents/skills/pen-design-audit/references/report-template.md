# Pen design audit report template

Use this structure for audit-only reports and final fix summaries. Omit empty sections rather than padding the report.

## Scope

- **Mode:** Audit only / audit and fix
- **Canonical file:** `<path>`
- **Sources checked:** `DESIGN.md`, `design/web/web-pages-map.md`, relevant `SPECIFICATION.md` sections
- **Sections and breakpoints:** `<range or explicit list>`
- **Pre-existing working-tree changes:** `<short list>`

## Baseline inventory

| Metric | Count / result |
|---|---|
| Top-level artboards | |
| Reusable components | |
| Component refs | |
| Missing refs | |
| Layout problems | |
| Stacking errors | |
| Resolved text combinations checked | |

## Confirmed findings

### [Severity] [Stable page/component ID] — Short title

- **Location:** `<artboard name, node ID if useful>`
- **Expected:** `<rule or product requirement, with source>`
- **Actual:** `<observed behavior>`
- **Evidence:** `<ratio, clipping result, missing action, resolved-instance detail, or export>`
- **Correction:** `<smallest source-aligned fix>`
- **Status:** Open / fixed / deferred with reason

Repeat for each finding. Group systemic instances of one root cause instead of producing an unreadable list of identical failures.

## Manual review and hypotheses

List checks that cannot be established mechanically, such as transparent backgrounds, ambiguous component duplication, unclear product intent, or proposed token additions. Do not present these as confirmed defects.

## Intentional exceptions

| Text / component | Surface | Ratio or behavior | Documented rationale | Count |
|---|---|---|---|---|
| | | | | |

An exception must point to an explicit design rule. If no rule exists, keep the item in confirmed findings or propose a documentation change rather than silently exempting it.

## Fix verification

- **Layout problems:** `<count>`
- **Missing refs:** `<count>`
- **Stacking errors:** `<count>`
- **Unexpected contrast failures:** `<count>`
- **Documented contrast exceptions:** `<count and identity>`
- **Component inventory:** `<count; notable conversions>`
- **Product coverage:** `<required actions/states checked>`
- **Responsive visual QA:** `<frames and breakpoints inspected>`
- **Documentation:** `<files synchronized>`
- **Canonical save:** `<saved path and verification>`
- **Text diff check:** `<result>`

## Modified files

- `<path>` — `<purpose>`

List unrelated pre-existing changes separately and state that they were left untouched. Do not claim a commit unless one was explicitly requested and created.

## Representative exports

Embed or link the final canonical exports for the most important affected sections. Include dark/light and responsive examples where relevant. Links supplement inspection; they do not replace reading the images during the audit.
