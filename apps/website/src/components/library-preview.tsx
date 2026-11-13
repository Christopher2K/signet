import {
  CheckCircle,
  Folder,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
import { Typography } from "@signet/design-system";
import {
  colors,
  radii,
  spacing,
  typography,
} from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { landingStyles } from "#/components/landing-styles.css";
import { Logo } from "#/components/logo";

const artworkLabel = "OG";
const folders = [
  { key: "allBookmarks", count: 12 },
  { key: "work", count: 5 },
  { key: "reading", count: 4 },
  { key: "selfHosting", count: 3 },
] as const;

/** Bookmark preview properties. */
type BookmarkCardProps = {
  title: string;
  url: string;
  description: string;
  tags: string[];
  folder: string;
  pendingLabel?: string;
  /** Removes the separator above the first card. */
  first?: boolean;
};

const BookmarkCard = ({
  description,
  first = false,
  folder,
  pendingLabel,
  tags,
  title,
  url,
}: BookmarkCardProps) => {
  return (
    <html.article
      style={[styles.bookmarkCard, first ? styles.firstBookmark : null]}
    >
      <html.div style={styles.bookmarkArt}>
        <Typography style={styles.bookmarkArtLabel}>{artworkLabel}</Typography>
      </html.div>
      <html.div style={styles.bookmarkCopy}>
        <Typography as="h3" style={styles.bookmarkTitle}>
          {title}
        </Typography>
        <Typography as="p" variant="caption" style={styles.bookmarkUrl}>
          {url}
        </Typography>
        <Typography as="p" variant="caption" tone="secondary">
          {description}
        </Typography>
        <html.div style={styles.bookmarkTags}>
          {tags.map((tag) => (
            <Typography key={tag} variant="caption" style={styles.bookmarkTag}>
              {tag}
            </Typography>
          ))}
          {pendingLabel ? (
            <Typography
              variant="caption"
              style={[styles.bookmarkTag, styles.pendingTag]}
            >
              {pendingLabel}
            </Typography>
          ) : null}
        </html.div>
        <Typography as="p" variant="caption" tone="secondary">
          {folder}
        </Typography>
      </html.div>
    </html.article>
  );
};

export const LibraryPreview = () => {
  const { t } = useTranslation("web");

  return (
    <html.section
      aria-label={t("marketing.preview.label")}
      style={[landingStyles.pageShell, styles.preview]}
    >
      <html.div style={styles.topbar}>
        <html.div>
          <Logo compact />
        </html.div>
        <html.div style={styles.search}>
          <MagnifyingGlass size={18} aria-hidden="true" />
          <Typography
            variant="caption"
            tone="secondary"
            style={styles.searchLabel}
          >
            {t("marketing.preview.searchPlaceholder")}
          </Typography>
        </html.div>
        <html.span style={styles.syncStatus}>
          <html.span style={styles.syncIcon}>
            <CheckCircle size={16} weight="fill" aria-hidden="true" />
          </html.span>
          <Typography variant="caption" tone="secondary">
            {t("marketing.preview.synced")}
          </Typography>
        </html.span>
        <Typography variant="caption" style={styles.newButton}>
          {t("actions.newBookmark")}
        </Typography>
      </html.div>
      <html.div style={styles.body}>
        <html.aside style={styles.sidebar}>
          <Typography
            as="p"
            variant="caption"
            tone="secondary"
            style={styles.miniLabel}
          >
            {t("marketing.preview.collection")}
          </Typography>
          {folders.map((folder, index) => (
            <html.div
              key={folder.key}
              style={[
                styles.folderRow,
                index === 0 ? styles.folderRowActive : null,
              ]}
            >
              <Folder
                size={17}
                weight={index === 0 ? "fill" : "regular"}
                aria-hidden="true"
              />
              <Typography variant="caption">
                {t(`marketing.preview.${folder.key}`)}
              </Typography>
              <Typography variant="caption" tone="secondary">
                {folder.count}
              </Typography>
            </html.div>
          ))}
          <html.div style={styles.newFolder}>
            <Plus size={16} aria-hidden="true" />
            <Typography variant="caption" style={styles.newFolderLabel}>
              {t("marketing.preview.newFolder")}
            </Typography>
          </html.div>
        </html.aside>
        <html.div style={styles.content}>
          <html.div style={styles.contentHeader}>
            <Typography as="h2" variant="title" style={styles.contentTitle}>
              {t("marketing.preview.allBookmarks")}
            </Typography>
            <Typography variant="caption" tone="secondary">
              {t("marketing.preview.bookmarkCount")}
            </Typography>
          </html.div>
          <html.div style={styles.filters}>
            <Typography variant="caption" style={styles.filterChip}>
              {t("marketing.preview.work")}
            </Typography>
            <Typography variant="caption" style={styles.filterChip}>
              {t("marketing.preview.reading")}
            </Typography>
            <Typography variant="caption" style={styles.filterChip}>
              {t("marketing.preview.selfHosting")}
            </Typography>
          </html.div>
          <BookmarkCard
            first
            title={t("marketing.preview.firstTitle")}
            url="github.com/Christopher2K/signet"
            description={t("marketing.preview.firstDescription")}
            tags={[t("marketing.preview.work"), t("marketing.preview.reading")]}
            folder={t("marketing.preview.firstFolder")}
          />
          <BookmarkCard
            title={t("marketing.preview.secondTitle")}
            url="docs.docker.com/compose"
            description={t("marketing.preview.secondDescription")}
            tags={[
              t("marketing.preview.reference"),
              t("marketing.preview.selfHosting"),
            ]}
            folder={t("marketing.preview.secondFolder")}
            pendingLabel={t("marketing.preview.pendingSync")}
          />
        </html.div>
      </html.div>
    </html.section>
  );
};

const styles = css.create({
  preview: {
    overflow: "hidden",
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
  },
  topbar: {
    display: "grid",
    gridTemplateColumns: "auto minmax(240px, 1fr) auto auto",
    alignItems: "center",
    gap: spacing[6],
    padding: "20px 24px",
    borderBottomColor: colors.selection,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    "@media (min-width: 761px) and (max-width: 1024px)": {
      gridTemplateColumns: "auto 1fr auto",
    },
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr auto",
      gap: spacing[4],
      padding: spacing[4],
    },
  },
  search: {
    display: "flex",
    minHeight: 40,
    alignItems: "center",
    gap: spacing[3],
    padding: "8px 12px",
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.md,
    color: colors.textSecondary,
    "@media (max-width: 760px)": {
      gridColumn: "1 / -1",
      gridRow: 2,
      minWidth: 0,
    },
  },
  searchLabel: {
    minWidth: 0,
    "@media (max-width: 760px)": {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
  syncStatus: {
    display: "inline-flex",
    alignItems: "center",
    gap: spacing[2],
    whiteSpace: "nowrap",
    "@media (max-width: 1024px)": {
      display: "none",
    },
  },
  syncIcon: {
    display: "flex",
    color: colors.primary,
  },
  newButton: {
    padding: "10px 16px",
    borderRadius: radii.md,
    color: colors.onPrimary,
    backgroundColor: colors.primary,
    fontWeight: "700",
    whiteSpace: "nowrap",
    "@media (max-width: 480px)": {
      paddingInline: spacing[3],
    },
  },
  body: {
    display: "grid",
    gridTemplateColumns: "240px minmax(0, 1fr)",
    minHeight: 440,
    "@media (min-width: 761px) and (max-width: 1024px)": {
      gridTemplateColumns: "200px minmax(0, 1fr)",
    },
    "@media (max-width: 760px)": {
      display: "block",
      minHeight: 0,
    },
  },
  sidebar: {
    padding: "24px 16px",
    backgroundColor: colors.surfaceAlt,
    "@media (max-width: 760px)": {
      display: "none",
    },
  },
  miniLabel: {
    margin: "0 8px 16px",
    fontWeight: "700",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  folderRow: {
    display: "grid",
    gridTemplateColumns: "20px 1fr auto",
    alignItems: "center",
    gap: spacing[2],
    padding: "10px 12px",
    borderRadius: radii.md,
  },
  folderRowActive: {
    backgroundColor: colors.tag,
  },
  newFolder: {
    display: "flex",
    alignItems: "center",
    gap: spacing[2],
    marginTop: spacing[4],
    padding: "16px 12px 0",
    borderTopColor: colors.selection,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    color: colors.primary,
  },
  newFolderLabel: {
    color: colors.primary,
  },
  content: {
    minWidth: 0,
    padding: spacing[8],
    "@media (max-width: 760px)": {
      padding: "24px 16px",
    },
  },
  contentHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: spacing[4],
    "@media (max-width: 760px)": {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: spacing[1],
    },
  },
  contentTitle: {
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[2],
    marginBlock: "16px 24px",
  },
  filterChip: {
    padding: "3px 12px",
    borderRadius: radii.pill,
    color: colors.onTag,
    backgroundColor: colors.tag,
    lineHeight: 1.5,
  },
  bookmarkCard: {
    display: "grid",
    gridTemplateColumns: "72px minmax(0, 1fr)",
    gap: spacing[4],
    padding: 20,
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.card,
    marginTop: spacing[4],
    "@media (max-width: 760px)": {
      gridTemplateColumns: "48px minmax(0, 1fr)",
      gap: spacing[3],
      padding: spacing[4],
    },
  },
  firstBookmark: {
    marginTop: 0,
  },
  bookmarkArt: {
    display: "flex",
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.md,
    color: colors.accent,
    backgroundColor: colors.surfaceAlt,
    "@media (max-width: 760px)": {
      width: 48,
      height: 48,
    },
  },
  bookmarkArtLabel: {
    color: colors.accent,
    fontWeight: "700",
    "@media (max-width: 760px)": {
      fontSize: typography.captionSize,
    },
  },
  bookmarkCopy: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacing[1],
  },
  bookmarkTitle: {
    fontSize: typography.bodySize,
    fontWeight: "700",
    lineHeight: 1.4,
  },
  bookmarkUrl: {
    color: colors.primary,
  },
  bookmarkTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[2],
    marginBlock: spacing[1],
  },
  bookmarkTag: {
    padding: "3px 12px",
    borderRadius: radii.pill,
    color: colors.onTag,
    backgroundColor: colors.tag,
    lineHeight: 1.5,
  },
  pendingTag: {
    color: colors.onWarning,
    backgroundColor: colors.warning,
  },
});
