import { Typography } from "@signet/design-system";
import { colors, spacing, typography } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { ActionLink } from "#/components/action-link";
import { landingStyles } from "#/components/landing-styles.css";
import { Logo } from "#/components/logo";

export const SiteHeader = () => {
  const { t } = useTranslation("web");

  return (
    <html.header style={[landingStyles.pageShell, styles.header]}>
      <html.a href="#top" aria-label="Signet" style={styles.brandLink}>
        <Logo />
      </html.a>
      <html.nav aria-label={t("marketing.nav.features")} style={styles.nav}>
        <html.a href="#features" style={styles.navLink}>
          <Typography variant="caption" style={styles.navLabel}>
            {t("marketing.nav.features")}
          </Typography>
        </html.a>
        <html.a href="#how-it-works" style={styles.navLink}>
          <Typography variant="caption" style={styles.navLabel}>
            {t("marketing.nav.howItWorks")}
          </Typography>
        </html.a>
      </html.nav>
      <ActionLink
        href="#self-host"
        size="sm"
        variant="outline"
        style={styles.action}
      >
        {t("marketing.nav.selfHost")}
      </ActionLink>
    </html.header>
  );
};

const styles = css.create({
  header: {
    display: "grid",
    minHeight: 88,
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: spacing[8],
    borderBottomColor: colors.selection,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr auto",
      gap: spacing[4],
      paddingBlock: 20,
    },
  },
  brandLink: {
    justifySelf: "start",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[8],
    "@media (max-width: 760px)": {
      gridColumn: "1 / -1",
      gridRow: 2,
      justifyContent: "flex-start",
      gap: spacing[6],
    },
    "@media (max-width: 480px)": {
      justifyContent: "space-between",
      gap: spacing[3],
    },
  },
  navLink: {
    color: {
      default: colors.textSecondary,
      ":hover": colors.accent,
    },
    fontSize: typography.captionSize,
    textDecorationLine: "none",
  },
  navLabel: {
    color: {
      default: colors.textSecondary,
      ":hover": colors.accent,
    },
  },
  action: {
    justifySelf: "end",
  },
});
