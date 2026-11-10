import { Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { type ReactNode, useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";

/** Shared native authentication screen properties. */
type AuthScreenLayoutProps = {
  children: ReactNode;
  title: string;
};

export const AuthScreenLayout = ({
  children,
  title,
}: AuthScreenLayoutProps) => {
  const theme = useNativeTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            keyboardVisible && styles.scrollContentKeyboardVisible,
          ]}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          <html.div
            data-layoutconformance="strict"
            style={strictStyles.content}
          >
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
            <Typography as="h1" variant="headline">
              {title}
            </Typography>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: nativeSpacing[4],
  },
  scrollContentKeyboardVisible: {
    justifyContent: "flex-start",
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
    marginBottom: nativeSpacing[6],
  },
  brandName: {
    fontWeight: "700",
  },
});
