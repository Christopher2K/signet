import { Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import type { ReactNode } from "react";
import { Image, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";

/** Shared native authentication screen properties. */
type AuthScreenLayoutProps = {
  children: ReactNode;
};

export const AuthScreenLayout = ({ children }: AuthScreenLayoutProps) => {
  const theme = useNativeTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAwareScrollView
        bottomOffset={nativeSpacing[4]}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
        <html.div data-layoutconformance="strict" style={strictStyles.content}>
          <html.div style={strictStyles.brand}>
            <Image
              accessible={false}
              source={
                theme.dark
                  ? require("../../../../assets/images/signet-logo-dark.png")
                  : require("../../../../assets/images/signet-logo-light.png")
              }
              style={styles.logo}
            />
            <Typography as="p" style={strictStyles.brandName} variant="title">
              Signet
            </Typography>
          </html.div>
          {children}
        </html.div>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: nativeSpacing[4],
  },
  logo: {
    height: 48,
    width: 48,
  },
});

const strictStyles = css.create({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: nativeSpacing[6],
    width: "100%",
  },
  brand: {
    alignItems: "center",
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    gap: nativeSpacing[2],
  },
  brandName: {
    fontWeight: "700",
  },
});
