import {
  type ApiClient,
  type Bookmark,
  type BookmarkListResponse,
  createApiClient,
} from "@signet/api";
import {
  getBookmarkOptions,
  getBookmarkQueryKey,
  listBookmarksOptions,
  listBookmarksQueryKey,
} from "@signet/api/react-query";
import { useLocale } from "@signet/locale/react";
import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth, useAuthApiContext } from "../auth/auth-react";

/** Returns a generated API client bound to the active session token. */
export const useBookmarkClient = (): ApiClient => {
  const { getLocale } = useLocale();
  const { serverUrl } = useAuth();
  const { tokenRef } = useAuthApiContext();
  return useMemo(
    () =>
      createApiClient({
        auth: () => tokenRef.current ?? undefined,
        baseUrl: serverUrl,
        getLanguage: getLocale,
      }),
    [getLocale, serverUrl, tokenRef],
  );
};

export const bookmarkListKey = (client: ApiClient) =>
  listBookmarksQueryKey({ client });

export const bookmarkDetailKey = (client: ApiClient, id: string) =>
  getBookmarkQueryKey({ client, path: { id } });

/** Loads the current user's newest-first bookmark collection. */
export const useBookmarks = () => {
  const client = useBookmarkClient();
  return useQuery({
    ...listBookmarksOptions({ client }),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/** Loads one bookmark, including not-found handling for inaccessible records. */
export const useBookmark = (id: string) => {
  const client = useBookmarkClient();
  return useQuery({
    ...getBookmarkOptions({ client, path: { id } }),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

/** Performs the canonical exact-URL duplicate lookup. */
export const findDuplicateBookmarks = async (
  queryClient: QueryClient,
  client: ApiClient,
  url: string,
): Promise<Bookmark[]> => {
  const response = await queryClient.query({
    ...listBookmarksOptions({ client, query: { url } }),
    retry: false,
  });
  return response.data;
};

/** Inserts a created bookmark without requiring a collection refetch. */
export const cacheCreatedBookmark = (
  queryClient: QueryClient,
  client: ApiClient,
  bookmark: Bookmark,
) => {
  queryClient.setQueryData<BookmarkListResponse>(
    bookmarkListKey(client),
    (current) => ({
      data: [bookmark, ...(current?.data ?? [])],
    }),
  );
  queryClient.setQueryData(bookmarkDetailKey(client, bookmark.id), {
    data: bookmark,
  });
};

/** Replaces an updated bookmark in collection and detail caches. */
export const cacheUpdatedBookmark = (
  queryClient: QueryClient,
  client: ApiClient,
  bookmark: Bookmark,
) => {
  queryClient.setQueryData<BookmarkListResponse>(
    bookmarkListKey(client),
    (current) =>
      current
        ? {
            data: current.data.map((item) =>
              item.id === bookmark.id ? bookmark : item,
            ),
          }
        : current,
  );
  queryClient.setQueryData(bookmarkDetailKey(client, bookmark.id), {
    data: bookmark,
  });
};

/** Removes a deleted bookmark from all local query data. */
export const cacheDeletedBookmark = (
  queryClient: QueryClient,
  client: ApiClient,
  id: string,
) => {
  queryClient.setQueryData<BookmarkListResponse>(
    bookmarkListKey(client),
    (current) =>
      current
        ? { data: current.data.filter((item) => item.id !== id) }
        : current,
  );
  queryClient.removeQueries({ queryKey: bookmarkDetailKey(client, id) });
};

/** Invalidates bookmark queries after an account-level retry. */
export const useInvalidateBookmarks = () => {
  const client = useBookmarkClient();
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: bookmarkListKey(client) });
};
