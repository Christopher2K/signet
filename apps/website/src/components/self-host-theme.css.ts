import { colors } from "@signet/design-system/tokens.css";
import { css } from "react-strict-dom";

/** Fixed dark surface theme for the self-hosting callout. */
export const selfHostTheme = css.createTheme(colors, {
  background: "#3C3744",
  surface: "#2F2B3A",
  surfaceAlt: "#211E2B",
  text: "#FBFFF1",
  textSecondary: "#B4C5E4",
  border: "#4F4A62",
  primary: "#5C84C6",
  primaryHover: "#B4C5E4",
  primaryActive: "#B4C5E4",
  onPrimary: "#131220",
  selection: "#B4C5E4",
  onSelection: "#3C3744",
  tag: "#B4C5E4",
  onTag: "#3C3744",
  accent: "#B4C5E4",
  danger: "#FFB4AB",
  warning: "#9A6A00",
  onWarning: "#FBFFF1",
});
