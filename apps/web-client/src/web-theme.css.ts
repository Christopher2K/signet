import { typography } from "@signet/design-system/tokens.css";
import { css } from "react-strict-dom";

/** Web-only font fallback that preserves the shared native typography token. */
export const webTheme = css.createTheme(typography, {
  fontFamily: "Necto Mono, monospace",
});
