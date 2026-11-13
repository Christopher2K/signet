import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";

const actionDockHeight = 80;

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

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.safeArea, { backgroundColor: theme.surface }]}
    >
      <KeyboardAwareScrollView
        bottomOffset={
          dockedAction ? actionDockHeight + nativeSpacing[4] : nativeSpacing[4]
        }
        contentContainerStyle={styles.content}
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
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          {dockedAction}
        </KeyboardStickyView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  actionDock: {
    borderTopWidth: 1,
    height: actionDockHeight,
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
    gap: nativeSpacing[4],
    width: "100%",
  },
});
