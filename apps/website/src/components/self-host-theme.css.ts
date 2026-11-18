import { colors } from "@signet/design-system/tokens.css";
import { css } from "react-strict-dom";

/** Fixed dark surface theme for the self-hosting callout. */
export const selfHostTheme = css.createTheme(colors, {
  background: "#2E2620",
  surface: "#241E19",
  surfaceAlt: "#1C1510",
  text: "#FDF6EE",
  textSecondary: "#F2C9A4",
  border: "#57493C",
  primary: "#F97316",
  primaryHover: "#E9A677",
  primaryActive: "#F2C9A4",
  onPrimary: "#1C1510",
  selection: "#7C2D12",
  onSelection: "#FDF6EE",
  tag: "#F2C9A4",
  onTag: "#2E2620",
  accent: "#F2C9A4",
  danger: "#F97066",
  warning: "#9A6A00",
  onWarning: "#FDF6EE",
});
