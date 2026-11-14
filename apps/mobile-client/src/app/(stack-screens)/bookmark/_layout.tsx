import { useNativeTheme } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Stack } from "expo-router";

const BookmarkLayout = () => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.background },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="create"
        options={{ title: t("navigation.newBookmark") }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: t("navigation.editBookmark") }}
      />
    </Stack>
  );
};

export default BookmarkLayout;
