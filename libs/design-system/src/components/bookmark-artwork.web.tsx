import { useState } from "react";
import { css, html } from "react-strict-dom";
import { colors, radii, spacing } from "../tokens.css";
import type { BookmarkArtworkProps } from "./bookmark-artwork.types";
import { Icon } from "./icon";

/** Tracks which source failed for the current set of artwork URLs. */
type ArtworkFallback = {
  index: number;
  key: string;
};

export const BookmarkArtwork = ({
  compact = false,
  iconSources,
  label,
  previewSources = [],
  variant = "tile",
}: BookmarkArtworkProps) => {
  const sources = [...previewSources, ...iconSources];
  const sourceKey = sources.join("|");
  const [fallback, setFallback] = useState<ArtworkFallback>({
    index: 0,
    key: sourceKey,
  });

  const sourceIndex = fallback.key === sourceKey ? fallback.index : 0;
  const source = sources[sourceIndex];
  const banner = variant === "banner";

  return (
    <html.div
      style={[styles.frame, banner && styles.banner, compact && styles.compact]}
    >
      {source ? (
        <html.img
          aria-label={label}
          loading="lazy"
          onError={() =>
            setFallback({ index: sourceIndex + 1, key: sourceKey })
          }
          referrerPolicy="no-referrer"
          src={source}
          style={styles.image}
        />
      ) : (
        <html.div aria-label={label} role="img" style={styles.fallback}>
          <Icon name="bookmark" size={compact ? 20 : banner ? 32 : 24} />
        </html.div>
      )}
    </html.div>
  );
};

const styles = css.create({
  frame: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    flexShrink: 0,
    height: 88,
    overflow: "hidden",
    width: 88,
  },
  banner: {
    /* 1200 × 630 Open Graph ratio, so OG images fill the banner uncropped. */
    aspectRatio: 1.9047619047619047,
    height: "auto",
    width: "100%",
  },
  compact: {
    borderRadius: radii.sm,
    height: 40,
    width: 40,
  },
  image: {
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    boxSizing: "border-box",
    color: colors.primary,
    display: "flex",
    height: "100%",
    justifyContent: "center",
    padding: spacing[1],
    width: "100%",
  },
});
