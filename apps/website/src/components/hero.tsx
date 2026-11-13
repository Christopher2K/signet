import { BookmarkSimple } from "@phosphor-icons/react";
import { Typography } from "@signet/design-system";
import {
  colors,
  radii,
  spacing,
  typography,
} from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import { ActionLink } from "#/components/action-link";
import { Eyebrow } from "#/components/eyebrow";
import { landingStyles } from "#/components/landing-styles.css";
import { githubUrl } from "#/links";

const clients = ["web", "browser", "phone"] as const;

export const Hero = () => {
  const { t } = useTranslation("web");

  return (
    <html.section id="top" style={[landingStyles.pageShell, styles.hero]}>
      <html.div style={styles.copy}>
        <Eyebrow>{t("marketing.hero.eyebrow")}</Eyebrow>
        <Typography as="h1" variant="display" style={styles.title}>
          <html.span style={styles.titleLine}>
            {t("marketing.hero.titleStart")}
          </html.span>
          <html.span style={[styles.titleLine, styles.titleAccent]}>
            {t("marketing.hero.titleEnd")}
          </html.span>
        </Typography>
        <Typography as="p" tone="secondary" style={styles.description}>
          {t("marketing.hero.description")}
        </Typography>
        <html.div style={landingStyles.buttonRow}>
          <ActionLink href="#self-host" fullWidthOnMobile>
            {t("marketing.hero.primaryAction")}
          </ActionLink>
          <ActionLink
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            fullWidthOnMobile
          >
            {t("marketing.hero.secondaryAction")}
          </ActionLink>
        </html.div>
        <Typography
          as="p"
          variant="caption"
          tone="secondary"
          style={styles.note}
        >
          {t("marketing.hero.note")}
        </Typography>
      </html.div>
      <html.aside style={styles.clientCard}>
        <html.div style={styles.clientCardHeading}>
          <BookmarkSimple size={32} weight="fill" aria-hidden="true" />
          <Typography as="p" variant="title" style={styles.clientCardTitle}>
            <html.span style={styles.titleLine}>
              {t("marketing.clients.titleStart")}
            </html.span>
            <html.span style={styles.titleLine}>
              {t("marketing.clients.titleEnd")}
            </html.span>
          </Typography>
        </html.div>
        <html.ol style={styles.clientList}>
          {clients.map((client, index) => (
            <html.li key={client} style={styles.clientListItem}>
              <Typography
                variant="caption"
                tone="accent"
                style={styles.clientNumber}
              >
                {String(index + 1).padStart(2, "0")}
              </Typography>
              <html.div>
                <Typography
                  as="h2"
                  variant="caption"
                  style={styles.clientLabel}
                >
                  {t(`marketing.clients.${client}Label`)}
                </Typography>
                <Typography
                  as="p"
                  variant="caption"
                  tone="secondary"
                  style={styles.clientDescription}
                >
                  {t(`marketing.clients.${client}Description`)}
                </Typography>
              </html.div>
            </html.li>
          ))}
        </html.ol>
      </html.aside>
    </html.section>
  );
};

const styles = css.create({
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(360px, 0.85fr)",
    alignItems: "center",
    gap: 80,
    paddingBlock: "80px 64px",
    "@media (min-width: 761px) and (max-width: 1024px)": {
      gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.8fr)",
      gap: 40,
    },
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr",
      gap: 40,
      paddingBlock: "48px 32px",
    },
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacing[6],
    "@media (max-width: 760px)": {
      gap: 20,
    },
  },
  title: {
    fontWeight: "700",
    lineHeight: 1.15,
    letterSpacing: "-0.04em",
    "@media (max-width: 760px)": {
      fontSize: typography.headlineSize,
      lineHeight: 1.25,
    },
  },
  titleLine: {
    display: "block",
  },
  titleAccent: {
    color: colors.accent,
  },
  description: {
    maxWidth: 680,
  },
  note: {
    lineHeight: 1.7,
  },
  clientCard: {
    padding: spacing[8],
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.card,
    backgroundColor: colors.surfaceAlt,
    "@media (max-width: 760px)": {
      padding: spacing[6],
    },
  },
  clientCardHeading: {
    display: "flex",
    alignItems: "center",
    gap: spacing[4],
    color: colors.accent,
  },
  clientCardTitle: {
    color: colors.accent,
    fontWeight: "700",
    lineHeight: 1.3,
    textTransform: "uppercase",
    "@media (max-width: 480px)": {
      fontSize: typography.bodySize,
    },
  },
  clientList: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
    marginTop: spacing[8],
    marginBottom: 0,
    marginInline: 0,
    padding: 0,
    listStyle: "none",
  },
  clientListItem: {
    display: "grid",
    gridTemplateColumns: "28px 1fr",
    gap: spacing[3],
  },
  clientNumber: {
    fontWeight: "700",
  },
  clientLabel: {
    marginBottom: spacing[1],
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  clientDescription: {
    lineHeight: 1.65,
  },
});
