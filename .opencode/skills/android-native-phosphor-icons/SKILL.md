---
name: Android Native Phosphor Icons
description: Use Phosphor artwork in Signet's Android native navigation elements, including Expo Router Stack toolbar actions and NativeTabs icons. Apply when adding, replacing, exporting, tinting, or debugging Android native toolbar or tab icons, especially when XML icons render blank in tabs.
---

# Android native Phosphor icons

Use real Phosphor artwork for Android native chrome. Do not substitute Android Material symbol names, React Native-rendered icon components, emoji, or text glyphs. Keep iOS on SF Symbols.

## Choose the asset format

Native elements do not consume the same assets:

| Element | Android asset | Reason |
| --- | --- | --- |
| `Stack.Toolbar.Button` or `Stack.Toolbar.Menu` | XML vector drawable | Toolbar actions resolve Metro XML image sources and apply native tinting. |
| `NativeTabs.Trigger.Icon` | PNG at 1×, 2×, and 3× | XML sources can resolve in the bundle but render as blank native tab glyphs. Use density-specific PNGs instead. |

Store source assets in `apps/mobile-client/assets/images`. Do not manually edit files in `node_modules/phosphor-react-native`.

## Extract Phosphor artwork

1. Find the component in `node_modules/phosphor-react-native/src/icons/<Icon>.tsx` and follow its `weights` import to `src/defs/<Icon>.tsx`.
2. Copy the path data for the intended weight. Signet's existing native icons use the `regular` weight.
3. For a toolbar vector, create a `256 × 256` viewport and a `24dp` output size. Set the path fill to opaque white so Android can use it as a tintable mask:

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="256"
    android:viewportHeight="256">
    <path
        android:fillColor="#FFFFFFFF"
        android:pathData="..." />
</vector>
```

4. For tabs, wrap the same regular-weight path in an SVG with `viewBox="0 0 256 256"` and `fill="white"`, then export transparent PNGs at 24 px, 48 px, and 72 px. Name them `<icon>.png`, `<icon>@2x.png`, and `<icon>@3x.png`. Keep all three together.

Use an isolated temporary renderer such as `@resvg/resvg-js` when no exporter is installed. Do not add a rendering dependency to Signet solely to regenerate static icons.

## Wire native elements

Select platform assets at module scope. Keep the iOS symbol as a string and Android as a bundled resource:

```tsx
const addIcon = Platform.select({
  ios: "plus" as const,
  default: require("../../../../assets/images/plus.xml"),
});
```

Pass that value to `Stack.Toolbar.Button` or `Stack.Toolbar.Menu` through `icon`, and retain the themed `tintColor`, accessibility label, and native action behavior.

For native tabs, require the base PNG and enable template rendering:

```tsx
<NativeTabs.Trigger.Icon
  renderingMode="template"
  sf="square.grid.2x2"
  src={require("../../../assets/images/squares-four.png")}
/>
```

Do not add Android-only `md` Material names or point tabs at the XML vector. Keep `NativeTabs` `iconColor`, `indicatorColor`, and `tintColor` themed; the native layer supplies selected and unselected colors.

## Verify

- Run `xmllint --noout` on changed XML files.
- Run Biome and mobile-client TypeScript checks.
- Verify on a running Android emulator, not only with static checks or Metro bundling.
- Capture toolbar and tab screenshots; confirm no glyphs are blank.
- Select and deselect the tab to verify native tinting and selected-state colors.
- Check light/dark themes and regular/foldable layouts when changing shared navigation chrome.
- Update `DESIGN.md` if the icon or native-navigation guidance changes.
