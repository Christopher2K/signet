import {
  type MenuAction,
  MenuView,
  type NativeActionEvent,
} from "@expo/ui/community/menu";
import { colors, Typography } from "@signet/design-system";
import {
  type NativeTheme,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import type { Icon } from "phosphor-react-native";
import { CaretLeftIcon } from "phosphor-react-native/src/icons/CaretLeft";
import { CaretRightIcon } from "phosphor-react-native/src/icons/CaretRight";
import { type ReactNode, useEffect } from "react";
import { I18nManager, Pressable, StyleSheet } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { css, html } from "react-strict-dom";

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

type ActionTone = "primary" | "danger" | "disabled";

const resolveActionTone = (action: TopNavigationBarAction): ActionTone => {
  if (action.disabled) {
    return "disabled";
  }

  if (action.tone === "danger") {
    return "danger";
  }

  return "primary";
};

const resolveActionColor = (tone: ActionTone, theme: NativeTheme) => {
  if (tone === "disabled") {
    return theme.textMuted;
  }

  if (tone === "danger") {
    return theme.danger;
  }

  return theme.primary;
};

const feedbackTiming = {
  duration: 150,
  easing: Easing.out(Easing.cubic),
};

type TopNavigationBarFeedbackProps = {
  children: ReactNode;
  pressed: boolean;
  prominent: boolean;
  size: number;
};

const TopNavigationBarFeedback = ({
  children,
  pressed,
  prominent,
  size,
}: TopNavigationBarFeedbackProps) => {
  const theme = useNativeTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const restColor = prominent ? theme.surfaceAlt : theme.surface;
  const pressedColor = prominent ? theme.logoBack : theme.surfaceAlt;

  useEffect(() => {
    const target = pressed ? 1 : 0;
    progress.value = reduceMotion ? target : withTiming(target, feedbackTiming);
  }, [pressed, progress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [restColor, pressedColor],
      ),
    }),
    [pressedColor, restColor],
  );

  return (
    <Animated.View
      style={[
        nativeStyles.feedback,
        { height: size - 8, minWidth: size - 8 },
        animatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

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
  const tone = resolveActionTone(action);
  const color = resolveActionColor(tone, theme);
  const IconComponent = action.icon;
  const prominent = action.menu ? false : action.prominent;

  const renderVisual = (pressed: boolean) => (
    <TopNavigationBarFeedback
      pressed={pressed}
      prominent={prominent ?? false}
      size={size}
    >
      {IconComponent ? (
        <html.div aria-hidden>
          <IconComponent color={color} size={24} weight="regular" />
        </html.div>
      ) : (
        <Typography style={labelToneStyles[tone]}>{action.label}</Typography>
      )}
    </TopNavigationBarFeedback>
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
          onTertiaryContainer: theme.text,
          primary: theme.primary,
          surface: theme.surface,
          surfaceContainerLow: theme.surface,
          tertiaryContainer: theme.selection,
        }}
        colorScheme={theme.dark ? "dark" : "light"}
        onPressAction={action.menu.onPressAction}
        seedColor={theme.primary}
        style={[{ height: size, width: size }, nativeStyles.target]}
        title={action.menu.title}
      >
        {(pressed) => (
          <html.div
            aria-label={action.accessibilityLabel}
            role="button"
            style={targetStyles.target(size)}
          >
            {renderVisual(pressed)}
          </html.div>
        )}
      </MenuView>
    );
  }

  return (
    <Pressable
      accessibilityLabel={action.accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: action.disabled ?? false }}
      disabled={action.disabled}
      onPress={action.onPress}
      style={[
        nativeStyles.target,
        { height: size, minWidth: size },
        IconComponent ? { width: size } : null,
      ]}
    >
      {({ pressed }) => renderVisual(pressed)}
    </Pressable>
  );
};

const nativeStyles = StyleSheet.create({
  target: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
  feedback: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
});

const targetStyles = css.create({
  target: (size) => ({
    display: "flex",
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    height: size,
    width: size,
  }),
});

const labelToneStyles = css.create({
  primary: {
    color: colors.primary,
  },
  danger: {
    color: colors.danger,
  },
  disabled: {
    color: colors.textMuted,
  },
});
