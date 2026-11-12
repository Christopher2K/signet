import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Signet",
  slug: "signet",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "signet",
  userInterfaceStyle: "automatic",
  ios: {
    icon: {
      light: "./assets/images/icon.png",
      dark: "./assets/images/icon-dark.png",
    },
    bundleIdentifier: "co.signetapp.app",
    appleTeamId: "2YELN5S6P5",
    infoPlist: {
      CFBundleLocalizations: ["en", "fr"],
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "co.signetapp.app",
    adaptiveIcon: {
      backgroundColor: "#FBFFF1",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FBFFF1",
        image: "./assets/images/signet-logo-light.png",
        imageWidth: 96,
        dark: {
          backgroundColor: "#3C3744",
          image: "./assets/images/signet-logo-dark.png",
        },
      },
    ],
    "@react-native-community/datetimepicker",
    [
      "@bacons/apple-targets",
      {
        root: "..",
        match: "extension-safari",
      },
    ],
    [
      "expo-localization",
      {
        supportedLocales: ["en", "fr"],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {
      asyncRoutes: {
        web: true,
      },
    },
    eas: {
      projectId: "09dc0a60-cf91-42ed-94ef-0d2ddb341a44",
    },
  },
  owner: "christopher2kdev",
};

export default config;
