/** Card density presets: the big banner card, the principal medium card, and the compact row. */
export type BookmarkCardDensity = "big" | "medium" | "compact";

/**
 * Bookmark data a card renders.
 *
 * `@signet/core` derives this shape from a saved bookmark, and both clients pass
 * the derived object here. The design system stays independent of the API and
 * core packages, so the contract is structural.
 */
export type BookmarkCardData = {
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

/** Translated strings supplied by the host application. */
export type BookmarkCardStrings = {
  /** Accessible label for the artwork, for example "example.com bookmark artwork". */
  artwork: string;
  /** Visible edit action label. */
  edit: string;
  /** Accessible label for the edit action, for example "Edit Example". */
  editItem: string;
  /** Visible open action label. */
  open: string;
  /** Accessible label for the open action, for example "Open Example". */
  openItem: string;
  /** Fully formatted saved date, for example "Saved Nov 15, 2026". */
  savedOn: string;
  /** Accessible label for the tag group. */
  tags: string;
  /** Fully formatted update date, rendered by the web card when the bookmark changed. */
  updatedOn?: string;
};

/** Cross-platform bookmark card properties. */
export type BookmarkCardProps = {
  /** Bookmark data derived by the host application. */
  bookmark: BookmarkCardData;
  /** Density preset, defaulting to the medium card. */
  density?: BookmarkCardDensity;
  /** Opens the bookmark editor. */
  onEdit: (id: string) => void;
  /** Opens the saved link. Native cards require it; web cards render links. */
  onOpen?: (url: string) => void;
  /** Translated copy for the card. */
  strings: BookmarkCardStrings;
};
