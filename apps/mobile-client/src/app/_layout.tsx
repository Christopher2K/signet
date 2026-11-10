import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AuthSessionProvider } from "../features/auth/auth-session-provider";
import { RootNavigator } from "../features/navigation/root-navigator";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    "Necto Mono": require("../../assets/fonts/NectoMono-Regular.otf"),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <RootNavigator fontsLoaded={fontsLoaded} />
      </AuthSessionProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
