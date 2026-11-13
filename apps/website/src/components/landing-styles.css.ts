import { colors, spacing, typography } from "@signet/design-system/tokens.css";
import { css } from "react-strict-dom";

/** Shared layout and editorial styles for the marketing landing page. */
export const landingStyles = css.create({
  pageShell: {
    width: "min(1280px, calc(100% - 64px))",
    marginInline: "auto",
    "@media (max-width: 760px)": {
      width: "calc(100% - 32px)",
    },
  },
  sectionSpace: {
    paddingBlock: 80,
    "@media (max-width: 760px)": {
      paddingBlock: 56,
    },
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[3],
    "@media (max-width: 480px)": {
      width: "100%",
      flexDirection: "column",
    },
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: spacing[3],
    color: colors.accent,
    fontSize: typography.captionSize,
    fontWeight: "700",
    lineHeight: 1.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  eyebrowRule: {
    width: 32,
    height: 2,
    flexShrink: 0,
    backgroundColor: "currentColor",
  },
});
