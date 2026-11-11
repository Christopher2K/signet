import {
  nativeFontFamily,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Stack } from "expo-router";

const AccountLayout = () => {
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
      <Stack.Screen
        name="account"
        options={{ title: t("navigation.account") }}
      />
    </Stack>
  );
};

export default AccountLayout;
