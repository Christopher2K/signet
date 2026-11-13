import { Typography } from "@signet/design-system";
import { colors, spacing } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { ActionLink } from "#/components/action-link";
import { landingStyles } from "#/components/landing-styles.css";
import { quickstartUrl } from "#/links";

export const FinalCta = () => {
  const { t } = useTranslation("web");

  return (
    <html.section style={styles.section}>
      <html.div style={[landingStyles.pageShell, styles.container]}>
        <html.div>
          <Typography as="h2" variant="headline" style={styles.title}>
            {t("marketing.finalCta.title")}
          </Typography>
          <Typography as="p" tone="secondary" style={styles.description}>
            {t("marketing.finalCta.description")}
          </Typography>
        </html.div>
        <ActionLink
          href={quickstartUrl}
          target="_blank"
          rel="noreferrer"
          variant="accent"
          fullWidthOnMobile
          style={styles.action}
        >
          {t("marketing.finalCta.action")}
        </ActionLink>
      </html.div>
    </html.section>
  );
};

const styles = css.create({
  section: {
    color: colors.accent,
    backgroundColor: colors.selection,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[12],
    paddingBlock: spacing[12],
    "@media (max-width: 760px)": {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: spacing[6],
      paddingBlock: 40,
    },
  },
  title: {
    maxWidth: 850,
    color: colors.accent,
    fontWeight: "700",
    lineHeight: 1.25,
    letterSpacing: "-0.03em",
    "@media (max-width: 760px)": {
      fontSize: 28,
    },
  },
  description: {
    maxWidth: 850,
    marginTop: spacing[3],
  },
  action: {
    flexShrink: 0,
  },
});
