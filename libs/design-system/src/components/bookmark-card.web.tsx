import { css, html } from "react-strict-dom";
import { colors, radii, spacing } from "../tokens.css";
import { BookmarkArtwork } from "./bookmark-artwork";
import type { BookmarkCardProps } from "./bookmark-card.types";
import { Icon } from "./icon";
import { Typography } from "./typography";

export const BookmarkCard = ({
  bookmark,
  density = "medium",
  onEdit,
  strings,
}: BookmarkCardProps) => {
  const compact = density === "compact";
  const grid = density === "big";

  return (
    <html.article
      style={[styles.card, grid && styles.gridCard, compact && styles.compact]}
    >
      <BookmarkArtwork
        compact={compact}
        iconSources={bookmark.iconSources}
        label={strings.artwork}
        previewSources={grid ? bookmark.previewSources : []}
        variant={grid ? "banner" : "tile"}
      />
      <html.div style={styles.content}>
        <html.div style={styles.titleRow}>
          <html.a
            href={bookmark.url}
            rel="noreferrer"
            style={styles.titleLink}
            target="_blank"
          >
            <Typography as="h2" style={styles.title} variant="title">
              {bookmark.title}
            </Typography>
          </html.a>
          <html.div style={styles.actions}>
            <html.button
              aria-label={strings.editItem}
              onClick={() => onEdit(bookmark.id)}
              style={styles.iconButton}
              type="button"
            >
              <Icon name="pencil" />
            </html.button>
            <html.a
              aria-label={strings.openItem}
              href={bookmark.url}
              rel="noreferrer"
              style={styles.iconButton}
              target="_blank"
            >
              <Icon name="arrow-square-out" />
            </html.a>
          </html.div>
        </html.div>
        <Typography
          as="p"
          style={styles.url}
          tone="secondary"
          variant="caption"
        >
          {bookmark.hostname}
        </Typography>
        {!compact && bookmark.notes ? (
          <Typography as="p" style={styles.notes}>
            {bookmark.notes}
          </Typography>
        ) : null}
        {!compact && bookmark.tags.length > 0 ? (
          <html.div aria-label={strings.tags} style={styles.tags}>
            {bookmark.tags.map((tag) => (
              <Typography key={tag} style={styles.tag} variant="caption">
                {tag}
              </Typography>
            ))}
          </html.div>
        ) : null}
        {compact ? null : (
          <Typography as="p" tone="secondary" variant="caption">
            {strings.updatedOn
              ? `${strings.savedOn} · ${strings.updatedOn}`
              : strings.savedOn}
          </Typography>
        )}
      </html.div>
    </html.article>
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
    flexDirection: {
      default: "row",
      "@media (max-width: 480px)": "column",
    },
    gap: spacing[4],
    padding: spacing[4],
    width: "100%",
  },
  gridCard: {
    flexDirection: "column",
    flexGrow: 1,
    minWidth: 260,
    width: {
      default: "31%",
      "@media (max-width: 900px)": "47%",
      "@media (max-width: 600px)": "100%",
    },
  },
  compact: {
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    gap: spacing[3],
    padding: spacing[3],
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: spacing[2],
    minWidth: 0,
  },
  titleRow: {
    alignItems: "flex-start",
    display: "flex",
    gap: spacing[2],
    justifyContent: "space-between",
  },
  titleLink: {
    color: colors.text,
    flexGrow: 1,
    minWidth: 0,
    textDecoration: "none",
  },
  title: {
    overflowWrap: "anywhere",
  },
  actions: {
    display: "flex",
    flexShrink: 0,
    gap: spacing[1],
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: radii.md,
    boxSizing: "border-box",
    color: colors.primary,
    cursor: "pointer",
    display: "flex",
    height: 36,
    justifyContent: "center",
    padding: 0,
    textDecoration: "none",
    width: 36,
  },
  url: {
    overflowWrap: "anywhere",
  },
  notes: {
    lineHeight: 1.5,
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[2],
    marginBlock: spacing[1],
  },
  tag: {
    backgroundColor: colors.tag,
    borderRadius: radii.pill,
    boxSizing: "border-box",
    color: colors.onTag,
    paddingBlock: spacing[1],
    paddingInline: spacing[3],
  },
});
