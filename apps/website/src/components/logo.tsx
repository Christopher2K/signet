import { Typography } from "@signet/design-system";
import { colors, spacing } from "@signet/design-system/tokens.css";
import { useTranslation } from "@signet/locale/react";
import { css, html } from "react-strict-dom";
import stackUrl from "#/assets/stack.svg";

/** Logo properties. */
type LogoProps = {
  /** Uses the smaller product-preview lockup. */
  compact?: boolean;
};

/** Signet Stack mark and wordmark. */
export const Logo = ({ compact = false }: LogoProps) => {
  const { t } = useTranslation("common");

  return (
    <html.span style={styles.logo}>
      <html.img
        alt=""
        aria-hidden={true}
        src={stackUrl}
        style={[styles.mark, compact ? styles.compactMark : null]}
      />
      <Typography
        variant={compact ? "body" : "title"}
        style={[styles.wordmark, compact ? styles.compactWordmark : null]}
      >
        {t("appName")}
      </Typography>
    </html.span>
  );
};

const styles = css.create({
  logo: {
    display: "inline-flex",
    alignItems: "center",
    gap: spacing[3],
    color: colors.accent,
    lineHeight: 1,
  },
  mark: {
    width: 28,
    height: 28,
    flexShrink: 0,
  },
  compactMark: {
    width: 24,
    height: 24,
  },
  wordmark: {
    fontWeight: "700",
  },
  compactWordmark: {
    display: "inline",
    "@media (max-width: 480px)": {
      display: "none",
    },
  },
});
