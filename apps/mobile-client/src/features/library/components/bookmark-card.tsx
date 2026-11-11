import type { Bookmark } from "@signet/api";
import { getBookmarkHostname } from "@signet/core/bookmarks";
import {
  Button,
  colors,
  radii,
  spacing,
  Typography,
} from "@signet/design-system";
import { useLocale, useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { BookmarkArtwork } from "./bookmark-artwork";

/** Native bookmark card properties. */
type BookmarkCardProps = {
  bookmark: Bookmark;
  onEdit: (id: string) => void;
  onOpen: (url: string) => void;
};

const formatDate = (value: string, locale: string): string | undefined => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? undefined
    : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
};

export const BookmarkCard = ({
  bookmark,
  onEdit,
  onOpen,
}: BookmarkCardProps) => {
  const { locale } = useLocale();
  const { t } = useTranslation("mobile");
  const edited = bookmark.updatedAt !== bookmark.createdAt;

  return (
    <html.div data-layoutconformance="strict" style={styles.card}>
      <html.div style={styles.summary}>
        <BookmarkArtwork bookmark={bookmark} />
        <html.div style={styles.heading}>
          <Typography as="h2" style={styles.title} variant="title">
            {bookmark.title}
          </Typography>
          <Typography tone="secondary" variant="caption">
            {getBookmarkHostname(bookmark.url)}
          </Typography>
        </html.div>
      </html.div>
      {bookmark.notes ? (
        <Typography style={styles.notes}>{bookmark.notes}</Typography>
      ) : null}
      {bookmark.tags.length > 0 ? (
        <html.div aria-label={t("library.tags")} style={styles.tags}>
          {bookmark.tags.map((tag) => (
            <Typography key={tag} style={styles.tag} variant="caption">
              {tag}
            </Typography>
          ))}
        </html.div>
      ) : null}
      <Typography tone="secondary" variant="caption">
        {t("library.savedOn", {
          date:
            formatDate(bookmark.createdAt, locale) ??
            t("library.dateUnavailable"),
        })}
        {edited
          ? ` · ${t("library.updatedOn", {
              date:
                formatDate(bookmark.updatedAt, locale) ??
                t("library.dateUnavailable"),
            })}`
          : ""}
      </Typography>
      <html.div style={styles.actions}>
        <Button
          onClick={() => onOpen(bookmark.url)}
          size="sm"
          style={styles.action}
        >
          {t("actions.open")}
        </Button>
        <Button
          onClick={() => onEdit(bookmark.id)}
          size="sm"
          style={styles.action}
          variant="secondary"
        >
          {t("actions.edit")}
        </Button>
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
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
    padding: spacing[4],
  },
  summary: {
    alignItems: "flex-start",
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
    color: colors.onTag,
    paddingBlock: spacing[1],
    paddingInline: spacing[3],
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    gap: spacing[3],
    marginTop: spacing[1],
  },
  action: {
    flexGrow: 1,
  },
});
