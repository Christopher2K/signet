import { Typography } from "@signet/design-system";
import { colors, spacing } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { landingStyles } from "#/components/landing-styles.css";
import { Logo } from "#/components/logo";
import { githubUrl } from "#/links";

export const SiteFooter = () => {
  const { t } = useTranslation("web");

  return (
    <html.footer style={[landingStyles.pageShell, styles.footer]}>
      <html.div style={styles.main}>
        <html.div style={styles.brand}>
          <Logo />
          <Typography as="p" variant="caption" tone="secondary">
            {t("marketing.footer.tagline")}
          </Typography>
        </html.div>
        <html.nav
          aria-label={t("marketing.footer.github")}
          style={styles.links}
        >
          <html.a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            <Typography variant="caption" style={styles.linkLabel}>
              {t("marketing.footer.github")}
            </Typography>
          </html.a>
          <html.a href="#self-host" style={styles.link}>
            <Typography variant="caption" style={styles.linkLabel}>
              {t("marketing.footer.selfHost")}
            </Typography>
          </html.a>
        </html.nav>
      </html.div>
      <Typography as="p" variant="caption" tone="secondary" style={styles.note}>
        {t("marketing.footer.note")}
      </Typography>
    </html.footer>
  );
};

const styles = css.create({
  footer: {
    paddingBlock: "40px 24px",
  },
  main: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[8],
    paddingBottom: spacing[8],
    borderBottomColor: colors.selection,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    "@media (max-width: 760px)": {
      alignItems: "flex-start",
      flexDirection: "column",
    },
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: spacing[6],
    "@media (min-width: 761px) and (max-width: 1024px)": {
      alignItems: "flex-start",
      flexDirection: "column",
    },
    "@media (max-width: 760px)": {
      gap: spacing[4],
    },
  },
  links: {
    display: "flex",
    gap: spacing[6],
  },
  link: {
    textDecorationLine: "none",
  },
  linkLabel: {
    color: {
      default: colors.textSecondary,
      ":hover": colors.accent,
    },
  },
  note: {
    paddingTop: spacing[6],
  },
});
