import { Button, Typography } from "@signet/design-system";
import { colors, radii, spacing } from "@signet/design-system/tokens.css";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { useAuth } from "#/features/auth";

export const LibraryPage = () => {
  const { logout, state } = useAuth();
  const [pending, setPending] = useState(false);

  if (state.status !== "authenticated") {
    return null;
  }

  const handleLogout = async () => {
    setPending(true);
    await logout();
    setPending(false);
  };

  return (
    <html.div style={styles.shell}>
      <html.header style={styles.header}>
        <Typography style={styles.brand}>SIGNET</Typography>
        <html.div style={styles.account}>
          <Button
            disabled={pending}
            onClick={handleLogout}
            size="sm"
            variant="secondary"
          >
            {pending ? "Logging out…" : "Log out"}
          </Button>
        </html.div>
      </html.header>
      <html.main style={styles.main}>
        <html.div style={styles.heading}>
          <Typography as="h1" variant="headline">
            Your library
          </Typography>
          <Typography as="p" tone="secondary" variant="caption">
            {state.user.email}
          </Typography>
        </html.div>
        <html.section style={styles.empty}>
          <Typography as="h2" variant="title">
            No bookmarks yet
          </Typography>
          <Typography as="p" tone="secondary">
            Your saved bookmarks will appear here.
          </Typography>
        </html.section>
      </html.main>
    </html.div>
  );
};

const styles = css.create({
  shell: {
    backgroundColor: colors.background,
    minHeight: "100vh",
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    display: "flex",
    justifyContent: "space-between",
    paddingBlock: spacing[4],
    paddingInline: spacing[6],
  },
  brand: {
    color: colors.primary,
    fontWeight: "700",
    letterSpacing: 2,
  },
  account: {
    alignItems: "center",
    display: "flex",
    gap: spacing[4],
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[8],
    marginInline: "auto",
    maxWidth: 1120,
    padding: spacing[8],
    width: "100%",
  },
  heading: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[2],
  },
  empty: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderStyle: "dashed",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    gap: spacing[3],
    padding: spacing[12],
    textAlign: "center",
  },
});
