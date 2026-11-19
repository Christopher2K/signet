import { Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { useLinkProps } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { css, html } from "react-strict-dom";
import { Logo } from "#/components/logo";

/** Shared centered auth-screen properties. */
export type AuthLayoutProps = {
  title: string;
  children: ReactNode;
  footerQuestion: string;
  footerLinkText: string;
  footerLinkTo: "/login" | "/signup";
};

export const AuthLayout = ({
  children,
  footerLinkText,
  footerLinkTo,
  footerQuestion,
  title,
}: AuthLayoutProps) => {
  const footerLinkProps = useLinkProps({
    to: footerLinkTo,
  }) as ComponentPropsWithoutRef<typeof html.a>;

  return (
    <html.main style={styles.page}>
      <html.div style={styles.brand}>
        <Logo size={32} />
        <Typography style={styles.wordmark} variant="title">
          Signet
        </Typography>
      </html.div>
      <html.section style={styles.card}>
        <Typography as="h1" style={styles.title} variant="headline">
          {title}
        </Typography>
        {children}
        <html.div style={styles.footer}>
          <Typography as="p" tone="secondary" variant="caption">
            {footerQuestion}
          </Typography>
          <Typography
            as="a"
            {...footerLinkProps}
            style={styles.footerLink}
            variant="caption"
          >
            {footerLinkText}
          </Typography>
        </html.div>
      </html.section>
    </html.main>
  );
};

const styles = css.create({
  page: {
    alignItems: "center",
    backgroundColor: colors.background,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
    justifyContent: "center",
    minHeight: "100vh",
    padding: {
      default: spacing[6],
      "@media (max-width: 480px)": spacing[4],
    },
  },
  brand: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  wordmark: {
    color: colors.text,
    fontWeight: "700",
    lineHeight: 1.2,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
    maxWidth: 400,
    padding: {
      default: spacing[8],
      "@media (max-width: 480px)": spacing[6],
    },
    width: "100%",
  },
  title: {
    lineHeight: 1.2,
  },
  footer: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: spacing[1],
    lineHeight: 1.5,
    width: "100%",
  },
  footerLink: {
    boxSizing: "border-box",
    color: {
      default: colors.primary,
      "@media (prefers-color-scheme: dark)": colors.accent,
    },
    display: {
      default: "inline",
      "@media (max-width: 480px)": "inline-block",
    },
    fontWeight: "700",
    paddingBlock: {
      default: 0,
      "@media (max-width: 480px)": spacing[1],
    },
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
});
