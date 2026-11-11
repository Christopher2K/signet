import type { Bookmark } from "@signet/api";
import { updateBookmarkMutation } from "@signet/api/react-query";
import { bookmarkToFormValues, getBookmarkError } from "@signet/core/bookmarks";
import {
  cacheUpdatedBookmark,
  useBookmark,
  useBookmarkClient,
} from "@signet/core/bookmarks/react";
import { Button, Typography } from "@signet/design-system";
import { spacing } from "@signet/design-system/tokens.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { css, html } from "react-strict-dom";
import { BookmarkForm } from "./bookmark-form";
import { Dialog } from "./dialog";

/** Existing bookmark editor properties. */
export type EditBookmarkDialogProps = {
  id: string;
  onClose: () => void;
  onDelete: (bookmark: Bookmark) => void;
};

const formatTimestamp = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unavailable"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

export const EditBookmarkDialog = ({
  id,
  onClose,
  onDelete,
}: EditBookmarkDialogProps) => {
  const client = useBookmarkClient();
  const queryClient = useQueryClient();
  const bookmarkQuery = useBookmark(id);
  const mutation = useMutation(updateBookmarkMutation({ client }));
  const bookmark = bookmarkQuery.data?.data;

  const handleSubmit = async (
    request: Parameters<typeof mutation.mutateAsync>[0]["body"],
  ) => {
    const response = await mutation.mutateAsync({
      body: request,
      path: { id },
    });
    cacheUpdatedBookmark(queryClient, client, response.data);
    onClose();
  };

  const initialValues = bookmark ? bookmarkToFormValues(bookmark) : undefined;

  return (
    <Dialog onClose={onClose} title="Edit Bookmark">
      {bookmarkQuery.isPending ? (
        <Typography role="status" tone="secondary">
          Loading bookmark…
        </Typography>
      ) : bookmarkQuery.isError ? (
        <html.div role="alert" style={styles.error}>
          <Typography tone="danger">
            {getBookmarkError(bookmarkQuery.error).message}
          </Typography>
          <Button onClick={() => void bookmarkQuery.refetch()}>
            Try again
          </Button>
        </html.div>
      ) : bookmark ? (
        <>
          <Typography tone="secondary" variant="caption">
            Created {formatTimestamp(bookmark.createdAt)} · Updated{" "}
            {formatTimestamp(bookmark.updatedAt)}
          </Typography>
          <BookmarkForm
            idPrefix="edit-bookmark"
            initialValues={initialValues}
            key={bookmark.updatedAt}
            onCancel={onClose}
            onDelete={() => onDelete(bookmark)}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        </>
      ) : null}
    </Dialog>
  );
};

const styles = css.create({
  error: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
});
