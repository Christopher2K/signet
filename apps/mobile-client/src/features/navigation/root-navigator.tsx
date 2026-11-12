import { useAuth } from "@signet/core/auth/react";
import { useNativeTheme } from "@signet/design-system/native-theme";
import { Redirect, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SessionFeedback } from "../auth/components/session-feedback";
import { AnimatedSplashOverlay } from "./components/animated-splash-overlay";

/** Root navigator properties. */
type RootNavigatorProps = {
  fontsLoaded: boolean;
};

export const RootNavigator = ({ fontsLoaded }: RootNavigatorProps) => {
  const { state } = useAuth();
  const pathname = usePathname();
  const theme = useNativeTheme();
  const [destinationReady, setDestinationReady] = useState(false);

  const handleDestinationLayout = useCallback(() => {
    setDestinationReady(true);
  }, []);

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
      {fontsLoaded ? (
        redirect ? (
          <Redirect href={redirect} />
        ) : state.status === "restoring" ? (
          <SessionFeedback />
        ) : (
          <View onLayout={handleDestinationLayout} style={styles.destination}>
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
          </View>
        )
      ) : null}
      <AnimatedSplashOverlay
        fontsLoaded={fontsLoaded}
        ready={destinationReady && !redirect && state.status !== "restoring"}
      />
    </>
  );
};

const styles = StyleSheet.create({
  destination: {
    flex: 1,
  },
});
