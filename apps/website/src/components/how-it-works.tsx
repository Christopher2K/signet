import { Typography } from "@signet/design-system";
import {
  colors,
  radii,
  spacing,
  typography,
} from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { landingStyles } from "#/components/landing-styles.css";
import { SectionIntro } from "#/components/section-intro";

const steps = ["capture", "organize", "access"] as const;

export const HowItWorks = () => {
  const { t } = useTranslation("web");

  return (
    <html.section id="how-it-works" style={styles.section}>
      <html.div style={[landingStyles.pageShell, landingStyles.sectionSpace]}>
        <SectionIntro
          eyebrow={t("marketing.howItWorks.eyebrow")}
          title={t("marketing.howItWorks.title")}
          description={t("marketing.howItWorks.description")}
        />
        <html.div style={styles.grid}>
          {steps.map((step, index) => (
            <html.article style={styles.card} key={step}>
              <Typography variant="display" tone="accent" style={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </Typography>
              <Typography as="h3" variant="title" style={styles.title}>
                {t(`marketing.howItWorks.${step}Title`)}
              </Typography>
              <Typography as="p" tone="secondary">
                {t(`marketing.howItWorks.${step}Description`)}
              </Typography>
            </html.article>
          ))}
        </html.div>
      </html.div>
    </html.section>
  );
};

const styles = css.create({
  section: {
    backgroundColor: colors.surfaceAlt,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: spacing[6],
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
  card: {
    padding: spacing[8],
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    "@media (max-width: 760px)": {
      padding: spacing[6],
    },
  },
  number: {
    display: "block",
    marginBottom: spacing[6],
    fontSize: typography.displaySize,
    fontWeight: "700",
    lineHeight: 1,
  },
  title: {
    marginBottom: spacing[3],
    fontWeight: "700",
    lineHeight: 1.4,
  },
});
