import type { Bookmark } from "@signet/api";
import {
  bookmarkDensities,
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
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";
import { LibraryState } from "../../../features/library/components/library-state";

const displayIcon = Platform.select({
  ios: "ellipsis" as const,
  default: require("../../../../assets/images/dots-three.xml"),
});
const newBookmarkIcon = Platform.select({
  ios: "plus" as const,
  default: require("../../../../assets/images/plus.xml"),
});

const LibraryScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useNativeTheme();
  const { locale } = useLocale();
  const { t } = useTranslation("mobile");
  const bookmarksQuery = useBookmarks();
  const { density, setDensity } = useBookmarkDensity();
  const bookmarks = bookmarksQuery.data?.data ?? [];
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
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu
          accessibilityLabel={t("library.display")}
          hidden={bookmarks.length === 0}
          icon={displayIcon}
          tintColor={theme.primary}
        >
          <Stack.Toolbar.Menu title={t("library.display")}>
            {bookmarkDensities.map((option) => (
              <Stack.Toolbar.MenuAction
                isOn={option === density}
                key={option}
                onPress={() => setDensity(option)}
              >
                {t(`library.density.${option}`)}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Button
          accessibilityHint={t("navigation.createBookmarkHint")}
          accessibilityLabel={t("navigation.newBookmark")}
          icon={newBookmarkIcon}
          onPress={handleCreate}
          tintColor={theme.primary}
          variant="prominent"
        />
      </Stack.Toolbar>
      <FlatList
        contentContainerStyle={[
          styles.content,
          {
            paddingLeft: nativeSpacing[4] + insets.left,
            paddingRight: nativeSpacing[4] + insets.right,
          },
          density === "compact" && styles.compactContent,
          bookmarks.length === 0 && styles.emptyContent,
        ]}
        contentInsetAdjustmentBehavior="automatic"
        data={bookmarks}
        extraData={density}
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
