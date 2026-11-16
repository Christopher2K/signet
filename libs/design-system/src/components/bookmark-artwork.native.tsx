import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";
import { useNativeTheme } from "../native-theme";
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
  const theme = useNativeTheme();
  const sources = [...previewSources, ...iconSources];
  const sourceKey = sources.join("|");
  const [fallback, setFallback] = useState<ArtworkFallback>({
    index: 0,
    key: sourceKey,
  });

  const sourceIndex = fallback.key === sourceKey ? fallback.index : 0;
  const source = sources[sourceIndex];
  const isPreview = sourceIndex < previewSources.length;
  const banner = variant === "banner";
  const iconSize = banner ? 64 : compact ? 16 : 24;

  return (
    <html.div
      style={[styles.frame, banner && styles.banner, compact && styles.compact]}
    >
      {source ? (
        <Image
          accessibilityLabel={label}
          contentFit={isPreview ? "cover" : "contain"}
          onError={() =>
            setFallback({ index: sourceIndex + 1, key: sourceKey })
          }
          source={{ uri: source }}
          style={banner && !isPreview ? nativeStyles.banner : nativeStyles.fill}
        />
      ) : (
        <html.div style={styles.fallback}>
          <Icon color={theme.primary} name="bookmark" size={iconSize} />
        </html.div>
      )}
    </html.div>
  );
};

const nativeStyles = StyleSheet.create({
  banner: {
    height: 64,
    width: 64,
  },
  fill: {
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
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
    width: 40,
  },
  banner: {
    /* 1200 × 630 Open Graph ratio, so OG images fill the banner uncropped. */
    aspectRatio: 1.9047619047619047,
    height: "auto",
    width: "100%",
  },
  compact: {
    borderRadius: radii.sm,
    height: 24,
    width: 24,
  },
  fallback: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    padding: spacing[1],
    width: "100%",
  },
});
