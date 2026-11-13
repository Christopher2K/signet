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
import { useLocale, useTranslation } from "@signet/locale/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { BookmarkCancelToolbar } from "../../../../features/library/components/bookmark-cancel-toolbar";
import { BookmarkForm } from "../../../../features/library/components/bookmark-form";
import { BookmarkScreenLayout } from "../../../../features/library/components/bookmark-screen-layout";

const formatTimestamp = (value: string, locale: string): string | undefined => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? undefined
    : new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
};

const EditBookmarkScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation("mobile");
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
      t("library.deleteTitle"),
      t("library.deleteMessage", { title: bookmark.title }),
      [
        { text: t("actions.cancel"), style: "cancel" },
        {
          text: t("actions.delete"),
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
    <>
      <BookmarkCancelToolbar />
      <BookmarkScreenLayout>
        {bookmarkQuery.isPending ? (
          <Typography role="status" tone="secondary">
            {t("library.loadingBookmark")}
          </Typography>
        ) : bookmarkQuery.isError ? (
          <>
            <Typography role="alert" tone="danger">
              {t(getBookmarkError(bookmarkQuery.error).message)}
            </Typography>
            <Button onClick={() => void bookmarkQuery.refetch()}>
              {t("actions.tryAgain")}
            </Button>
          </>
        ) : bookmark ? (
          <>
            <Typography tone="secondary" variant="caption">
              {t("library.createdOn", {
                date:
                  formatTimestamp(bookmark.createdAt, locale) ??
                  t("library.timestampUnavailable"),
              })}{" "}
              ·{" "}
              {t("library.updatedOn", {
                date:
                  formatTimestamp(bookmark.updatedAt, locale) ??
                  t("library.timestampUnavailable"),
              })}
            </Typography>
            <BookmarkForm
              deleteError={deleteError}
              deletePending={deleteMutation.isPending}
              initialValues={bookmarkToFormValues(bookmark)}
              key={bookmark.updatedAt}
              onDelete={confirmDelete}
              onSubmit={handleSubmit}
              submitLabel={t("actions.saveChanges")}
            />
          </>
        ) : null}
      </BookmarkScreenLayout>
    </>
  );
};

export default EditBookmarkScreen;
