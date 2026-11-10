import { Button, Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { css } from "react-strict-dom";
import { useAuth } from "../auth-context";

export const SessionFeedback = () => {
  const { retryRestore, state } = useAuth();
  const theme = useNativeTheme();
  const unavailable = state.status === "unavailable";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <Typography as="h1" style={strictStyles.centered} variant="headline">
          {unavailable ? "Server unavailable" : "Restoring your session…"}
        </Typography>
        <Typography style={strictStyles.centered} tone="secondary">
          {unavailable
            ? state.message
            : "Checking your saved session with the server."}
        </Typography>
        {unavailable ? (
          <Button onClick={retryRestore} size="lg" style={strictStyles.retry}>
            Try again
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    gap: nativeSpacing[6],
    padding: nativeSpacing[4],
  },
});

const strictStyles = css.create({
  centered: {
    lineHeight: 1.5,
    textAlign: "center",
  },
  retry: {
    alignSelf: "stretch",
    marginTop: nativeSpacing[2],
  },
});
