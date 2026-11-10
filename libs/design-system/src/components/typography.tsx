import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { css, html } from "react-strict-dom";
import { colors, typography } from "../tokens.css";

/** React Strict DOM element used to render the text. */
export type TypographyTag = keyof typeof html;

/** Type ramp defined by the Signet design specification. */
export type TypographyVariant =
  | "display"
  | "headline"
  | "title"
  | "body"
  | "caption"
  | "code";

/** Semantic text color. */
export type TypographyTone = "default" | "secondary" | "accent" | "danger";

/** Polymorphic cross-platform typography properties. */
export type TypographyProps<Tag extends TypographyTag = "span"> =
  ComponentPropsWithoutRef<(typeof html)[Tag]> & {
    /** Element rendered for the text, defaulting to span. */
    as?: Tag;
    /** Type ramp variant, defaulting to body. */
    variant?: TypographyVariant;
    /** Semantic text color, defaulting to the primary text color. */
    tone?: TypographyTone;
  };

type StrictSpanProps = ComponentPropsWithoutRef<typeof html.span>;

export const Typography = <Tag extends TypographyTag = "span">({
  as,
  style,
  tone = "default",
  variant = "body",
  ...props
}: TypographyProps<Tag>): ReactNode => {
  const Element = html[as ?? "span"] as unknown as (
    props: StrictSpanProps,
  ) => ReactNode;

  return (
    <Element
      {...(props as StrictSpanProps)}
      style={[styles.base, variantStyles[variant], toneStyles[tone], style]}
    />
  );
};

const styles = css.create({
  base: {
    fontFamily: typography.fontFamily,
    margin: 0,
  },
});

const variantStyles = css.create({
  display: {
    fontSize: typography.displaySize,
    fontWeight: "700",
  },
  headline: {
    fontSize: typography.headlineSize,
    fontWeight: "700",
  },
  title: {
    fontSize: typography.titleSize,
    fontWeight: "600",
  },
  body: {
    fontSize: typography.bodySize,
    fontWeight: "400",
  },
  caption: {
    fontSize: typography.captionSize,
    fontWeight: "400",
  },
  code: {
    fontSize: typography.codeSize,
    fontWeight: "400",
  },
});

const toneStyles = css.create({
  default: {
    color: colors.text,
  },
  secondary: {
    color: colors.textSecondary,
  },
  accent: {
    color: colors.accent,
  },
  danger: {
    color: colors.danger,
  },
});
