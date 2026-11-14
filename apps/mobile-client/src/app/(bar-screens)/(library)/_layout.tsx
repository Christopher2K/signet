import { useNativeTheme } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Stack } from "expo-router";

const LibraryLayout = () => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.background },
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: t("navigation.library") }} />
    </Stack>
  );
};

export default LibraryLayout;
