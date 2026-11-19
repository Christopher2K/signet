import {
  type MenuAction,
  MenuView,
  type NativeActionEvent,
} from "@expo/ui/community/menu";
import { colors, radii, Typography } from "@signet/design-system";
import {
  type NativeTheme,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import type { Icon } from "phosphor-react-native";
import { CaretLeftIcon } from "phosphor-react-native/src/icons/CaretLeft";
import { CaretRightIcon } from "phosphor-react-native/src/icons/CaretRight";
import type { ReactNode } from "react";
import { I18nManager, StyleSheet } from "react-native";
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
  return (
    <html.div
      style={[
        feedbackStyles.base,
        prominent ? feedbackStyles.prominent : feedbackStyles.standard,
        pressed
          ? prominent
            ? feedbackStyles.prominentPressed
            : feedbackStyles.pressed
          : null,
        feedbackStyles.size(size),
      ]}
    >
      {children}
    </html.div>
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

  const content = (
    <>
      {IconComponent ? (
        <html.div aria-hidden style={styles.icon}>
          <IconComponent color={color} size={24} weight="regular" />
        </html.div>
      ) : (
        <Typography style={labelToneStyles[tone]}>{action.label}</Typography>
      )}
    </>
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
            style={[styles.target, styles.menuButtonSize(size)]}
          >
            <TopNavigationBarFeedback
              pressed={pressed}
              prominent={prominent ?? false}
              size={size}
            >
              {content}
            </TopNavigationBarFeedback>
          </html.div>
        )}
      </MenuView>
    );
  }

  return (
    <html.button
      aria-label={action.accessibilityLabel}
      disabled={action.disabled}
      onClick={action.onPress}
      style={[
        styles.target,
        styles.action,
        prominent && styles.prominent,
        action.disabled && styles.disabled,
        IconComponent ? styles.iconButtonSize(size) : styles.buttonSize(size),
      ]}
      type="button"
    >
      {content}
    </html.button>
  );
};

const nativeStyles = StyleSheet.create({
  target: {
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
});

const styles = css.create({
  target: {
    alignItems: "center",
    borderRadius: radii.md,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
  },
  action: {
    backgroundColor: {
      default: colors.surface,
      ":active": colors.surfaceAlt,
    },
    borderStyle: "none",
    cursor: "pointer",
    padding: 0,
  },
  prominent: {
    backgroundColor: {
      default: colors.surfaceAlt,
      ":active": colors.logoBack,
    },
  },
  disabled: {
    backgroundColor: colors.surface,
    cursor: "default",
    opacity: 0.45,
  },
  icon: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  buttonSize: (size) => ({
    height: size,
    minWidth: size,
  }),
  iconButtonSize: (size) => ({
    height: size,
    minWidth: size,
    width: size,
  }),
  menuButtonSize: (size) => ({
    height: size,
    width: size,
  }),
});

const feedbackStyles = css.create({
  base: {
    alignItems: "center",
    borderRadius: radii.md,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
  },
  standard: {
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.surfaceAlt,
  },
  prominent: {
    backgroundColor: colors.surfaceAlt,
  },
  prominentPressed: {
    backgroundColor: colors.logoBack,
  },
  size: (size) => ({
    height: size - 8,
    minWidth: size - 8,
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
