import {
  nativeNavigationTitleStyle,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Stack } from "expo-router";
import { Platform } from "react-native";

const LibraryLayout = () => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.background },
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: nativeNavigationTitleStyle,
      }}
    >
      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          title: t("navigation.newBookmark"),
          animation: Platform.select({
            android: "fade_from_bottom",
            default: undefined,
          }),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "modal",
          title: t("navigation.editBookmark"),

          animation: Platform.select({
            android: "fade_from_bottom",
            default: undefined,
          }),
        }}
      />
    </Stack>
  );
};

export default LibraryLayout;
