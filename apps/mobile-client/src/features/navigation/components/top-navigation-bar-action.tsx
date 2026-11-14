import {
  nativeFontFamily,
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import type { Icon } from "phosphor-react-native";
import { CaretLeftIcon } from "phosphor-react-native/src/icons/CaretLeft";
import { CaretRightIcon } from "phosphor-react-native/src/icons/CaretRight";
import { I18nManager, Pressable, StyleSheet, Text, View } from "react-native";

/** Action displayed in a top navigation bar slot. */
export type TopNavigationBarAction = {
  /** Translated accessible action name. */
  accessibilityLabel: string;
  /** Translated accessible result description. */
  accessibilityHint?: string;
  /** Prevents interaction and applies the muted icon token. */
  disabled?: boolean;
  /** Called when the action is activated. */
  onPress: () => void;
  /** Uses the tinted target reserved for the primary action. */
  prominent?: boolean;
  /** Semantic action color. */
  tone?: "primary" | "danger";
} & (
  | {
      /** Decorative Phosphor SVG icon. */
      icon: Icon;
      label?: never;
    }
  | {
      icon?: never;
      /** Visible translated text action. */
      label: string;
    }
);

/** Creates a platform-correct, RTL-aware back action. */
export const createBackNavigationAction = ({
  accessibilityLabel,
  onPress,
}: Pick<
  TopNavigationBarAction,
  "accessibilityLabel" | "onPress"
>): TopNavigationBarAction => ({
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
  const visualSize = size - 8;

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
      {({ pressed }) => (
        <View
          style={[
            styles.feedbackTarget,
            { height: visualSize, minWidth: visualSize },
            IconComponent ? { width: visualSize } : styles.textFeedbackTarget,
            action.prominent && {
              backgroundColor: pressed ? theme.logoBack : theme.surfaceAlt,
            },
            pressed &&
              !action.prominent && { backgroundColor: theme.surfaceAlt },
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
      )}
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
