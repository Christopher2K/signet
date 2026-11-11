import type { Bookmark } from "@signet/api";
import { getBookmarkHostname } from "@signet/core/bookmarks";
import { colors, radii } from "@signet/design-system/tokens.css";
import { useEffect, useState } from "react";
import { css, html } from "react-strict-dom";
import { Icon } from "./icon";

/** Bookmark artwork properties. */
export type BookmarkArtworkProps = {
  bookmark: Bookmark;
  expanded?: boolean;
};

type ArtworkStage = "favicon" | "fallback" | "image";

export const BookmarkArtwork = ({
  bookmark,
  expanded = false,
}: BookmarkArtworkProps) => {
  const [stage, setStage] = useState<ArtworkStage>(
    bookmark.image ? "image" : "favicon",
  );

  useEffect(() => {
    setStage(bookmark.image ? "image" : "favicon");
  }, [bookmark.id, bookmark.image, bookmark.url]);

  let faviconUrl = "";
  try {
    faviconUrl = `${new URL(bookmark.url).origin}/favicon.ico`;
  } catch {
    // The API validates URLs; keep the icon fallback for malformed cached data.
  }
  const source = stage === "image" ? bookmark.image : faviconUrl;

  return (
    <html.div style={[styles.frame, expanded && styles.expanded]}>
      {stage !== "fallback" && source ? (
        <html.img
          alt=""
          loading="lazy"
          onError={() =>
            setStage((current) =>
              current === "image" ? "favicon" : "fallback",
            )
          }
          referrerPolicy="no-referrer"
          src={source}
          style={styles.image}
        />
      ) : (
        <html.div
          aria-label={`${getBookmarkHostname(bookmark.url)} bookmark artwork`}
          role="img"
          style={styles.fallback}
        >
          <Icon name="bookmark" size={expanded ? 32 : 24} />
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
    flexShrink: 0,
    height: 88,
    overflow: "hidden",
    width: 88,
  },
  expanded: {
    height: 160,
    width: "100%",
  },
  image: {
    height: "100%",
    objectFit: "cover",
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    color: colors.primary,
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
});
