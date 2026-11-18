import type { ComponentPropsWithoutRef } from "react";
import { css, html } from "react-strict-dom";
import { colors, radii, spacing } from "../tokens.css";
import { Typography } from "./typography";

type StrictButtonProps = ComponentPropsWithoutRef<typeof html.button>;

/** Button visual intent. */
export type ButtonVariant = "primary" | "secondary";

/** Button density. */
export type ButtonSize = "sm" | "md" | "lg";

/** Cross-platform button properties. */
export type ButtonProps = StrictButtonProps & {
  /** Visual intent, defaulting to primary. */
  variant?: ButtonVariant;
  /** Density, defaulting to md. */
  size?: ButtonSize;
};

export const ButtonBase = ({
  children,
  disabled = false,
  size = "md",
  style,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <html.button
      {...props}
      disabled={disabled}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        style,
        disabled && styles.disabled,
      ]}
      type={type}
    >
      <Typography
        style={[
          styles.label,
          labelVariantStyles[variant],
          disabled && styles.disabledLabel,
        ]}
      >
        {children}
      </Typography>
    </html.button>
  );
};

const styles = css.create({
  base: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    "@media (pointer: fine)": {
      boxShadow: {
        default: "none",
        ":focus-visible": `0 0 0 4px ${colors.focusHalo}`,
      },
      outlineColor: colors.focusRing,
      outlineOffset: 0,
      outlineStyle: "solid",
      outlineWidth: {
        default: 0,
        ":focus-visible": 2,
      },
    },
  },
  label: {
    fontWeight: "700",
    textAlign: "center",
  },
  disabled: {
    backgroundColor: colors.disabled,
    borderColor: colors.disabled,
    pointerEvents: "none",
  },
  disabledLabel: {
    color: colors.onDisabled,
  },
});

const variantStyles = css.create({
  primary: {
    backgroundColor: {
      default: colors.primary,
      ":hover": colors.primaryHover,
      ":active": colors.primaryActive,
    },
    borderColor: {
      default: colors.primary,
      ":hover": colors.primaryHover,
      ":active": colors.primaryActive,
    },
  },
  secondary: {
    backgroundColor: {
      default: colors.tag,
      ":hover": colors.secondaryHover,
      ":active": colors.tag,
    },
    borderColor: colors.border,
  },
});

const labelVariantStyles = css.create({
  primary: {
    color: colors.onPrimary,
  },
  secondary: {
    color: colors.onTag,
  },
});

const sizeStyles = css.create({
  sm: {
    paddingBlock: spacing[2],
    paddingInline: spacing[3],
  },
  md: {
    minHeight: 44,
    paddingBlock: spacing[3],
    paddingInline: spacing[4],
  },
  lg: {
    minHeight: 48,
    paddingBlock: spacing[4],
    paddingInline: spacing[6],
  },
});
