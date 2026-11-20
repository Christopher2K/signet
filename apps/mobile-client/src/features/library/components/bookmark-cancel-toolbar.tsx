import { nativeFontFamily } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

export const BookmarkCancelToolbar = () => {
  const { t } = useTranslation("mobile");
  const router = useRouter();

  if (Platform.OS === "android") return null;

  return (
    <>
      <Stack.Header transparent />

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          style={{
            fontFamily: nativeFontFamily,
          }}
          variant="plain"
          onPress={() => router.back()}
        >
          {t("actions.cancel")}
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
    </>
  );
};
