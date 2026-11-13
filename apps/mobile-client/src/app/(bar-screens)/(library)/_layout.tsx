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
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: nativeNavigationTitleStyle,
      }}
    >
      <Stack.Screen name="index" options={{ title: t("navigation.library") }} />
    </Stack>
  );
};

export default LibraryLayout;
