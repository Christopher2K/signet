import { useCallback, useEffect, useState } from "react";
import {
  type BookmarkDensity,
  defaultBookmarkDensity,
} from "./bookmarks-density";
import { bookmarkDensityStorage } from "./bookmarks-density-storage";

/** Loads the stored library density and persists user changes. */
export const useBookmarkDensity = () => {
  const [density, setStoredDensity] = useState(defaultBookmarkDensity);

  useEffect(() => {
    let active = true;

    bookmarkDensityStorage
      .readDensity()
      .then((storedDensity) => {
        if (active && storedDensity) {
          setStoredDensity(storedDensity);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const setDensity = useCallback((nextDensity: BookmarkDensity) => {
    setStoredDensity(nextDensity);

    const persist = async () => {
      try {
        await bookmarkDensityStorage.writeDensity(nextDensity);
      } catch {
        // The in-memory density remains usable when storage is unavailable.
      }
    };

    void persist();
  }, []);

  return { density, setDensity };
};
