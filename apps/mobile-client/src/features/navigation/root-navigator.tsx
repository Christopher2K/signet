import { useNativeTheme } from "@signet/design-system/native-theme";
import { Redirect, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuth } from "../auth/auth-context";
import { SessionFeedback } from "../auth/components/session-feedback";

/** Root navigator properties. */
type RootNavigatorProps = {
  fontsLoaded: boolean;
};

export const RootNavigator = ({ fontsLoaded }: RootNavigatorProps) => {
  const { state } = useAuth();
  const pathname = usePathname();
  const theme = useNativeTheme();

  useEffect(() => {
    if (fontsLoaded && state.status !== "restoring") {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, state.status]);

  if (!fontsLoaded) {
    return null;
  }

  const onAuthScreen = pathname === "/login" || pathname === "/signup";
  const redirect =
    state.status === "unauthenticated" && !onAuthScreen
      ? "/login"
      : state.status === "authenticated" &&
          (onAuthScreen || pathname === "/unavailable")
        ? "/"
        : state.status === "unavailable" && pathname !== "/unavailable"
          ? "/unavailable"
          : undefined;

  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      {redirect ? (
        <Redirect href={redirect} />
      ) : state.status === "restoring" ? (
        <SessionFeedback />
      ) : (
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: theme.background },
            headerShown: false,
          }}
        >
          <Stack.Protected guard={state.status === "authenticated"}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
          <Stack.Protected guard={state.status === "unauthenticated"}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={state.status === "unavailable"}>
            <Stack.Screen name="unavailable" />
          </Stack.Protected>
        </Stack>
      )}
    </>
  );
};
