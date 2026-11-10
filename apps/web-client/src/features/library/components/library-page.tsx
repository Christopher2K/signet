import type { Bookmark } from "@signet/api";
import { Button, Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { getBookmarkError } from "../bookmark-errors";
import { useBookmarks } from "../use-bookmarks";
import { BookmarkCard, type BookmarkView } from "./bookmark-card";
import { CreateBookmarkDialog } from "./create-bookmark-dialog";
import { DeleteBookmarkDialog } from "./delete-bookmark-dialog";
import { EditBookmarkDialog } from "./edit-bookmark-dialog";
import { Icon } from "./icon";
import { LibraryHeader } from "./library-header";

export const LibraryPage = () => {
  const bookmarksQuery = useBookmarks();
  const [view, setView] = useState<BookmarkView>("list");
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string>();
  const [deleting, setDeleting] = useState<Bookmark>();
  const bookmarks = bookmarksQuery.data?.data ?? [];

  const handleOpenExisting = (id: string) => {
    setCreating(false);
    setEditId(id);
  };

  const handleDelete = (bookmark: Bookmark) => {
    setEditId(undefined);
    setDeleting(bookmark);
  };

  const handleCancelDelete = () => {
    if (deleting) {
      setEditId(deleting.id);
    }
    setDeleting(undefined);
  };

  return (
    <html.div style={styles.shell}>
      <LibraryHeader onNewBookmark={() => setCreating(true)} />
      <html.main style={styles.main}>
        <html.div style={styles.headingRow}>
          <html.div style={styles.heading}>
            <Typography as="h1" variant="headline">
              All Bookmarks
            </Typography>
            <Typography as="p" tone="secondary" variant="caption">
              {bookmarksQuery.isPending
                ? "Loading your library"
                : `${bookmarks.length} ${bookmarks.length === 1 ? "bookmark" : "bookmarks"} · Newest first`}
            </Typography>
          </html.div>
          <html.div
            aria-label="Bookmark layout"
            role="group"
            style={styles.viewToggle}
          >
            <html.button
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              style={[
                styles.viewButton,
                view === "list" && styles.viewSelected,
              ]}
              type="button"
            >
              <Icon name="list" />
              <Typography variant="caption">List</Typography>
            </html.button>
            <html.button
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              style={[
                styles.viewButton,
                view === "grid" && styles.viewSelected,
              ]}
              type="button"
            >
              <Icon name="grid" />
              <Typography variant="caption">Grid</Typography>
            </html.button>
          </html.div>
        </html.div>

        {bookmarksQuery.isPending ? (
          <html.section aria-busy={true} style={styles.list}>
            <Typography role="status" tone="secondary">
              Loading bookmarks…
            </Typography>
            {[0, 1, 2].map((item) => (
              <html.div key={item} style={styles.skeleton}>
                <html.div style={styles.skeletonArtwork} />
                <html.div style={styles.skeletonText}>
                  <html.div style={styles.skeletonTitle} />
                  <html.div style={styles.skeletonLine} />
                  <html.div style={styles.skeletonLine} />
                </html.div>
              </html.div>
            ))}
          </html.section>
        ) : bookmarksQuery.isError ? (
          <html.section role="alert" style={styles.state}>
            <Typography as="h2" variant="title">
              Couldn't load your bookmarks
            </Typography>
            <Typography as="p" style={styles.stateMessage} tone="secondary">
              {getBookmarkError(bookmarksQuery.error).message}
            </Typography>
            <Button onClick={() => void bookmarksQuery.refetch()}>
              Try again
            </Button>
          </html.section>
        ) : bookmarks.length === 0 ? (
          <html.section style={styles.empty}>
            <html.div style={styles.emptyIcon}>
              <Icon name="bookmark" size={32} />
            </html.div>
            <Typography as="h2" variant="headline">
              No bookmarks yet
            </Typography>
            <Typography as="p" style={styles.stateMessage} tone="secondary">
              Add your first bookmark by link. Your notes and tags will live
              here too.
            </Typography>
            <Button onClick={() => setCreating(true)} size="lg">
              New Bookmark
            </Button>
          </html.section>
        ) : (
          <html.section
            aria-label="Saved bookmarks"
            style={[styles.list, view === "grid" && styles.grid]}
          >
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                bookmark={bookmark}
                key={bookmark.id}
                onEdit={setEditId}
                view={view}
              />
            ))}
          </html.section>
        )}
      </html.main>

      {creating ? (
        <CreateBookmarkDialog
          onClose={() => setCreating(false)}
          onOpenExisting={handleOpenExisting}
        />
      ) : null}
      {editId ? (
        <EditBookmarkDialog
          id={editId}
          onClose={() => setEditId(undefined)}
          onDelete={handleDelete}
        />
      ) : null}
      {deleting ? (
        <DeleteBookmarkDialog
          bookmark={deleting}
          onCancel={handleCancelDelete}
          onDeleted={() => setDeleting(undefined)}
        />
      ) : null}
    </html.div>
  );
};

const styles = css.create({
  shell: {
    backgroundColor: colors.background,
    minHeight: "100vh",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
    marginInline: "auto",
    maxWidth: 1280,
    padding: {
      default: spacing[8],
      "@media (max-width: 600px)": spacing[4],
    },
    width: "100%",
  },
  headingRow: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[4],
    justifyContent: "space-between",
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  viewToggle: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    padding: spacing[1],
  },
  viewButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: radii.sm,
    color: colors.textSecondary,
    cursor: "pointer",
    display: "flex",
    gap: spacing[2],
    minHeight: 36,
    paddingBlock: spacing[2],
    paddingInline: spacing[3],
  },
  viewSelected: {
    backgroundColor: colors.selection,
    color: colors.onSelection,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
  grid: {
    alignItems: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skeleton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    gap: spacing[4],
    opacity: 0.65,
    padding: spacing[4],
  },
  skeletonArtwork: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    height: 88,
    width: 88,
  },
  skeletonText: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: spacing[3],
  },
  skeletonTitle: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    height: 20,
    width: "70%",
  },
  skeletonLine: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    height: 12,
    width: "90%",
  },
  state: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    padding: spacing[12],
    textAlign: "center",
  },
  empty: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "dashed",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    padding: {
      default: spacing[12],
      "@media (max-width: 600px)": spacing[6],
    },
    textAlign: "center",
  },
  emptyIcon: {
    color: colors.primary,
  },
  stateMessage: {
    lineHeight: 1.5,
    maxWidth: 520,
  },
});
