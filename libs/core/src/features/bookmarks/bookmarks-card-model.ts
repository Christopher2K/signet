import type { Bookmark } from "@signet/api";
import {
  getBookmarkHostname,
  getBookmarkIconSources,
  getBookmarkPreviewSources,
} from "./bookmarks-validation";

/** Presentation data a bookmark card needs from one saved bookmark. */
export type BookmarkCardModel = {
  createdAt: string;
  hostname: string;
  iconSources: string[];
  id: string;
  notes: string | null;
  previewSources: string[];
  tags: string[];
  title: string;
  updatedAt: string;
  url: string;
};

/** Formats a saved timestamp for the active locale. */
export const formatBookmarkDate = (
  value: string,
  locale: string,
): string | undefined => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? undefined
    : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
};

/** Derives the artwork and metadata a bookmark card renders. */
export const getBookmarkCardModel = (
  bookmark: Bookmark,
): BookmarkCardModel => ({
  createdAt: bookmark.createdAt,
  hostname: getBookmarkHostname(bookmark.url),
  iconSources: getBookmarkIconSources(bookmark.url, bookmark.icon),
  id: bookmark.id,
  notes: bookmark.notes,
  previewSources: getBookmarkPreviewSources(bookmark.image),
  tags: bookmark.tags,
  title: bookmark.title,
  updatedAt: bookmark.updatedAt,
  url: bookmark.url,
});
