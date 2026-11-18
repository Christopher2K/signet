import {
  type MenuAction,
  MenuView,
  type NativeActionEvent,
} from "@expo/ui/community/menu";
import {
  nativeFontFamily,
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import type { Icon } from "phosphor-react-native";
import { CaretLeftIcon } from "phosphor-react-native/src/icons/CaretLeft";
import { CaretRightIcon } from "phosphor-react-native/src/icons/CaretRight";
import { I18nManager, Pressable, StyleSheet, Text, View } from "react-native";

/** Native menu presented from a top navigation bar icon action. */
export type TopNavigationBarMenuAction = {
  /** Native menu items, with their translated titles and selection states. */
  actions: MenuAction[];
  /** Called with the selected item's stable identifier. */
  onPressAction: (event: NativeActionEvent) => void;
  /** Translated iOS menu heading. */
  title?: string;
};

type TopNavigationBarActionChrome = {
  /** Translated accessible action name. */
  accessibilityLabel: string;
  /** Translated accessible result description. */
  accessibilityHint?: string;
  /** Semantic action color. */
  tone?: "primary" | "danger";
};

/** Action displayed in a top navigation bar slot. */
export type TopNavigationBarAction = TopNavigationBarActionChrome &
  (
    | {
        /** Prevents interaction and applies the muted icon token. */
        disabled?: boolean;
        /** Decorative Phosphor SVG icon. */
        icon: Icon;
        label?: never;
        menu?: never;
        /** Called when the action is activated. */
        onPress: () => void;
        /** Uses the tinted target reserved for the primary action. */
        prominent?: boolean;
      }
    | {
        disabled?: boolean;
        icon?: never;
        /** Visible translated text action. */
        label: string;
        menu?: never;
        /** Called when the action is activated. */
        onPress: () => void;
        /** Uses the tinted target reserved for the primary action. */
        prominent?: boolean;
      }
    | {
        disabled?: never;
        /** Decorative Phosphor SVG icon. */
        icon: Icon;
        label?: never;
        /** Native menu opened by the action. */
        menu: TopNavigationBarMenuAction;
        onPress?: never;
        prominent?: never;
      }
  );

/** Creates a platform-correct, RTL-aware back action. */
export const createBackNavigationAction = ({
  accessibilityLabel,
  onPress,
}: {
  accessibilityLabel: string;
  onPress: () => void;
}): TopNavigationBarAction => ({
  accessibilityLabel,
  icon: I18nManager.isRTL ? CaretRightIcon : CaretLeftIcon,
  onPress,
});

/** Top navigation bar action button properties. */
type TopNavigationBarActionButtonProps = {
  action: TopNavigationBarAction;
  size: number;
};

export const TopNavigationBarActionButton = ({
  action,
  size,
}: TopNavigationBarActionButtonProps) => {
  const theme = useNativeTheme();
  const color = action.disabled
    ? theme.textMuted
    : action.tone === "danger"
      ? theme.danger
      : theme.primary;
  const IconComponent = action.icon;
  const prominent = action.menu ? false : action.prominent;
  const visualSize = size - 8;

  const renderVisual = (pressed: boolean) => (
    <View
      style={[
        styles.feedbackTarget,
        { height: visualSize, minWidth: visualSize },
        IconComponent ? { width: visualSize } : styles.textFeedbackTarget,
        prominent && {
          backgroundColor: pressed ? theme.logoBack : theme.surfaceAlt,
        },
        pressed && !prominent && { backgroundColor: theme.surfaceAlt },
      ]}
    >
      {IconComponent ? (
        <View
          accessibilityElementsHidden
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
        >
          <IconComponent color={color} size={24} weight="regular" />
        </View>
      ) : (
        <Text
          numberOfLines={1}
          style={[styles.label, { color, fontFamily: nativeFontFamily }]}
        >
          {action.label}
        </Text>
      )}
    </View>
  );

  if (action.menu) {
    return (
      <MenuView
        actions={action.menu.actions}
        colorOverrides={{
          error: theme.danger,
          onPrimary: theme.onPrimary,
          onSurface: theme.text,
          onSurfaceVariant: theme.textSecondary,
          onTertiaryContainer: theme.onSelection,
          primary: theme.primary,
          surface: theme.surface,
          surfaceContainerLow: theme.surface,
          tertiaryContainer: theme.selection,
        }}
        colorScheme={theme.dark ? "dark" : "light"}
        onPressAction={action.menu.onPressAction}
        seedColor={theme.primary}
        style={{ height: size, width: size }}
        title={action.menu.title}
      >
        <View
          accessibilityHint={action.accessibilityHint}
          accessibilityLabel={action.accessibilityLabel}
          accessibilityRole="button"
          style={[styles.target, { height: size, width: size }]}
        >
          {renderVisual(false)}
        </View>
      </MenuView>
    );
  }

  return (
    <Pressable
      accessibilityHint={action.accessibilityHint}
      accessibilityLabel={action.accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: action.disabled ?? false }}
      disabled={action.disabled}
      onPress={action.onPress}
      style={[
        styles.target,
        { height: size, minWidth: size },
        IconComponent ? { width: size } : null,
      ]}
    >
      {({ pressed }) => renderVisual(pressed)}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  target: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
  feedbackTarget: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
  textFeedbackTarget: {
    paddingHorizontal: nativeSpacing[2],
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
  },
});
