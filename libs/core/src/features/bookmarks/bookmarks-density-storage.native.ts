import AsyncStorage from "@react-native-async-storage/async-storage";
import { isBookmarkDensity } from "./bookmarks-density";
import type { BookmarkDensityStorage } from "./bookmarks-density-storage.types";

const densityKey = "signet.library.density";

export const bookmarkDensityStorage = {
  readDensity: async () => {
    try {
      const density = await AsyncStorage.getItem(densityKey);
      return isBookmarkDensity(density) ? density : null;
    } catch {
      return null;
    }
  },
  writeDensity: async (density) => {
    try {
      await AsyncStorage.setItem(densityKey, density);
    } catch {
      // The in-memory density remains usable if persistent storage is unavailable.
    }
  },
} satisfies BookmarkDensityStorage;
