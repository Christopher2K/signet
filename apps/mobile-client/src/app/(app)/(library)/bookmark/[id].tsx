import type { CreateBookmarkRequest } from "@signet/api";
import {
  deleteBookmarkMutation,
  updateBookmarkMutation,
} from "@signet/api/react-query";
import { bookmarkToFormValues, getBookmarkError } from "@signet/core/bookmarks";
import {
  cacheDeletedBookmark,
  cacheUpdatedBookmark,
  useBookmark,
  useBookmarkClient,
} from "@signet/core/bookmarks/react";
import { Button, Typography } from "@signet/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { BookmarkForm } from "../../../../features/library/components/bookmark-form";
import { BookmarkScreenLayout } from "../../../../features/library/components/bookmark-screen-layout";

const formatTimestamp = (value: string): string => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unavailable"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const EditBookmarkScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const client = useBookmarkClient();
  const queryClient = useQueryClient();
  const bookmarkQuery = useBookmark(id);
  const updateMutation = useMutation(updateBookmarkMutation({ client }));
  const deleteMutation = useMutation(deleteBookmarkMutation({ client }));
  const [deleteError, setDeleteError] = useState<string>();
  const isMounted = useRef(true);
  const bookmark = bookmarkQuery.data?.data;

  const handleSubmit = async (request: CreateBookmarkRequest) => {
    const response = await updateMutation.mutateAsync({
      body: request,
      path: { id },
    });
    cacheUpdatedBookmark(queryClient, client, response.data);
    if (isMounted.current) {
      router.back();
    }
  };

  const handleDelete = async () => {
    setDeleteError(undefined);
    try {
      await deleteMutation.mutateAsync({ path: { id } });
      cacheDeletedBookmark(queryClient, client, id);
      if (isMounted.current) {
        router.back();
      }
    } catch (error) {
      if (isMounted.current) {
        setDeleteError(getBookmarkError(error).message);
      }
    }
  };

  const confirmDelete = () => {
    if (!bookmark) {
      return;
    }
    Alert.alert(
      "Delete Bookmark",
      `Permanently remove “${bookmark.title}” from your library? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void handleDelete(),
        },
      ],
    );
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <BookmarkScreenLayout>
      {bookmarkQuery.isPending ? (
        <Typography role="status" tone="secondary">
          Loading bookmark…
        </Typography>
      ) : bookmarkQuery.isError ? (
        <>
          <Typography role="alert" tone="danger">
            {getBookmarkError(bookmarkQuery.error).message}
          </Typography>
          <Button onClick={() => void bookmarkQuery.refetch()}>
            Try again
          </Button>
        </>
      ) : bookmark ? (
        <>
          <Typography tone="secondary" variant="caption">
            Created {formatTimestamp(bookmark.createdAt)} · Updated{" "}
            {formatTimestamp(bookmark.updatedAt)}
          </Typography>
          <BookmarkForm
            deleteError={deleteError}
            deletePending={deleteMutation.isPending}
            initialValues={bookmarkToFormValues(bookmark)}
            key={bookmark.updatedAt}
            onCancel={() => router.back()}
            onDelete={confirmDelete}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        </>
      ) : null}
    </BookmarkScreenLayout>
  );
};

export default EditBookmarkScreen;
