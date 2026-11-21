import { css } from "react-strict-dom";

const darkMode = "@media (prefers-color-scheme: dark)";

/** Popup-specific colors that complement the shared Signet palette. */
export const popupColors = css.defineVars({
  statusSurface: {
    default: "#FBEEE1",
    [darkMode]: "#2E2620",
  },
  focusHalo: {
    default: "#F2C9A4",
    [darkMode]: "#F97316",
  },
});
