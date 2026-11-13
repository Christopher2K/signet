import { Typography } from "@signet/design-system";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { html } from "react-strict-dom";
import { landingStyles } from "#/components/landing-styles.css";

type StrictParagraphProps = ComponentPropsWithoutRef<typeof html.p>;

/** Eyebrow properties. */
type EyebrowProps = StrictParagraphProps & {
  children: ReactNode;
};

/** Editorial section label with the Signet rule mark. */
export const Eyebrow = ({ children, style, ...props }: EyebrowProps) => {
  return (
    <Typography
      {...props}
      as="p"
      variant="caption"
      style={[landingStyles.eyebrow, style]}
    >
      <html.span aria-hidden={true} style={landingStyles.eyebrowRule} />
      {children}
    </Typography>
  );
};
