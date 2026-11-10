import { Button, Typography } from "@signet/design-system";
import { colors, spacing } from "@signet/design-system/tokens.css";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { css, html } from "react-strict-dom";
import { useAuth } from "../auth-context";

/** Route-guard properties. */
export type RouteGuardProps = {
  children: ReactNode;
};

const SessionFeedback = () => {
  const { retryRestore, state } = useAuth();
  const unavailable = state.status === "unavailable";

  return (
    <html.main style={styles.page}>
      <html.section style={styles.card}>
        <Typography as="h1" variant="title">
          {unavailable ? "Server unavailable" : "Restoring your session…"}
        </Typography>
        <Typography
          as="p"
          role="status"
          style={styles.message}
          tone="secondary"
        >
          {unavailable
            ? state.message
            : "Checking your saved session with the server."}
        </Typography>
        {unavailable ? (
          <Button onClick={retryRestore} style={styles.retry} type="button">
            Try again
          </Button>
        ) : null}
      </html.section>
    </html.main>
  );
};

/** Allows authenticated users and redirects visitors to login. */
export const ProtectedRoute = ({ children }: RouteGuardProps) => {
  const { state } = useAuth();

  if (state.status === "unauthenticated") {
    return <Navigate replace to="/login" />;
  }
  if (state.status === "authenticated") {
    return children;
  }
  return <SessionFeedback />;
};

/** Allows visitors and redirects authenticated users to their library. */
export const GuestRoute = ({ children }: RouteGuardProps) => {
  const { state } = useAuth();

  if (state.status === "authenticated") {
    return <Navigate replace to="/" />;
  }
  if (state.status === "unauthenticated") {
    return children;
  }
  return <SessionFeedback />;
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
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
    maxWidth: 400,
    textAlign: "center",
  },
  message: {
    lineHeight: 1.5,
  },
  retry: {
    alignSelf: "center",
  },
});
