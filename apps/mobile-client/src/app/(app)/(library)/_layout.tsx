import {
  nativeFontFamily,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { Stack } from "expo-router";

const LibraryLayout = () => {
  const theme = useNativeTheme();

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
      <Stack.Screen name="index" options={{ title: "Library" }} />
      <Stack.Screen
        name="create"
        options={{ presentation: "modal", title: "New Bookmark" }}
      />
      <Stack.Screen
        name="bookmark/[id]"
        options={{ presentation: "modal", title: "Edit Bookmark" }}
      />
    </Stack>
  );
};

export default LibraryLayout;
