import type { Bookmark } from "@signet/api";
import { deleteBookmarkMutation } from "@signet/api/react-query";
import { Button, Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { getBookmarkError } from "../bookmark-errors";
import { cacheDeletedBookmark, useBookmarkClient } from "../use-bookmarks";
import { Dialog } from "./dialog";

/** Delete confirmation properties. */
export type DeleteBookmarkDialogProps = {
  bookmark: Bookmark;
  onCancel: () => void;
  onDeleted: () => void;
};

export const DeleteBookmarkDialog = ({
  bookmark,
  onCancel,
  onDeleted,
}: DeleteBookmarkDialogProps) => {
  const client = useBookmarkClient();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const mutation = useMutation(deleteBookmarkMutation({ client }));

  const handleDelete = async () => {
    setError(undefined);
    try {
      await mutation.mutateAsync({ path: { id: bookmark.id } });
      cacheDeletedBookmark(queryClient, client, bookmark.id);
      onDeleted();
    } catch (requestError) {
      setError(getBookmarkError(requestError).message);
    }
  };

  return (
    <Dialog onClose={onCancel} title="Delete Bookmark">
      <Typography as="p" style={styles.message} tone="secondary">
        This will permanently remove the bookmark from your library. This cannot
        be undone.
      </Typography>
      <html.div style={styles.bookmark}>
        <Typography as="p" style={styles.bookmarkTitle}>
          {bookmark.title}
        </Typography>
        <Typography as="p" tone="secondary" variant="caption">
          {bookmark.url}
        </Typography>
      </html.div>
      {error ? (
        <Typography role="alert" tone="danger">
          {error}
        </Typography>
      ) : null}
      <html.div style={styles.actions}>
        <Button
          disabled={mutation.isPending}
          onClick={onCancel}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          disabled={mutation.isPending}
          onClick={() => void handleDelete()}
          style={styles.delete}
        >
          {mutation.isPending ? "Deleting…" : "Delete"}
        </Button>
      </html.div>
    </Dialog>
  );
};

const styles = css.create({
  message: {
    lineHeight: 1.5,
  },
  bookmark: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
    overflowWrap: "anywhere",
    padding: spacing[3],
  },
  bookmarkTitle: {
    fontWeight: "600",
  },
  actions: {
    display: "flex",
    gap: spacing[3],
    justifyContent: "flex-end",
  },
  delete: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
});
