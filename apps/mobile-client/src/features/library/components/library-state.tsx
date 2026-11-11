import {
  Button,
  colors,
  radii,
  spacing,
  Typography,
} from "@signet/design-system";
import { useNativeTheme } from "@signet/design-system/native-theme";
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

  return (
    <html.div data-layoutconformance="strict" style={styles.state}>
      {loading ? (
        <>
          <ActivityIndicator
            color={theme.primary}
            style={nativeStyles.loader}
          />
          <Typography role="status" tone="secondary">
            Loading bookmarks…
          </Typography>
        </>
      ) : error ? (
        <>
          <Typography as="h2" style={styles.centered} variant="title">
            Couldn't load your bookmarks
          </Typography>
          <Typography role="alert" style={styles.centered} tone="secondary">
            {error}
          </Typography>
          <Button onClick={onRetry}>Try again</Button>
        </>
      ) : (
        <>
          <Typography as="h2" style={styles.centered} variant="title">
            No bookmarks yet
          </Typography>
          <Typography style={styles.centered} tone="secondary">
            Add your first bookmark by link. Your notes and tags will live here
            too.
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
