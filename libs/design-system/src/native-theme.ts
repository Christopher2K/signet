import { type TextStyle, useColorScheme } from "react-native";

/** Numeric spacing scale for native navigation and React Native views. */
export const nativeSpacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
} as const;

/** Native font family registered by each application. */
export const nativeFontFamily = "Space Mono";

/** Native navigation title using the registered Space Mono Bold face. */
export const nativeNavigationTitleStyle = {
  fontFamily: nativeFontFamily,
  fontSize: 15,
  fontWeight: "700",
} as const satisfies TextStyle;

/** Semantic native colors resolved from the active color scheme. */
export type NativeTheme = {
  dark: boolean;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  onPrimary: string;
  accent: string;
  logoBack: string;
  danger: string;
};

const lightTheme: NativeTheme = {
  dark: false,
  background: "#FDF6EE",
  surface: "#FFFFFF",
  surfaceAlt: "#FBEEE1",
  text: "#2E2620",
  textSecondary: "#6E5F53",
  textMuted: "#9A8A7C",
  border: "#B08350",
  primary: "#C2410C",
  onPrimary: "#FDF6EE",
  accent: "#7C2D12",
  logoBack: "#F2C9A4",
  danger: "#B42318",
};

const darkTheme: NativeTheme = {
  dark: true,
  background: "#2E2620",
  surface: "#241E19",
  surfaceAlt: "#2E2620",
  text: "#FDF6EE",
  textSecondary: "#F2C9A4",
  textMuted: "#A89484",
  border: "#57493C",
  primary: "#F97316",
  onPrimary: "#1C1510",
  accent: "#F2C9A4",
  logoBack: "#57493C",
  danger: "#F97066",
};

/** Returns Signet tokens for native-only chrome and layout. */
export const useNativeTheme = (): NativeTheme =>
  useColorScheme() === "dark" ? darkTheme : lightTheme;
