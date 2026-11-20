import {
  nativeNavigationTitleStyle,
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
        headerLargeTitleStyle: {
          ...nativeNavigationTitleStyle,
          color: theme.text,
          fontSize: 32,
        },
        headerTintColor: theme.text,
        headerTitleStyle: nativeNavigationTitleStyle,
        headerUserInterfaceStyle: theme.dark ? "dark" : "light",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitleEnabled: true,
          title: t("navigation.library"),
        }}
      />
    </Stack>
  );
};

export default LibraryLayout;
