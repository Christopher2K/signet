import type { BookmarkDensity } from "./bookmarks-density";

/** Persistence contract for the library card density. */
export type BookmarkDensityStorage = {
  readDensity: () => Promise<BookmarkDensity | null>;
  writeDensity: (density: BookmarkDensity) => Promise<void>;
};
