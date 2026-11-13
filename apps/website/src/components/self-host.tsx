import { Check, Copy } from "@phosphor-icons/react";
import { Button, Typography } from "@signet/design-system";
import {
  colors,
  radii,
  spacing,
  typography,
} from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { ActionLink } from "#/components/action-link";
import { Eyebrow } from "#/components/eyebrow";
import { landingStyles } from "#/components/landing-styles.css";
import { selfHostTheme } from "#/components/self-host-theme.css";
import { githubUrl, quickstartUrl } from "#/links";

const pullCommand = "docker compose pull";
const upCommand = "docker compose up -d";
const commands = `${pullCommand}\n${upCommand}`;
const checklist = ["noTelemetry", "multiUser", "persistence", "https"] as const;

export const SelfHost = () => {
  const { t } = useTranslation("web");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands);
    setCopied(true);
  };

  return (
    <html.section
      id="self-host"
      style={[
        selfHostTheme as unknown as typeof styles.selfHost,
        landingStyles.pageShell,
        styles.selfHost,
      ]}
    >
      <html.div>
        <Eyebrow>{t("marketing.selfHost.eyebrow")}</Eyebrow>
        <Typography as="h2" variant="headline" style={styles.title}>
          {t("marketing.selfHost.title")}
        </Typography>
        <Typography as="p" tone="secondary">
          {t("marketing.selfHost.description")}
        </Typography>
        <html.ul style={styles.checklist}>
          {checklist.map((item) => (
            <html.li key={item} style={styles.checklistItem}>
              <html.span style={styles.checkIcon}>
                <Check size={18} weight="bold" aria-hidden="true" />
              </html.span>
              <Typography>{t(`marketing.selfHost.${item}`)}</Typography>
            </html.li>
          ))}
        </html.ul>
      </html.div>
      <html.div style={styles.terminalCard}>
        <html.div style={styles.terminalHeading}>
          <Typography
            variant="caption"
            tone="secondary"
            style={styles.terminalLabel}
          >
            {t("marketing.selfHost.terminalLabel")}
          </Typography>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            aria-label={t("marketing.selfHost.copyCommands")}
            style={styles.copyButton}
          >
            <html.span style={styles.copyIcon}>
              {copied ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
              )}
            </html.span>
          </Button>
        </html.div>
        <Typography
          as="p"
          variant="caption"
          tone="secondary"
          style={styles.terminalDescription}
        >
          {t("marketing.selfHost.terminalDescription")}
        </Typography>
        <Typography as="pre" variant="code" style={styles.command}>
          {pullCommand}
        </Typography>
        <Typography
          as="pre"
          variant="code"
          style={[styles.command, styles.secondCommand]}
        >
          {upCommand}
        </Typography>
        <Typography
          as="p"
          variant="caption"
          tone="secondary"
          style={styles.terminalNote}
        >
          {t("marketing.selfHost.commandNote")}
        </Typography>
        <Typography
          variant="caption"
          tone="secondary"
          aria-live="polite"
          style={styles.copyFeedback}
        >
          {copied ? t("marketing.selfHost.copiedCommands") : ""}
        </Typography>
        <html.div style={landingStyles.buttonRow}>
          <ActionLink
            href={quickstartUrl}
            target="_blank"
            rel="noreferrer"
            fullWidthOnMobile
          >
            {t("marketing.selfHost.readQuickstart")}
          </ActionLink>
          <ActionLink
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            variant="outline"
            fullWidthOnMobile
          >
            {t("marketing.selfHost.viewGitHub")}
          </ActionLink>
        </html.div>
      </html.div>
    </html.section>
  );
};

const styles = css.create({
  selfHost: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)",
    gap: 64,
    marginBlock: 80,
    padding: spacing[12],
    borderRadius: radii.card,
    color: colors.text,
    backgroundColor: colors.background,
    "@media (min-width: 761px) and (max-width: 1024px)": {
      gap: spacing[8],
      padding: spacing[8],
    },
    "@media (max-width: 760px)": {
      gridTemplateColumns: "1fr",
      gap: 40,
      marginBlock: 56,
      padding: "32px 24px",
    },
  },
  title: {
    marginBlock: "24px 16px",
    fontWeight: "700",
    lineHeight: 1.25,
    letterSpacing: "-0.03em",
    "@media (max-width: 760px)": {
      fontSize: 28,
    },
  },
  checklist: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
    marginTop: spacing[8],
    marginBottom: 0,
    marginInline: 0,
    padding: 0,
    listStyle: "none",
  },
  checklistItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  checkIcon: {
    display: "flex",
    flexShrink: 0,
    marginTop: spacing[1],
    color: colors.textSecondary,
  },
  terminalCard: {
    minWidth: 0,
    padding: spacing[6],
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    "@media (max-width: 480px)": {
      padding: spacing[4],
    },
  },
  terminalHeading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[4],
  },
  terminalLabel: {
    fontWeight: "700",
    textTransform: "uppercase",
  },
  copyButton: {
    width: 36,
    height: 36,
    minHeight: 36,
    alignSelf: "center",
    padding: 0,
    borderWidth: 0,
    backgroundColor: {
      default: "transparent",
      ":hover": colors.border,
    },
  },
  copyIcon: {
    display: "flex",
    color: colors.textSecondary,
  },
  terminalDescription: {
    marginBlock: "16px 24px",
  },
  command: {
    overflowX: "auto",
    padding: spacing[4],
    borderColor: colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: radii.md,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
    fontFamily: typography.fontFamily,
    fontSize: typography.codeSize,
    fontWeight: "700",
    lineHeight: 1.5,
  },
  secondCommand: {
    marginTop: spacing[3],
  },
  terminalNote: {
    marginBlock: "16px 4px",
  },
  copyFeedback: {
    display: "block",
    minHeight: 24,
    marginBottom: spacing[2],
  },
});
