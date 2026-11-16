/** Library card density. */
export type BookmarkDensity = "big" | "medium" | "compact";

/** Densities in toggle order, from richest to most compact. */
export const bookmarkDensities = ["big", "medium", "compact"] as const;

/** Density used until the user stores a preference. */
export const defaultBookmarkDensity: BookmarkDensity = "medium";

/** Narrows an unknown value to a supported card density. */
export const isBookmarkDensity = (value: unknown): value is BookmarkDensity =>
  bookmarkDensities.some((density) => density === value);
