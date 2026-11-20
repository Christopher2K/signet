import {
  nativeFontFamily,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { NativeTabs } from "expo-router/native-tabs";

const AppLayout = () => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <NativeTabs
      backgroundColor={theme.surface}
      blurEffect="systemDefault"
      iconColor={{ default: theme.textSecondary, selected: theme.primary }}
      indicatorColor={theme.selection}
      badgeBackgroundColor="#FFFFFF"
      labelStyle={{
        default: {
          color: theme.textSecondary,
          fontFamily: nativeFontFamily,
          fontSize: 12,
        },
        selected: {
          color: theme.primary,
          fontFamily: nativeFontFamily,
          fontSize: 12,
          fontWeight: "600",
        },
      }}
      minimizeBehavior="never"
      rippleColor={theme.selection}
      tintColor={theme.primary}
    >
      <NativeTabs.Trigger name="(library)">
        <NativeTabs.Trigger.Label children={t("navigation.library")} />
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          sf="square.grid.2x2"
          src={require("../../../assets/images/squares-four.png")}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(account)">
        <NativeTabs.Trigger.Label children={t("navigation.account")} />
        <NativeTabs.Trigger.Icon
          renderingMode="template"
          sf="person"
          src={require("../../../assets/images/user.png")}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default AppLayout;
