import {
  nativeFontFamily,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

const cancelIcon = Platform.select({
  ios: undefined,
  default: require("../../../../assets/images/close.xml"),
});

export const BookmarkCancelToolbar = () => {
  const router = useRouter();
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <Stack.Toolbar placement="left">
      <Stack.Toolbar.Button
        accessibilityLabel={t("actions.cancel")}
        hidesSharedBackground
        icon={cancelIcon}
        onPress={() => router.back()}
        style={{ fontFamily: nativeFontFamily }}
        tintColor={theme.danger}
      >
        {t("actions.cancel")}
      </Stack.Toolbar.Button>
    </Stack.Toolbar>
  );
};
