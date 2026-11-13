---
name: expo-router-native-ui
description: Implement and review native navigation chrome in Signet's Expo mobile app with Expo Router. Use when adding or changing Stack headers, toolbars, navigation-bar buttons, modal dismissal actions, native header icons, shared toolbar components, or auditing custom React Native replacements for native navigation chrome.
---

# Expo Router Native UI

Build navigation chrome with Expo Router's native APIs so platform behavior, accessibility, and appearance remain native. This guidance applies to headers, navigation bars, and toolbars; ordinary screen content and form controls continue to use the design system.

## Use Native Navigation APIs

- Use `Stack.Screen` for screen and header options.
- Use `Stack.Toolbar` and `Stack.Toolbar.Button` for navigation-bar actions rather than recreating them with React Native `View`, `Pressable`, or absolute positioning.
- Preserve native touch targets, pressed states, accessibility behavior, reduce-transparency handling, and platform navigation semantics.
- Extract a shared toolbar component when multiple screens need identical behavior. Keep navigation and translated content in that shared component instead of copying platform setup into each screen.
- Use `apps/mobile-client/src/features/library/components/bookmark-cancel-toolbar.tsx` as the current reference for shared native dismissal.

## Keep Platform Differences in the Inputs

- Check the installed Expo Router types and native implementation before using unfamiliar toolbar props.
- Use native text or SF Symbols on iOS as appropriate. On Android, supply a supported image or vector icon; Expo Router renders these buttons with native Compose through `@expo/ui`.
- Share placement, action, accessibility label, and semantic color while using `Platform.select` only for genuinely platform-specific inputs such as the icon source.
- Resolve colors from `useNativeTheme`; do not hardcode light or dark values in the toolbar component.
- Use native styling props such as `tintColor` and `hidesSharedBackground` when required by the design instead of drawing a custom background around the button.
- Translate visible text and accessibility labels in English and French. Load `client-internationalization` when adding or changing messages.

## Verify the Native Result

1. Run Biome and the mobile client's TypeScript check.
2. Exercise the action on iOS and Android, including its dismissal or navigation result and accessibility label.
3. Inspect rendering in light and dark modes when semantic colors change.
4. Export both native platforms when changing platform-specific assets or toolbar APIs.
5. Update `DESIGN.md` and the corresponding `design/client-designs.pen` screens when native navigation designs change.
