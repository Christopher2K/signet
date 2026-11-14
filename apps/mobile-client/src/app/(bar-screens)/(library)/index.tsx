import type { Bookmark } from "@signet/api";
import { getBookmarkError } from "@signet/core/bookmarks";
import { useBookmarks } from "@signet/core/bookmarks/react";
import { spacing, Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useLocale, useTranslation } from "@signet/locale/react";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { PlusIcon } from "phosphor-react-native/src/icons/Plus";
import { Alert, RefreshControl, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { css, html } from "react-strict-dom";
import { BookmarkCard } from "../../../features/library/components/bookmark-card";
import { LibraryState } from "../../../features/library/components/library-state";
import { TopNavigationBar } from "../../../features/navigation/components/top-navigation-bar";

const LibraryScreen = () => {
  const router = useRouter();
  const theme = useNativeTheme();
  const { locale } = useLocale();
  const { t } = useTranslation("mobile");
  const bookmarksQuery = useBookmarks();
  const scrollY = useSharedValue(0);
  const bookmarks = bookmarksQuery.data?.data ?? [];

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const handleCreate = () => router.push("/(stack-screens)/bookmark/create");
  const handleRetry = () => void bookmarksQuery.refetch();
  const handleOpen = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {
      Alert.alert(t("library.openErrorTitle"), t("library.openErrorMessage"));
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

  const bookmarkCount = t("library.bookmarkCount", {
    count: bookmarks.length,
    formattedCount: new Intl.NumberFormat(locale).format(bookmarks.length),
  });

  return (
    <>
      <TopNavigationBar
        largeTitle
        scrollY={scrollY}
        title={t("navigation.library")}
        trailingActions={[
          {
            accessibilityHint: t("navigation.createBookmarkHint"),
            accessibilityLabel: t("navigation.newBookmark"),
            icon: PlusIcon,
            onPress: handleCreate,
            prominent: true,
          },
        ]}
      />
      <Animated.FlatList
        contentContainerStyle={[
          styles.content,
          bookmarks.length === 0 && styles.emptyContent,
        ]}
        data={bookmarks}
        keyExtractor={(bookmark) => bookmark.id}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
              {t("library.allBookmarks")}
            </Typography>
            <Typography tone="secondary" variant="caption">
              {bookmarksQuery.isPending
                ? t("library.loadingLibrary")
                : `${bookmarkCount} · ${t("library.newestFirst")}`}
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
