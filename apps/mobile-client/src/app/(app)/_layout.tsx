import {
  nativeFontFamily,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { NativeTabs } from "expo-router/native-tabs";

const AppLayout = () => {
  const theme = useNativeTheme();

  return (
    <NativeTabs
      backgroundColor={theme.surface}
      blurEffect="systemDefault"
      iconColor={{ default: theme.textSecondary, selected: theme.primary }}
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
      tintColor={theme.primary}
    >
      <NativeTabs.Trigger name="(library)">
        <NativeTabs.Trigger.Label children="Library" />
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" md="grid_view" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(account)">
        <NativeTabs.Trigger.Label children="Account" />
        <NativeTabs.Trigger.Icon sf="person" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default AppLayout;
