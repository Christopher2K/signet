import { spacing } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useHeaderHeight } from "expo-router/react-navigation";
import type { ReactNode } from "react";
import { Platform, StyleSheet, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";

/** Native bookmark editor screen properties. */
type BookmarkScreenLayoutProps = {
  children: ReactNode;
  dockedAction?: ReactNode;
};

export const BookmarkScreenLayout = ({
  children,
  dockedAction,
}: BookmarkScreenLayoutProps) => {
  const theme = useNativeTheme();
  const { bottom } = useSafeAreaInsets();
  const height = useHeaderHeight();

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop:
              nativeSpacing[4] + Platform.select({ ios: height, default: 0 }),
          },
        ]}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        style={[styles.scrollView, { backgroundColor: theme.background }]}
      >
        <html.div data-layoutconformance="strict" style={strictStyles.content}>
          {children}
        </html.div>
      </KeyboardAwareScrollView>
      {dockedAction ? (
        <KeyboardStickyView
          style={[
            styles.actionDock,
            { paddingBottom: bottom + nativeSpacing[4] },
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {dockedAction}
        </KeyboardStickyView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
  },
  scrollView: {
    flex: 1,
  },
  actionDock: {
    borderTopWidth: 1,
    padding: nativeSpacing[4],
    width: "100%",
  },
  content: {
    flexGrow: 1,
    padding: nativeSpacing[4],
  },
});

const strictStyles = css.create({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    width: "100%",
  },
});
