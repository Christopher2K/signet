import type { Bookmark } from "@signet/api";
import {
  formatBookmarkDate,
  getBookmarkCardModel,
  getBookmarkError,
} from "@signet/core/bookmarks";
import { useBookmarkDensity, useBookmarks } from "@signet/core/bookmarks/react";
import { BookmarkCard, spacing, Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useLocale, useTranslation } from "@signet/locale/react";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { PlusIcon } from "phosphor-react-native/src/icons/Plus";
import { Alert, RefreshControl, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { css, html } from "react-strict-dom";
import { DensityToggle } from "../../../features/library/components/density-toggle";
import { LibraryState } from "../../../features/library/components/library-state";
import { TopNavigationBar } from "../../../features/navigation/components/top-navigation-bar";

const LibraryScreen = () => {
  const router = useRouter();
  const theme = useNativeTheme();
  const { locale } = useLocale();
  const { t } = useTranslation("mobile");
  const bookmarksQuery = useBookmarks();
  const { density, setDensity } = useBookmarkDensity();
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

  const renderBookmark = ({ item }: { item: Bookmark }) => {
    const bookmark = getBookmarkCardModel(item);

    return (
      <BookmarkCard
        bookmark={bookmark}
        density={density}
        onEdit={(id) =>
          router.push({ pathname: "/bookmark/[id]", params: { id } })
        }
        onOpen={(url) => void handleOpen(url)}
        strings={{
          artwork: t("library.artwork", { hostname: bookmark.hostname }),
          edit: t("actions.edit"),
          editItem: t("library.itemEdit", { title: bookmark.title }),
          open: t("actions.open"),
          openItem: t("library.itemOpen", { title: bookmark.title }),
          savedOn: t("library.savedOn", {
            date:
              formatBookmarkDate(bookmark.createdAt, locale) ??
              t("library.dateUnavailable"),
          }),
          tags: t("library.tags"),
        }}
      />
    );
  };

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
      {bookmarks.length > 0 ? (
        <View
          style={[
            styles.toolbar,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <DensityToggle density={density} onChange={setDensity} />
        </View>
      ) : null}
      <Animated.FlatList
        contentContainerStyle={[
          styles.content,
          density === "compact" && styles.compactContent,
          bookmarks.length === 0 && styles.emptyContent,
        ]}
        data={bookmarks}
        extraData={density}
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
  compactContent: {
    gap: nativeSpacing[2],
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: nativeSpacing[2],
  },
  toolbar: {
    alignItems: "flex-end",
    borderBottomWidth: 1,
    paddingHorizontal: nativeSpacing[4],
    paddingVertical: nativeSpacing[2],
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
