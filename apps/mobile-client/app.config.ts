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
    icon: "./assets/expo.icon",
    bundleIdentifier: "co.signetapp.app",
    infoPlist: {
      CFBundleLocalizations: ["en", "fr"],
    },
  },
  android: {
    package: "co.signetapp.app",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
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
        backgroundColor: "#208AEF",
        image: "./assets/images/splash-icon.png",
        imageWidth: 76,
      },
    ],
    "@react-native-community/datetimepicker",
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
