import { Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import type { ComponentPropsWithoutRef } from "react";
import { css, html } from "react-strict-dom";

/** Link visual intent. */
type ActionLinkVariant = "primary" | "outline" | "accent";

/** Link density. */
type ActionLinkSize = "sm" | "lg";

/** Action link properties. */
type ActionLinkProps = ComponentPropsWithoutRef<typeof html.a> & {
  /** Visual intent, defaulting to primary. */
  variant?: ActionLinkVariant;
  /** Density, defaulting to large. */
  size?: ActionLinkSize;
  /** Stretches the action within the small-screen layout. */
  fullWidthOnMobile?: boolean;
};

/** Strict DOM anchor styled with the shared action tokens. */
export const ActionLink = ({
  children,
  fullWidthOnMobile = false,
  size = "lg",
  style,
  variant = "primary",
  ...props
}: ActionLinkProps) => {
  return (
    <html.a
      {...props}
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        fullWidthOnMobile ? styles.fullWidthOnMobile : null,
        style,
      ]}
    >
      <Typography
        variant={size === "sm" ? "caption" : "body"}
        style={[styles.label, labelVariantStyles[variant]]}
      >
        {children}
      </Typography>
    </html.a>
  );
};

const styles = css.create({
  base: {
    display: "flex",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.md,
    lineHeight: 1.4,
    textDecorationLine: "none",
    transitionProperty: "background-color, border-color, color",
    transitionDuration: "160ms",
    transitionTimingFunction: "ease",
    "@media (prefers-reduced-motion: reduce)": {
      transitionDuration: "0ms",
    },
  },
  label: {
    fontWeight: "700",
    textAlign: "center",
  },
  fullWidthOnMobile: {
    width: "auto",
    "@media (max-width: 480px)": {
      width: "100%",
    },
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
  outline: {
    color: colors.accent,
    backgroundColor: {
      default: "transparent",
      ":hover": colors.surfaceAlt,
    },
    borderColor: {
      default: colors.border,
      ":hover": colors.primary,
    },
  },
  accent: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});

const labelVariantStyles = css.create({
  primary: {
    color: colors.onPrimary,
  },
  outline: {
    color: colors.accent,
  },
  accent: {
    color: colors.background,
  },
});

const sizeStyles = css.create({
  sm: {
    minHeight: 40,
    paddingBlock: spacing[2],
    paddingInline: spacing[4],
  },
  lg: {
    paddingBlock: spacing[3],
    paddingInline: spacing[6],
  },
});
