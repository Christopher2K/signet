import type { Bookmark, CreateBookmarkRequest } from "@signet/api";
import { createBookmarkMutation } from "@signet/api/react-query";
import { Button, Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { getBookmarkError } from "../bookmark-errors";
import type { BookmarkFormValues } from "../bookmark-validation";
import {
  cacheCreatedBookmark,
  findDuplicateBookmarks,
  useBookmarkClient,
} from "../use-bookmarks";
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
            ? "Couldn't check for duplicates"
            : "Already saved"
          : "New Bookmark"
      }
    >
      {warning ? (
        <html.div style={styles.warningContent}>
          <html.div style={styles.warningMessage}>
            <Icon name="warning" size={24} />
            <Typography as="p" style={styles.message} tone="secondary">
              {warning.checkFailed
                ? "We couldn't check whether this link is already saved. You can return to the form or save it anyway."
                : "This link is already in your library."}
            </Typography>
          </html.div>
          <html.div style={styles.linkPreview}>
            <Typography style={styles.link} variant="code">
              {pendingRequest?.url}
            </Typography>
          </html.div>
          {warningError ? (
            <Typography role="alert" tone="danger">
              {warningError}
            </Typography>
          ) : null}
          <html.div style={styles.warningActions}>
            <Button
              disabled={savingAnyway}
              onClick={() => setWarning(undefined)}
              variant="secondary"
            >
              Back to form
            </Button>
            {existing ? (
              <Button
                disabled={savingAnyway}
                onClick={() => onOpenExisting(existing.id)}
                variant="secondary"
              >
                Open existing
              </Button>
            ) : null}
            <Button
              disabled={savingAnyway}
              onClick={() => void handleSaveAnyway()}
            >
              {savingAnyway ? "Saving…" : "Save anyway"}
            </Button>
          </html.div>
        </html.div>
      ) : (
        <>
          <Typography as="p" tone="secondary" variant="caption">
            Add a link with a title, artwork, notes, and tags.
          </Typography>
          <BookmarkForm
            idPrefix="create-bookmark"
            initialValues={initialValues}
            onCancel={handleClose}
            onSubmit={handleSubmit}
            pendingLabel={checking ? "Checking…" : "Saving…"}
            submitLabel="Save"
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
