import { isBookmarkDensity } from "./bookmarks-density";
import type { BookmarkDensityStorage } from "./bookmarks-density-storage.types";

const densityKey = "signet.library.density";

/** Minimal browser-storage contract used for the library density preference. */
export type BrowserDensityStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

const getBrowserStorage = (): BrowserDensityStorage | undefined => {
  try {
    if (typeof window === "undefined") {
      return undefined;
    }
    return window.localStorage;
  } catch {
    return undefined;
  }
};

/** Creates a browser-backed bookmark density storage adapter. */
export const createWebBookmarkDensityStorage = (
  storage?: BrowserDensityStorage,
): BookmarkDensityStorage => {
  const getStorage = () => storage ?? getBrowserStorage();

  return {
    readDensity: async () => {
      try {
        const density = getStorage()?.getItem(densityKey) ?? null;
        return isBookmarkDensity(density) ? density : null;
      } catch {
        return null;
      }
    },
    writeDensity: async (density) => {
      try {
        getStorage()?.setItem(densityKey, density);
      } catch {
        // The in-memory density remains usable when storage is unavailable.
      }
    },
  };
};

export const bookmarkDensityStorage = createWebBookmarkDensityStorage();
