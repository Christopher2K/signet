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
  border: string;
  primary: string;
  onPrimary: string;
  accent: string;
  danger: string;
};

const lightTheme: NativeTheme = {
  dark: false,
  background: "#FBFFF1",
  surface: "#FFFFFF",
  surfaceAlt: "#EEF3FB",
  text: "#3C3744",
  textSecondary: "#6B6578",
  border: "#8FA3C6",
  primary: "#3066BE",
  onPrimary: "#FBFFF1",
  accent: "#090C9B",
  danger: "#A4252C",
};

const darkTheme: NativeTheme = {
  dark: true,
  background: "#3C3744",
  surface: "#2F2B3A",
  surfaceAlt: "#2F2B3A",
  text: "#FBFFF1",
  textSecondary: "#B4C5E4",
  border: "#4F4A62",
  primary: "#5C84C6",
  onPrimary: "#131220",
  accent: "#B4C5E4",
  danger: "#FFB4AB",
};

/** Returns Signet tokens for native-only chrome and layout. */
export const useNativeTheme = (): NativeTheme =>
  useColorScheme() === "dark" ? darkTheme : lightTheme;
