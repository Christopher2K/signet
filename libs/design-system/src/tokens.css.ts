import { css } from "react-strict-dom";

const darkMode = "@media (prefers-color-scheme: dark)";

/** Semantic colors from the Signet Ink & Amber palette. */
export const colors = css.defineVars({
  background: {
    default: "#FDF6EE",
    [darkMode]: "#2E2620",
  },
  surface: {
    default: "#FFFFFF",
    [darkMode]: "#241E19",
  },
  surfaceAlt: {
    default: "#FBEEE1",
    [darkMode]: "#241E19",
  },
  text: {
    default: "#2E2620",
    [darkMode]: "#FDF6EE",
  },
  textSecondary: {
    default: "#6E5F53",
    [darkMode]: "#F2C9A4",
  },
  textMuted: {
    default: "#9A8A7C",
    [darkMode]: "#A89484",
  },
  border: {
    default: "#B08350",
    [darkMode]: "#57493C",
  },
  primary: {
    default: "#C2410C",
    [darkMode]: "#F97316",
  },
  primaryHover: {
    default: "#9A3412",
    [darkMode]: "#E9A677",
  },
  primaryActive: {
    default: "#7C2D12",
    [darkMode]: "#F2C9A4",
  },
  onPrimary: {
    default: "#FDF6EE",
    [darkMode]: "#1C1510",
  },
  logoBack: {
    default: "#F2C9A4",
    [darkMode]: "#57493C",
  },
  selection: {
    default: "#F2C9A4",
    [darkMode]: "#7C2D12",
  },
  onSelection: {
    default: "#2E2620",
    [darkMode]: "#FDF6EE",
  },
  secondaryHover: {
    default: "#FBEEE1",
    [darkMode]: "#FAE3CC",
  },
  tag: {
    default: "#F2C9A4",
    [darkMode]: "#F2C9A4",
  },
  onTag: {
    default: "#2E2620",
    [darkMode]: "#2E2620",
  },
  disabled: {
    default: "#FAE3CC",
    [darkMode]: "#FAE3CC",
  },
  onDisabled: {
    default: "#2E2620",
    [darkMode]: "#2E2620",
  },
  accent: {
    default: "#7C2D12",
    [darkMode]: "#F2C9A4",
  },
  focusRing: {
    default: "#7C2D12",
    [darkMode]: "#7C2D12",
  },
  focusHalo: {
    default: "#F2C9A4",
    [darkMode]: "#F2C9A4",
  },
  success: {
    default: "#2E7D52",
    [darkMode]: "#75D6A0",
  },
  danger: {
    default: "#B42318",
    [darkMode]: "#F97066",
  },
  // Filled badges retain the light warning fill with paper text in both themes.
  warning: {
    default: "#9A6A00",
    [darkMode]: "#9A6A00",
  },
  onWarning: {
    default: "#FDF6EE",
    [darkMode]: "#FDF6EE",
  },
});

/** Four-point spacing scale. Pixel strings work in web CSS and native RSD. */
export const spacing = css.defineVars({
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  12: "48px",
});

/** Corner radius scale. */
export const radii = css.defineVars({
  sm: "4px",
  md: "8px",
  lg: "12px",
  card: "16px",
  pill: "999px",
});

/** Space Mono typography scale. Consumers must register the font on native. */
export const typography = css.defineVars({
  fontFamily: "Space Mono",
  displaySize: "48px",
  headlineSize: "32px",
  titleSize: "20px",
  bodySize: "15px",
  captionSize: "12px",
  codeSize: "13px",
});
