import { css, html } from "react-strict-dom";
import { useNativeTheme } from "../native-theme";
import { colors, radii, spacing } from "../tokens.css";
import { BookmarkArtwork } from "./bookmark-artwork";
import type { BookmarkCardProps } from "./bookmark-card.types";
import { Button } from "./button";
import { Icon } from "./icon";
import { Typography } from "./typography";

export const BookmarkCard = ({
  bookmark,
  density = "medium",
  onEdit,
  onOpen,
  strings,
}: BookmarkCardProps) => {
  const theme = useNativeTheme();

  if (density === "compact") {
    return (
      <html.div
        data-layoutconformance="strict"
        style={[styles.card, styles.compactCard]}
      >
        <BookmarkArtwork
          compact
          iconSources={bookmark.iconSources}
          label={strings.artwork}
        />
        <html.div style={[styles.heading, styles.compactHeading]}>
          <Typography as="h2" style={styles.compactTitle}>
            {bookmark.title}
          </Typography>
          <Typography tone="secondary" variant="caption">
            {bookmark.hostname}
          </Typography>
        </html.div>
        <html.div style={styles.compactActions}>
          <html.button
            aria-label={strings.openItem}
            onClick={() => onOpen?.(bookmark.url)}
            style={styles.iconButton}
            type="button"
          >
            <Icon color={theme.primary} name="arrow-square-out" size={18} />
          </html.button>
          <html.button
            aria-label={strings.editItem}
            onClick={() => onEdit(bookmark.id)}
            style={styles.iconButton}
            type="button"
          >
            <Icon color={theme.primary} name="pencil" size={18} />
          </html.button>
        </html.div>
      </html.div>
    );
  }

  return (
    <html.div data-layoutconformance="strict" style={styles.card}>
      {density === "big" ? (
        <BookmarkArtwork
          iconSources={bookmark.iconSources}
          label={strings.artwork}
          previewSources={bookmark.previewSources}
          variant="banner"
        />
      ) : null}
      <html.div style={styles.summary}>
        {density === "medium" ? (
          <BookmarkArtwork
            iconSources={bookmark.iconSources}
            label={strings.artwork}
          />
        ) : null}
        <html.div style={styles.heading}>
          <Typography as="h2" style={styles.title} variant="title">
            {bookmark.title}
          </Typography>
          <Typography tone="secondary" variant="caption">
            {bookmark.hostname}
          </Typography>
        </html.div>
      </html.div>
      {bookmark.notes ? (
        <Typography style={styles.notes}>{bookmark.notes}</Typography>
      ) : null}
      {bookmark.tags.length > 0 ? (
        <html.div aria-label={strings.tags} style={styles.tags}>
          {bookmark.tags.map((tag) => (
            <Typography key={tag} style={styles.tag} variant="caption">
              {tag}
            </Typography>
          ))}
        </html.div>
      ) : null}
      <html.div style={styles.footer}>
        <Typography style={styles.dates} tone="secondary" variant="caption">
          {strings.savedOn}
        </Typography>
        <html.div style={styles.actions}>
          <Button onClick={() => onOpen?.(bookmark.url)} size="sm">
            {strings.open}
          </Button>
          <Button
            onClick={() => onEdit(bookmark.id)}
            size="sm"
            variant="secondary"
          >
            {strings.edit}
          </Button>
        </html.div>
      </html.div>
    </html.div>
  );
};

const styles = css.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
    padding: spacing[3],
  },
  compactCard: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    gap: spacing[3],
    paddingBlock: spacing[2],
    paddingInline: spacing[3],
  },
  compactTitle: {
    fontWeight: "700",
    lineClamp: 1,
    lineHeight: 1.35,
  },
  summary: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: spacing[3],
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  compactHeading: {
    gap: 0,
  },
  title: {
    lineHeight: 1.35,
  },
  notes: {
    lineHeight: 1.5,
  },
  tags: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  tag: {
    backgroundColor: colors.tag,
    borderRadius: radii.pill,
    boxSizing: "border-box",
    color: colors.onTag,
    paddingBlock: spacing[1],
    paddingInline: spacing[3],
  },
  footer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    justifyContent: "space-between",
  },
  dates: {
    flexShrink: 1,
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 0,
    gap: spacing[2],
  },
  compactActions: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 0,
    gap: spacing[1],
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    display: "flex",
    height: 40,
    justifyContent: "center",
    padding: 0,
    width: 40,
  },
});
