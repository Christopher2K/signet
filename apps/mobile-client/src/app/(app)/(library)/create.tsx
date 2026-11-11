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
import { Typography } from "@signet/design-system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { BookmarkForm } from "../../../features/library/components/bookmark-form";
import { BookmarkScreenLayout } from "../../../features/library/components/bookmark-screen-layout";
import { DuplicateBookmarkWarning } from "../../../features/library/components/duplicate-bookmark-warning";

type DuplicateWarning = {
  bookmarks: Bookmark[];
  checkFailed: boolean;
};

const CreateBookmarkScreen = () => {
  const router = useRouter();
  const client = useBookmarkClient();
  const queryClient = useQueryClient();
  const mutation = useMutation(createBookmarkMutation({ client }));
  const [checking, setChecking] = useState(false);
  const [savingAnyway, setSavingAnyway] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<CreateBookmarkRequest>();
  const [warning, setWarning] = useState<DuplicateWarning>();
  const [warningError, setWarningError] = useState<string>();
  const isMounted = useRef(true);

  const saveBookmark = async (request: CreateBookmarkRequest) => {
    const response = await mutation.mutateAsync({ body: request });
    cacheCreatedBookmark(queryClient, client, response.data);
    if (isMounted.current) {
      router.back();
    }
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
      if (isMounted.current) {
        setWarning({ bookmarks: [], checkFailed: true });
      }
      return;
    } finally {
      if (isMounted.current) {
        setChecking(false);
      }
    }
    if (!isMounted.current) {
      return;
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
      if (isMounted.current) {
        setWarningError(getBookmarkError(error).message);
      }
    } finally {
      if (isMounted.current) {
        setSavingAnyway(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const initialValues: BookmarkFormValues | undefined = pendingRequest
    ? {
        image: pendingRequest.image ?? "",
        notes: pendingRequest.notes ?? "",
        tags: pendingRequest.tags?.join(", ") ?? "",
        title: pendingRequest.title,
        url: pendingRequest.url,
      }
    : undefined;

  return (
    <BookmarkScreenLayout>
      {warning ? (
        <DuplicateBookmarkWarning
          checkFailed={warning.checkFailed}
          error={warningError}
          existing={warning.bookmarks[0]}
          onBack={() => setWarning(undefined)}
          onOpenExisting={(id) =>
            router.replace({ pathname: "/bookmark/[id]", params: { id } })
          }
          onSaveAnyway={() => void handleSaveAnyway()}
          pending={savingAnyway}
          url={pendingRequest?.url ?? ""}
        />
      ) : (
        <>
          <Typography tone="secondary" variant="caption">
            Add a link with a title, artwork, notes, and tags.
          </Typography>
          <BookmarkForm
            initialValues={initialValues}
            onCancel={() => router.back()}
            onSubmit={handleSubmit}
            pendingLabel={checking ? "Checking…" : "Saving…"}
            submitLabel="Save"
          />
        </>
      )}
    </BookmarkScreenLayout>
  );
};

export default CreateBookmarkScreen;
