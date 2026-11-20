import { useAuth } from "@signet/core/auth/react";
import { Button, spacing, Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { css, html } from "react-strict-dom";

const AccountScreen = () => {
  const { logout, state } = useAuth();
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    try {
      await logout();
    } finally {
      setPending(false);
    }
  };

  if (state.status !== "authenticated") {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      style={{ backgroundColor: theme.background }}
    >
      <html.div data-layoutconformance="strict" style={strictStyles.content}>
        <html.div style={strictStyles.identity}>
          <Typography tone="secondary" variant="caption">
            {t("account.signedInAs")}
          </Typography>
          <Typography>{state.user.email}</Typography>
        </html.div>
        <Button
          disabled={pending}
          onClick={() => void handleLogout()}
          size="lg"
          style={strictStyles.logout}
          variant="secondary"
        >
          {pending ? t("account.loggingOut") : t("account.logOut")}
        </Button>
      </html.div>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: nativeSpacing[4],
  },
});

const strictStyles = css.create({
  content: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
  },
  identity: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  logout: {
    alignSelf: "stretch",
    borderRadius: 12,
  },
});

export default AccountScreen;
