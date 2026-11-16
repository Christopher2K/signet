/** Artwork shapes shared by the bookmark cards. */
export type BookmarkArtworkVariant = "tile" | "banner";

/** Bookmark artwork properties. */
export type BookmarkArtworkProps = {
  /** Renders the 24 px tile used by compact rows. */
  compact?: boolean;
  /** Site icon URLs in preference order. */
  iconSources: string[];
  /** Accessible label for the artwork. */
  label: string;
  /** Preview images tried before the icon sources. */
  previewSources?: string[];
  /** Tile or banner shape, defaulting to the tile. */
  variant?: BookmarkArtworkVariant;
};
