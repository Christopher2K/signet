import {
  nativeFontFamily,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Stack } from "expo-router";

const LibraryLayout = () => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.background },
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontFamily: nativeFontFamily,
          fontSize: 15,
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: t("navigation.library") }} />
      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          title: t("navigation.newBookmark"),
        }}
      />
      <Stack.Screen
        name="bookmark/[id]"
        options={{
          presentation: "modal",
          title: t("navigation.editBookmark"),
        }}
      />
    </Stack>
  );
};

export default LibraryLayout;
