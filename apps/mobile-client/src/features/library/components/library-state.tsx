import {
  Button,
  colors,
  radii,
  spacing,
  Typography,
} from "@signet/design-system";
import { useNativeTheme } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";

/** Library asynchronous and empty-state properties. */
type LibraryStateProps = {
  error?: string;
  loading?: boolean;
  onRetry: () => void;
};

export const LibraryState = ({
  error,
  loading = false,
  onRetry,
}: LibraryStateProps) => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <html.div data-layoutconformance="strict" style={styles.state}>
      {loading ? (
        <>
          <ActivityIndicator
            color={theme.primary}
            style={nativeStyles.loader}
          />
          <Typography role="status" tone="secondary">
            {t("library.loadingBookmarks")}
          </Typography>
        </>
      ) : error ? (
        <>
          <Typography as="h2" style={styles.centered} variant="title">
            {t("library.errorTitle")}
          </Typography>
          <Typography role="alert" style={styles.centered} tone="secondary">
            {t(error)}
          </Typography>
          <Button onClick={onRetry}>{t("actions.tryAgain")}</Button>
        </>
      ) : (
        <>
          <Typography as="h2" style={styles.centered} variant="title">
            {t("library.emptyTitle")}
          </Typography>
          <Typography style={styles.centered} tone="secondary">
            {t("library.emptyMessage")}
          </Typography>
        </>
      )}
    </html.div>
  );
};

const nativeStyles = StyleSheet.create({
  loader: {
    alignSelf: "center",
  },
});

const styles = css.create({
  state: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
    justifyContent: "center",
    minHeight: 200,
    padding: spacing[6],
  },
  centered: {
    lineHeight: 1.5,
    textAlign: "center",
  },
});
