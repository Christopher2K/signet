import type { Bookmark } from "@signet/api";
import {
  Button,
  colors,
  radii,
  spacing,
  Typography,
} from "@signet/design-system";
import { useNativeTheme } from "@signet/design-system/native-theme";
import { css, html } from "react-strict-dom";
import { BookmarkIcon } from "./bookmark-icon";

/** Duplicate URL warning properties. */
type DuplicateBookmarkWarningProps = {
  checkFailed: boolean;
  error?: string;
  existing?: Bookmark;
  onBack: () => void;
  onOpenExisting: (id: string) => void;
  onSaveAnyway: () => void;
  pending: boolean;
  url: string;
};

export const DuplicateBookmarkWarning = ({
  checkFailed,
  error,
  existing,
  onBack,
  onOpenExisting,
  onSaveAnyway,
  pending,
  url,
}: DuplicateBookmarkWarningProps) => {
  const theme = useNativeTheme();

  return (
    <html.div data-layoutconformance="strict" style={styles.content}>
      <BookmarkIcon color={theme.primary} name="warning" size={32} />
      <Typography as="h1" variant="headline">
        {checkFailed ? "Couldn't check for duplicates" : "Already saved"}
      </Typography>
      <Typography style={styles.message} tone="secondary">
        {checkFailed
          ? "We couldn't check whether this link is already saved. You can return to the form or save it anyway."
          : "This link is already in your library."}
      </Typography>
      <html.div style={styles.linkPreview}>
        <Typography variant="code">{url}</Typography>
      </html.div>
      {error ? (
        <Typography role="alert" tone="danger">
          {error}
        </Typography>
      ) : null}
      <html.div style={styles.actions}>
        <Button
          disabled={pending}
          onClick={onBack}
          size="lg"
          style={styles.action}
          variant="secondary"
        >
          Back to form
        </Button>
        {existing ? (
          <Button
            disabled={pending}
            onClick={() => onOpenExisting(existing.id)}
            size="lg"
            style={styles.action}
            variant="secondary"
          >
            Open existing
          </Button>
        ) : null}
        <Button
          disabled={pending}
          onClick={onSaveAnyway}
          size="lg"
          style={styles.action}
        >
          {pending ? "Saving…" : "Save anyway"}
        </Button>
      </html.div>
    </html.div>
  );
};

const styles = css.create({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
  message: {
    lineHeight: 1.5,
  },
  linkPreview: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    display: "flex",
    padding: spacing[3],
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
    marginTop: spacing[2],
  },
  action: {
    alignSelf: "stretch",
    borderRadius: radii.lg,
  },
});
