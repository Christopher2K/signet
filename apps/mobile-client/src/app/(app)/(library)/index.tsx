import { colors, radii, spacing, Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { ScrollView, StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";

const LibraryScreen = () => {
  const theme = useNativeTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: theme.background }}
    >
      <html.div data-layoutconformance="strict" style={strictStyles.content}>
        <Typography as="h1" variant="headline">
          Your library
        </Typography>
        <html.div style={strictStyles.emptyState}>
          <Typography as="h2" style={strictStyles.centered} variant="title">
            No bookmarks yet
          </Typography>
          <Typography
            style={strictStyles.centered}
            tone="secondary"
            variant="body"
          >
            Your saved bookmarks will appear here.
          </Typography>
        </html.div>
      </html.div>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: nativeSpacing[4],
  },
});

const strictStyles = css.create({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
  },
  emptyState: {
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
    minHeight: 144,
    padding: spacing[6],
  },
  centered: {
    lineHeight: 1.5,
    textAlign: "center",
  },
});

export default LibraryScreen;
