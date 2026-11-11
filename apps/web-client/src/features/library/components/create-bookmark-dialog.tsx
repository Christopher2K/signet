import type { Bookmark, CreateBookmarkRequest } from "@signet/api";
import { createBookmarkMutation } from "@signet/api/react-query";
import {
  type BookmarkFormValues,
  getBookmarkError,
} from "@signet/core/bookmarks";
import {
  cacheCreatedBookmark,
  findDuplicateBookmarks,
  useBookmarkClient,
} from "@signet/core/bookmarks/react";
import { Button, Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { BookmarkForm } from "./bookmark-form";
import { Dialog } from "./dialog";
import { Icon } from "./icon";

/** New bookmark dialog properties. */
export type CreateBookmarkDialogProps = {
  onClose: () => void;
  onOpenExisting: (id: string) => void;
};

type DuplicateWarning = {
  bookmarks: Bookmark[];
  checkFailed: boolean;
};

export const CreateBookmarkDialog = ({
  onClose,
  onOpenExisting,
}: CreateBookmarkDialogProps) => {
  const { t } = useTranslation("web");
  const client = useBookmarkClient();
  const queryClient = useQueryClient();
  const mutation = useMutation(createBookmarkMutation({ client }));
  const [checking, setChecking] = useState(false);
  const [savingAnyway, setSavingAnyway] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<CreateBookmarkRequest>();
  const [warning, setWarning] = useState<DuplicateWarning>();
  const [warningError, setWarningError] = useState<string>();

  const saveBookmark = async (request: CreateBookmarkRequest) => {
    const response = await mutation.mutateAsync({ body: request });
    cacheCreatedBookmark(queryClient, client, response.data);
    onClose();
  };

  const handleSubmit = async (request: CreateBookmarkRequest) => {
    setPendingRequest(request);
    setChecking(true);
    setWarningError(undefined);
    let bookmarks: Bookmark[];
    try {
      bookmarks = await findDuplicateBookmarks(
        queryClient,
        client,
        request.url,
      );
    } catch {
      // A failed lookup must not prevent a deliberate save.
      setWarning({ bookmarks: [], checkFailed: true });
      return;
    } finally {
      setChecking(false);
    }
    if (bookmarks.length > 0) {
      setWarning({ bookmarks, checkFailed: false });
      return;
    }
    await saveBookmark(request);
  };

  const handleSaveAnyway = async () => {
    if (!pendingRequest || savingAnyway) {
      return;
    }
    setSavingAnyway(true);
    setWarningError(undefined);
    try {
      await saveBookmark(pendingRequest);
    } catch (error) {
      setWarningError(getBookmarkError(error).message);
    } finally {
      setSavingAnyway(false);
    }
  };

  const handleClose = () => {
    if (!checking && !savingAnyway) {
      onClose();
    }
  };

  const initialValues: BookmarkFormValues | undefined = pendingRequest
    ? {
        image: pendingRequest.image ?? "",
        notes: pendingRequest.notes ?? "",
        tags: pendingRequest.tags?.join(", ") ?? "",
        title: pendingRequest.title,
        url: pendingRequest.url,
      }
    : undefined;
  const existing = warning?.bookmarks[0];

  return (
    <Dialog
      onClose={handleClose}
      title={
        warning
          ? warning.checkFailed
            ? t("library.create.duplicateCheckFailedTitle")
            : t("library.create.duplicateTitle")
          : t("actions.newBookmark")
      }
    >
      {warning ? (
        <html.div style={styles.warningContent}>
          <html.div style={styles.warningMessage}>
            <Icon name="warning" size={24} />
            <Typography as="p" style={styles.message} tone="secondary">
              {warning.checkFailed
                ? t("library.create.duplicateCheckFailedMessage")
                : t("library.create.duplicateMessage")}
            </Typography>
          </html.div>
          <html.div style={styles.linkPreview}>
            <Typography style={styles.link} variant="code">
              {pendingRequest?.url}
            </Typography>
          </html.div>
          {warningError ? (
            <Typography role="alert" tone="danger">
              {t(warningError)}
            </Typography>
          ) : null}
          <html.div style={styles.warningActions}>
            <Button
              disabled={savingAnyway}
              onClick={() => setWarning(undefined)}
              variant="secondary"
            >
              {t("actions.backToForm")}
            </Button>
            {existing ? (
              <Button
                disabled={savingAnyway}
                onClick={() => onOpenExisting(existing.id)}
                variant="secondary"
              >
                {t("actions.openExisting")}
              </Button>
            ) : null}
            <Button
              disabled={savingAnyway}
              onClick={() => void handleSaveAnyway()}
            >
              {savingAnyway
                ? t("library.form.saving")
                : t("actions.saveAnyway")}
            </Button>
          </html.div>
        </html.div>
      ) : (
        <>
          <Typography as="p" tone="secondary" variant="caption">
            {t("library.create.description")}
          </Typography>
          <BookmarkForm
            idPrefix="create-bookmark"
            initialValues={initialValues}
            onCancel={handleClose}
            onSubmit={handleSubmit}
            pendingLabel={
              checking ? t("library.create.checking") : t("library.form.saving")
            }
            submitLabel={t("actions.save")}
          />
        </>
      )}
    </Dialog>
  );
};

const styles = css.create({
  warningContent: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
  warningMessage: {
    alignItems: "flex-start",
    color: colors.textSecondary,
    display: "flex",
    gap: spacing[3],
  },
  message: {
    lineHeight: 1.5,
  },
  linkPreview: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    padding: spacing[3],
  },
  link: {
    overflowWrap: "anywhere",
  },
  warningActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[3],
    justifyContent: "flex-end",
  },
});
