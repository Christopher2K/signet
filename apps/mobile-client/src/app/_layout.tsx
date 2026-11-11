import { resolveLocale } from "@signet/locale";
import { LocaleProvider } from "@signet/locale/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { useLocales } from "expo-localization";
import * as SplashScreen from "expo-splash-screen";
import { AuthSessionProvider } from "../features/auth/auth-session-provider";
import { RootNavigator } from "../features/navigation/root-navigator";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    "Necto Mono": require("../../assets/fonts/NectoMono-Regular.otf"),
  });
  const locales = useLocales();
  const locale = resolveLocale(locales.map(({ languageTag }) => languageTag));

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={locale}>
        <AuthSessionProvider>
          <RootNavigator fontsLoaded={fontsLoaded} />
        </AuthSessionProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
