import type { MenuAction } from "@expo/ui/community/menu";
import type { Bookmark } from "@signet/api";
import {
  bookmarkDensities,
  formatBookmarkDate,
  getBookmarkCardModel,
  getBookmarkError,
  isBookmarkDensity,
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
import { DotsThreeIcon } from "phosphor-react-native/src/icons/DotsThree";
import { PlusIcon } from "phosphor-react-native/src/icons/Plus";
import { Alert, RefreshControl, StyleSheet } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { css, html } from "react-strict-dom";
import { LibraryState } from "../../../features/library/components/library-state";
import { TopNavigationBar } from "../../../features/navigation/components/top-navigation-bar";
import type { TopNavigationBarAction } from "../../../features/navigation/components/top-navigation-bar-action";

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

  const densityActions = bookmarkDensities.map(
    (option): MenuAction => ({
      id: option,
      state: option === density ? "on" : "off",
      title: t(`library.density.${option}`),
      titleColor: theme.accent,
    }),
  );

  const newBookmarkAction: TopNavigationBarAction = {
    accessibilityLabel: t("navigation.newBookmark"),
    icon: PlusIcon,
    onPress: handleCreate,
    prominent: true,
  };

  const densityAction: TopNavigationBarAction = {
    accessibilityLabel: t("library.density.label"),
    icon: DotsThreeIcon,
    menu: {
      actions: densityActions,
      onPressAction: ({ nativeEvent }) => {
        if (isBookmarkDensity(nativeEvent.event)) {
          setDensity(nativeEvent.event);
        }
      },
      title: t("library.density.label"),
    },
  };

  const trailingActions: TopNavigationBarAction[] =
    bookmarks.length > 0
      ? [densityAction, newBookmarkAction]
      : [newBookmarkAction];

  return (
    <>
      <TopNavigationBar
        largeTitle
        scrollY={scrollY}
        title={t("navigation.library")}
        trailingActions={trailingActions}
      />
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
});

const strictStyles = css.create({
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[1],
  },
});

export default LibraryScreen;
