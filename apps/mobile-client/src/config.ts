import { Platform } from "react-native";

const developmentApiUrl = Platform.select({
  android: "http://10.0.2.2:4000",
  default: "http://127.0.0.1:4000",
});

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

/** Initial server URL, with a local development fallback. */
export const DEFAULT_SERVER_URL =
  configuredApiUrl || (__DEV__ ? developmentApiUrl : "");
