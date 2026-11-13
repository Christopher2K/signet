import {
  ArrowsClockwise,
  type Icon,
  MagnifyingGlass,
  ShareNetwork,
  WifiSlash,
} from "@phosphor-icons/react";
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

/** Translated feature content and its icon. */
type Feature = {
  key: "sync" | "offline" | "organize" | "share";
  icon: Icon;
};

const features: Feature[] = [
  { key: "sync", icon: ArrowsClockwise },
  { key: "offline", icon: WifiSlash },
  { key: "organize", icon: MagnifyingGlass },
  { key: "share", icon: ShareNetwork },
];

export const FeatureGrid = () => {
  const { t } = useTranslation("web");

  return (
    <html.section
      id="features"
      style={[landingStyles.pageShell, landingStyles.sectionSpace]}
    >
      <SectionIntro
        eyebrow={t("marketing.features.eyebrow")}
        title={t("marketing.features.title")}
        description={t("marketing.features.description")}
      />
      <html.div style={styles.grid}>
        {features.map((feature) => {
          const FeatureIcon = feature.icon;

          return (
            <html.article style={styles.card} key={feature.key}>
              <html.div style={styles.icon}>
                <FeatureIcon size={26} aria-hidden="true" />
              </html.div>
              <Typography as="h3" variant="title" style={styles.title}>
                {t(`marketing.features.${feature.key}Title`)}
              </Typography>
              <Typography as="p" tone="secondary">
                {t(`marketing.features.${feature.key}Description`)}
              </Typography>
              <Typography as="p" variant="caption" style={styles.note}>
                {t(`marketing.features.${feature.key}Note`)}
              </Typography>
            </html.article>
          );
        })}
      </html.div>
    </html.section>
  );
};

const styles = css.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: spacing[6],
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr",
    },
  },
  card: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 20,
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
  icon: {
    display: "flex",
    color: colors.primary,
  },
  title: {
    fontWeight: "700",
    lineHeight: 1.4,
  },
  note: {
    width: "100%",
    marginTop: "auto",
    padding: "12px 16px",
    borderRadius: radii.sm,
    color: colors.accent,
    backgroundColor: colors.surfaceAlt,
    fontSize: typography.captionSize,
    fontWeight: "700",
  },
});
