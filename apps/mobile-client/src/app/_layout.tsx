import { resolveLocale } from "@signet/locale";
import { LocaleProvider } from "@signet/locale/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { useLocales } from "expo-localization";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AuthSessionProvider } from "../features/auth/auth-session-provider";
import { RootNavigator } from "../features/navigation/root-navigator";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded] = useFonts([
    {
      fontFamily: "Space Mono",
      fontDefinitions: [
        {
          path: require("../../assets/fonts/SpaceMono-Regular.ttf"),
          weight: 400,
        },
        {
          path: require("../../assets/fonts/SpaceMono-Bold.ttf"),
          weight: 700,
        },
      ],
    },
  ]);
  const locales = useLocales();
  const locale = resolveLocale(locales.map(({ languageTag }) => languageTag));

  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider locale={locale}>
          <AuthSessionProvider>
            <RootNavigator fontsLoaded={fontsLoaded} />
          </AuthSessionProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  );
};

export default RootLayout;
