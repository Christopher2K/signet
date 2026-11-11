import type { Bookmark } from "@signet/api";
import { getBookmarkError } from "@signet/core/bookmarks";
import { useBookmarks } from "@signet/core/bookmarks/react";
import { spacing, Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { css, html } from "react-strict-dom";
import { BookmarkCard } from "../../../features/library/components/bookmark-card";
import { LibraryState } from "../../../features/library/components/library-state";

const newBookmarkIcon = Platform.select({
  ios: "plus" as const,
  default: require("../../../../assets/images/plus.png"),
});

const LibraryScreen = () => {
  const router = useRouter();
  const theme = useNativeTheme();
  const bookmarksQuery = useBookmarks();
  const bookmarks = bookmarksQuery.data?.data ?? [];

  const handleCreate = () => router.push("/create");
  const handleRetry = () => void bookmarksQuery.refetch();
  const handleOpen = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      Alert.alert(
        "Couldn't open bookmark",
        "Your device could not open this link. Please try again.",
      );
    }
  };

  const renderBookmark = ({ item }: { item: Bookmark }) => (
    <BookmarkCard
      bookmark={item}
      onEdit={(id) =>
        router.push({ pathname: "/bookmark/[id]", params: { id } })
      }
      onOpen={(url) => void handleOpen(url)}
    />
  );

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          accessibilityHint="Create a bookmark"
          accessibilityLabel="New Bookmark"
          icon={newBookmarkIcon}
          onPress={handleCreate}
          tintColor={theme.primary}
          variant="prominent"
        />
      </Stack.Toolbar>
      <FlatList
        contentContainerStyle={[
          styles.content,
          bookmarks.length === 0 && styles.emptyContent,
        ]}
        data={bookmarks}
        keyExtractor={(bookmark) => bookmark.id}
        ListEmptyComponent={
          <LibraryState
            error={
              bookmarksQuery.isError && bookmarks.length === 0
                ? getBookmarkError(bookmarksQuery.error).message
                : undefined
            }
            loading={bookmarksQuery.isPending}
            onRetry={handleRetry}
          />
        }
        ListHeaderComponent={
          <html.div
            data-layoutconformance="strict"
            style={strictStyles.heading}
          >
            <Typography as="h1" variant="title">
              All Bookmarks
            </Typography>
            <Typography tone="secondary" variant="caption">
              {bookmarksQuery.isPending
                ? "Loading your library"
                : `${bookmarks.length} ${bookmarks.length === 1 ? "bookmark" : "bookmarks"} · Newest first`}
            </Typography>
          </html.div>
        }
        ListHeaderComponentStyle={styles.header}
        refreshControl={
          <RefreshControl
            colors={[theme.primary]}
            onRefresh={handleRetry}
            refreshing={bookmarksQuery.isRefetching}
            tintColor={theme.primary}
          />
        }
        renderItem={renderBookmark}
        style={{ backgroundColor: theme.background }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: nativeSpacing[4],
    padding: nativeSpacing[4],
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: nativeSpacing[2],
  },
});

const strictStyles = css.create({
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[1],
  },
});

export default LibraryScreen;
