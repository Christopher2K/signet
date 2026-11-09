import { css } from "react-strict-dom";

const darkMode = "@media (prefers-color-scheme: dark)";

/** Semantic colors from the Signet Paper & Cobalt palette. */
export const colors = css.defineVars({
  background: {
    default: "#FBFFF1",
    [darkMode]: "#3C3744",
  },
  surface: {
    default: "#FFFFFF",
    [darkMode]: "#2F2B3A",
  },
  surfaceAlt: {
    default: "#EEF3FB",
    [darkMode]: "#2F2B3A",
  },
  text: {
    default: "#3C3744",
    [darkMode]: "#FBFFF1",
  },
  textSecondary: {
    default: "#6B6578",
    [darkMode]: "#B4C5E4",
  },
  border: {
    default: "#8FA3C6",
    [darkMode]: "#4F4A62",
  },
  primary: {
    default: "#3066BE",
    [darkMode]: "#5C84C6",
  },
  primaryHover: {
    default: "#2752A6",
    [darkMode]: "#8CA7D8",
  },
  primaryActive: {
    default: "#090C9B",
    [darkMode]: "#B4C5E4",
  },
  onPrimary: {
    default: "#FBFFF1",
    [darkMode]: "#131220",
  },
  selection: {
    default: "#B4C5E4",
    [darkMode]: "#090C9B",
  },
  onSelection: {
    default: "#3C3744",
    [darkMode]: "#FBFFF1",
  },
  accent: {
    default: "#090C9B",
    [darkMode]: "#B4C5E4",
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

/** Necto Mono typography scale. Consumers must register the font on native. */
export const typography = css.defineVars({
  fontFamily: "Necto Mono",
  displaySize: "48px",
  headlineSize: "32px",
  titleSize: "20px",
  bodySize: "15px",
  captionSize: "12px",
  codeSize: "13px",
});
