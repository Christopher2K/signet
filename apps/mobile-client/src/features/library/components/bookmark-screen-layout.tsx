import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";

/** Native bookmark editor screen properties. */
type BookmarkScreenLayoutProps = {
  children: ReactNode;
};

export const BookmarkScreenLayout = ({
  children,
}: BookmarkScreenLayoutProps) => {
  const theme = useNativeTheme();

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <html.div
            data-layoutconformance="strict"
            style={strictStyles.content}
          >
            {children}
          </html.div>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
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
