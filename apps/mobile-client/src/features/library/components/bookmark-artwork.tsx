import type { Bookmark } from "@signet/api";
import { getBookmarkHostname } from "@signet/core/bookmarks";
import { colors, radii, spacing } from "@signet/design-system";
import { useNativeTheme } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";
import { BookmarkIcon } from "./bookmark-icon";

/** Bookmark artwork properties. */
type BookmarkArtworkProps = {
  bookmark: Bookmark;
};

type ArtworkStage = "favicon" | "fallback" | "image";

export const BookmarkArtwork = ({ bookmark }: BookmarkArtworkProps) => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");
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
    <html.div style={styles.frame}>
      {stage !== "fallback" && source ? (
        <Image
          accessibilityLabel={t("library.artwork", {
            hostname: getBookmarkHostname(bookmark.url),
          })}
          contentFit="cover"
          onError={() =>
            setStage((current) =>
              current === "image" ? "favicon" : "fallback",
            )
          }
          source={{ uri: source }}
          style={nativeStyles.image}
        />
      ) : (
        <html.div style={styles.fallback}>
          <BookmarkIcon color={theme.primary} name="bookmark" />
        </html.div>
      )}
    </html.div>
  );
};

const nativeStyles = StyleSheet.create({
  image: {
    height: "100%",
    width: "100%",
  },
});

const styles = css.create({
  frame: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexShrink: 0,
    height: 72,
    justifyContent: "center",
    overflow: "hidden",
    width: 72,
  },
  fallback: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    padding: spacing[4],
    width: "100%",
  },
});
