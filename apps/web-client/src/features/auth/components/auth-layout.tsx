import { Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { css, html } from "react-strict-dom";

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
  return (
    <html.main style={styles.page}>
      <html.section style={styles.card}>
        <html.div style={styles.heading}>
          <Typography style={styles.brand} variant="caption">
            SIGNET
          </Typography>
          <Typography as="h1" style={styles.title} variant="headline">
            {title}
          </Typography>
        </html.div>
        {children}
        <Typography
          as="p"
          style={styles.footer}
          tone="secondary"
          variant="caption"
        >
          {footerQuestion}{" "}
          <Link className="auth-link" to={footerLinkTo}>
            <Typography style={styles.footerLink} variant="caption">
              {footerLinkText}
            </Typography>
          </Link>
        </Typography>
      </html.section>
    </html.main>
  );
};

const styles = css.create({
  page: {
    alignItems: "center",
    backgroundColor: colors.background,
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    padding: spacing[6],
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
    maxWidth: 400,
    padding: spacing[8],
    width: "100%",
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
  },
  brand: {
    color: colors.primary,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    lineHeight: 1.2,
  },
  footer: {
    lineHeight: 1.5,
    textAlign: "center",
  },
  footerLink: {
    color: "inherit",
    fontWeight: "700",
  },
});
