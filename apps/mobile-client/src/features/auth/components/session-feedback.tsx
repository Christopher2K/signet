import { normalizeServerUrl, validateServerUrl } from "@signet/core/auth";
import { useAuth } from "@signet/core/auth/react";
import {
  Button,
  radii,
  spacing,
  TextField,
  Typography,
} from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { useState } from "react";
import { Keyboard, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";

export const SessionFeedback = () => {
  const { retryRestore, retrying, serverUrl, state } = useAuth();
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");
  const [editedServerUrl, setEditedServerUrl] = useState(serverUrl);
  const [serverUrlError, setServerUrlError] = useState<string>();
  const unavailable = state.status === "unavailable" || retrying;

  const handleRetry = () => {
    if (retrying) {
      return;
    }
    Keyboard.dismiss();
    const validationError = validateServerUrl(editedServerUrl);
    if (validationError) {
      setServerUrlError(validationError);
      return;
    }
    setServerUrlError(undefined);
    retryRestore(normalizeServerUrl(editedServerUrl));
  };

  return (
    <SafeAreaView
      style={[nativeStyles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAwareScrollView
        bottomOffset={nativeSpacing[4]}
        contentContainerStyle={nativeStyles.scrollContent}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <html.div data-layoutconformance="strict" style={styles.content}>
          <Typography as="h1" style={styles.centered} variant="headline">
            {unavailable
              ? t("session.serverUnavailable")
              : t("session.restoring")}
          </Typography>
          <Typography role="status" style={styles.centered} tone="secondary">
            {unavailable
              ? t("session.unavailableMessage")
              : t("session.checking")}
          </Typography>
          {unavailable ? (
            <html.div aria-busy={retrying} style={styles.form}>
              <TextField
                autoCapitalize="none"
                autoComplete="off"
                disabled={retrying}
                error={serverUrlError ? t(serverUrlError) : undefined}
                id="restore-server-url"
                label={t("auth.serverUrl")}
                name="serverUrl"
                onValueChange={(value) => {
                  setEditedServerUrl(value);
                  setServerUrlError(undefined);
                }}
                placeholder="https://signet.example.com"
                required
                style={styles.input}
                type="url"
                value={editedServerUrl}
              />
              <Button
                disabled={retrying}
                onClick={handleRetry}
                size="lg"
                style={styles.retry}
              >
                {retrying ? t("actions.checking") : t("actions.tryAgain")}
              </Button>
            </html.div>
          ) : null}
        </html.div>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const nativeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: nativeSpacing[4],
  },
});

const styles = css.create({
  content: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
    width: "100%",
  },
  centered: {
    lineHeight: 1.5,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    width: "100%",
  },
  input: {
    borderRadius: radii.lg,
    minHeight: 48,
  },
  retry: {
    alignSelf: "stretch",
    borderRadius: radii.lg,
  },
});
