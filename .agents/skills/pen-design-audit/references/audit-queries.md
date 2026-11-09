# Pen audit queries

Run these through the pinned headless Pen CLI described by `pen-workflow`. Never Read, Grep, or Edit an encrypted `.pen` file.

The snippets below are JavaScript bodies for `execute({input: ...})`. Collapse them to one line with semicolons, JSON-escape the input, and use the runner pattern from `pen-workflow`. Re-lookup IDs instead of copying IDs from an earlier audit.

## 1. Structure, refs, components, and stacking

```js
var problems = 0;
var refs = 0;
var missing = [];
var components = 0;
var tops = [];
Get((n, c) => {
  if (c.problems) {
    problems++;
    Print("PROBLEM", n.id, n.name, JSON.stringify(c.problems));
  }
  if (c.depth === 0) {
    tops.push({
      id: n.id,
      name: n.name,
      x: c.bounds.x,
      y: c.bounds.y,
      h: c.bounds.height,
      w: c.bounds.width
    });
  }
  if (n.reusable) components++;
  if (n.type === "ref") {
    refs++;
    try { Get(n.ref); } catch (e) { missing.push(n.id + ":" + n.ref); }
  }
});
Print("STRUCTURE", JSON.stringify({
  problems: problems,
  refs: refs,
  missing: missing,
  components: components,
  artboards: tops.length
}));
var stack = 0;
var next = 0;
tops.forEach(t => {
  if (t.x !== 0 || Math.abs(t.y - next) > 1) stack++;
  next = t.y + t.h + 48;
});
tops.forEach(t => Print("TOP", JSON.stringify(t)));
Print("STACK_ISSUES", stack);
```

Review every `PROBLEM`; do not treat a zero missing-ref count as evidence that clipping or composition is correct.

## 2. Component inventory and detached-copy candidates

```js
var reusable = [];
var refCounts = {};
var candidates = [];
Get((n, c) => {
  if (n.reusable) reusable.push({ id: n.id, name: n.name, type: n.type });
  if (n.type === "ref") refCounts[n.ref] = (refCounts[n.ref] || 0) + 1;
  if (
    n.type === "frame" &&
    !n.reusable &&
    /^(Btn|Button|Chip|Badge|Card|Search|SearchInput|Topbar|FolderTree)([-_ ].*)?$/i.test(n.name || "")
  ) {
    candidates.push({ id: n.id, name: n.name, parent: c.parent && c.parent.id });
  }
});
reusable.sort((a, b) => a.name.localeCompare(b.name));
reusable.forEach(n => Print("COMPONENT", JSON.stringify(n), "INSTANCES", refCounts[n.id] || 0));
candidates.forEach(n => Print("REVIEW_CANDIDATE", JSON.stringify(n)));
Print("TOTALS", reusable.length, Object.keys(refCounts).length);
```

`REVIEW_CANDIDATE` is a heuristic. Inspect the node and its context before converting it. Legitimate page-specific frames and reusable source-adjacent showcase wrappers may match the expression.

To inspect an instance with its source and overrides resolved:

```js
Print(JSON.stringify(Get("<instance-id>", { resolveInstances: true })));
```

## 3. Resolved-instance text contrast

This conservative check applies 4.5:1 to all recognized text. It inherits the nearest six-digit opaque ancestor fill. Its results require manual review for images, gradients, alpha, absolute positioning, sibling backgrounds, and large text.

```js
function lum(h) {
  var c = [1, 3, 5]
    .map(i => parseInt(h.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) {
  var x = lum(a);
  var y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
var tops = [];
Get((n, c) => { if (c.depth === 0) tops.push(n.id); });
var bad = {};
var total = 0;
function walk(n, bg, top) {
  var next = bg;
  if (
    n.type !== "text" &&
    typeof n.fill === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(n.fill)
  ) next = n.fill;
  if (
    n.type === "text" &&
    typeof n.fill === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(n.fill) &&
    /^#[0-9A-Fa-f]{6}$/.test(next)
  ) {
    total++;
    var r = ratio(n.fill, next);
    if (r < 4.5) {
      var key = n.fill + " on " + next;
      if (!bad[key]) bad[key] = { count: 0, ratio: r, examples: [] };
      bad[key].count++;
      if (bad[key].examples.length < 6) {
        bad[key].examples.push({
          artboard: top,
          id: n.id,
          content: (n.content || "").slice(0, 90),
          fontSize: n.fontSize,
          fontWeight: n.fontWeight
        });
      }
    }
  }
  (n.children || []).forEach(ch => walk(ch, next, top));
}
tops.forEach(id => {
  var n = Get(id, { resolveInstances: true });
  var bg = typeof n.fill === "string" && /^#[0-9A-Fa-f]{6}$/.test(n.fill) ? n.fill : "#FFFFFF";
  walk(n, bg, n.name);
});
Object.keys(bad)
  .sort((a, b) => bad[a].ratio - bad[b].ratio)
  .forEach(k => Print(
    "CONTRAST",
    k,
    bad[k].count,
    bad[k].ratio.toFixed(2),
    JSON.stringify(bad[k].examples)
  ));
Print("TEXT_CHECKED", total);
```

For every reported pair:

1. Confirm the computed background matches the rendered background.
2. Check whether the text is genuinely large enough for a 3:1 large-text evaluation; otherwise retain 4.5:1.
3. Check `DESIGN.md` for an explicit intentional exception. Do not infer one from current usage.
4. Report confirmed failures and documented exceptions separately.

A clean source-component audit is insufficient: this query deliberately walks every resolved instance so descendant overrides and per-screen surfaces are included.

## 4. Focused section regression

Use this after each fix group and again on the canonical file:

```js
var ids = ["<artboard-id-1>", "<artboard-id-2>"];
ids.forEach(id => {
  var count = 0;
  Get(id, (n, c) => {
    if (c.problems) {
      count++;
      Print("SECTION_PROBLEM", id, n.id, n.name, JSON.stringify(c.problems));
    }
  });
  Print("SECTION_COUNT", id, count);
});
```

## 5. Export affected artboards

Run only after the structural audit is clean. The PNG output path is a directory; each artboard exports as `<nodeId>.png`.

```js
Export(
  ["<artboard-id-1>", "<artboard-id-2>"],
  "png",
  "/absolute/approved/temp/audit-exports"
);
```

Read the resulting images. Check both themes and every affected breakpoint, with particular attention to content that mechanical checks cannot judge: hierarchy, misleading glyphs, awkward wrapping, clipped-looking sheets, unrealistic spacing, and missing visual feedback.

## 6. Restack after content growth

Only run this during an authorized fix pass. Re-read bounds in the same operation, then save and rerun the structure query.

```js
var tops = [];
Get((n, c) => {
  if (c.depth === 0) tops.push({ id: n.id, h: c.bounds.height });
});
var y = 0;
tops.forEach(t => {
  Update(t.id, { x: 0, y: y });
  y += t.h + 48;
});
Print("RESTACKED", tops.length);
```
