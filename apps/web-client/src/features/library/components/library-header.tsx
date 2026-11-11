import { Button, Typography } from "@signet/design-system";
import { colors, spacing } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { useAuth } from "#/features/auth";
import { Icon } from "./icon";

/** Authenticated library header properties. */
export type LibraryHeaderProps = {
  onNewBookmark: () => void;
};

export const LibraryHeader = ({ onNewBookmark }: LibraryHeaderProps) => {
  const { t } = useTranslation("web");
  const { logout, state } = useAuth();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);
    await logout();
    setPending(false);
  };

  return (
    <html.header style={styles.header}>
      <html.div style={styles.brandGroup}>
        <html.div style={styles.brandMark}>
          <Icon name="bookmark" size={20} />
        </html.div>
        <Typography style={styles.brand} variant="title">
          Signet
        </Typography>
        <Typography style={styles.libraryLabel} tone="secondary">
          {t("library.header.library")}
        </Typography>
      </html.div>
      <html.div style={styles.account}>
        {state.status === "authenticated" ? (
          <Typography style={styles.email} tone="secondary" variant="caption">
            {state.user.email}
          </Typography>
        ) : null}
        <Button
          aria-label={t("actions.newBookmark")}
          onClick={onNewBookmark}
          size="sm"
        >
          <html.span style={styles.buttonContent}>
            <Icon name="plus" size={16} />
            <html.span style={styles.newLabel}>
              {t("actions.newBookmark")}
            </html.span>
            <html.span style={styles.newLabelMobile}>
              {t("actions.new")}
            </html.span>
          </html.span>
        </Button>
        <html.button
          aria-label={t("library.header.logOut")}
          disabled={pending}
          onClick={() => void handleLogout()}
          style={styles.logout}
          type="button"
        >
          <Icon name="sign-out" />
          <Typography style={styles.logoutLabel} variant="caption">
            {pending
              ? t("library.header.loggingOut")
              : t("library.header.logOut")}
          </Typography>
        </html.button>
      </html.div>
    </html.header>
  );
};

const styles = css.create({
  header: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[3],
    justifyContent: "space-between",
    paddingBlock: spacing[3],
    paddingInline: {
      default: spacing[6],
      "@media (max-width: 600px)": spacing[4],
    },
  },
  brandGroup: {
    alignItems: "center",
    display: "flex",
    gap: spacing[2],
  },
  brandMark: {
    color: colors.primaryActive,
  },
  brand: {
    color: colors.accent,
    fontWeight: "700",
  },
  libraryLabel: {
    borderLeftColor: colors.border,
    borderLeftStyle: "solid",
    borderLeftWidth: 1,
    display: {
      default: "flex",
      "@media (max-width: 480px)": "none",
    },
    marginLeft: spacing[2],
    paddingLeft: spacing[4],
  },
  account: {
    alignItems: "center",
    display: "flex",
    gap: spacing[3],
  },
  email: {
    display: {
      default: "flex",
      "@media (max-width: 800px)": "none",
    },
  },
  buttonContent: {
    alignItems: "center",
    display: "flex",
    gap: spacing[2],
  },
  newLabel: {
    display: {
      default: "flex",
      "@media (max-width: 480px)": "none",
    },
  },
  newLabelMobile: {
    display: {
      default: "none",
      "@media (max-width: 480px)": "flex",
    },
  },
  logoutLabel: {
    display: {
      default: "flex",
      "@media (max-width: 480px)": "none",
    },
  },
  logout: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    color: colors.text,
    cursor: "pointer",
    display: "flex",
    gap: spacing[2],
    minHeight: 36,
    paddingBlock: spacing[2],
    paddingInline: spacing[3],
  },
});
