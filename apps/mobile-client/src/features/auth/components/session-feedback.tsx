import { useAuth } from "@signet/core/auth/react";
import { Button, spacing, Typography } from "@signet/design-system";
import { useNativeTheme } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";

export const SessionFeedback = () => {
  const { retryRestore, state } = useAuth();
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");
  const unavailable = state.status === "unavailable";

  return (
    <SafeAreaView
      style={[nativeStyles.container, { backgroundColor: theme.background }]}
    >
      <html.div style={styles.content}>
        <Typography as="h1" style={styles.centered} variant="headline">
          {unavailable
            ? t("session.serverUnavailable")
            : t("session.restoring")}
        </Typography>
        <Typography style={styles.centered} tone="secondary">
          {unavailable ? t(state.message) : t("session.checking")}
        </Typography>
        {unavailable ? (
          <Button onClick={retryRestore} size="lg" style={styles.retry}>
            {t("actions.tryAgain")}
          </Button>
        ) : null}
      </html.div>
    </SafeAreaView>
  );
};

const nativeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

const styles = css.create({
  content: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
    padding: spacing[4],
  },
  centered: {
    lineHeight: 1.5,
    textAlign: "center",
  },
  retry: {
    alignSelf: "stretch",
    marginTop: spacing[2],
  },
});
