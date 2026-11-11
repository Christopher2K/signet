import type { Bookmark } from "@signet/api";
import {
  Button,
  colors,
  radii,
  spacing,
  Typography,
} from "@signet/design-system";
import { useNativeTheme } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
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
  const { t } = useTranslation("mobile");

  return (
    <html.div data-layoutconformance="strict" style={styles.content}>
      <BookmarkIcon color={theme.primary} name="warning" size={32} />
      <Typography as="h1" variant="headline">
        {checkFailed ? t("duplicate.checkFailed") : t("duplicate.alreadySaved")}
      </Typography>
      <Typography style={styles.message} tone="secondary">
        {checkFailed
          ? t("duplicate.checkFailedMessage")
          : t("duplicate.alreadySavedMessage")}
      </Typography>
      <html.div style={styles.linkPreview}>
        <Typography variant="code">{url}</Typography>
      </html.div>
      {error ? (
        <Typography role="alert" tone="danger">
          {t(error)}
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
          {t("actions.backToForm")}
        </Button>
        {existing ? (
          <Button
            disabled={pending}
            onClick={() => onOpenExisting(existing.id)}
            size="lg"
            style={styles.action}
            variant="secondary"
          >
            {t("actions.openExisting")}
          </Button>
        ) : null}
        <Button
          disabled={pending}
          onClick={onSaveAnyway}
          size="lg"
          style={styles.action}
        >
          {pending ? t("actions.saving") : t("actions.saveAnyway")}
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
