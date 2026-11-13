import { Typography } from "@signet/design-system";
import { colors, spacing, typography } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { landingStyles } from "#/components/landing-styles.css";

const platforms = [
  { key: "web", value: "webValue" },
  { key: "browser", value: "browserValue" },
  { key: "phone", value: "phoneValue" },
  { key: "server", value: "serverValue" },
] as const;

export const PlatformStrip = () => {
  const { t } = useTranslation("web");

  return (
    <html.section style={styles.section}>
      <html.div style={[landingStyles.pageShell, styles.container]}>
        {platforms.map((platform) => (
          <html.div key={platform.key}>
            <Typography as="p" variant="caption" style={styles.label}>
              {t(`marketing.platforms.${platform.key}Label`)}
            </Typography>
            <Typography as="strong" variant="caption" style={styles.value}>
              {t(`marketing.platforms.${platform.value}`)}
            </Typography>
          </html.div>
        ))}
      </html.div>
    </html.section>
  );
};

const styles = css.create({
  section: {
    marginTop: spacing[12],
    color: colors.background,
    backgroundColor: colors.accent,
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: spacing[8],
    paddingBlock: spacing[6],
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr",
      gap: spacing[4],
    },
  },
  label: {
    color: colors.selection,
    fontSize: typography.captionSize,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  value: {
    display: "block",
    marginTop: spacing[1],
    color: colors.background,
    fontWeight: "700",
  },
});
