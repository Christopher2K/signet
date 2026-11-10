import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { css, html } from "react-strict-dom";
import { AuthProvider } from "#/features/auth";
import { webTheme } from "#/web-theme.css";

/** Dependencies available to every route. */
type RootRouteContext = {
  queryClient: QueryClient;
};

const Root = () => {
  return (
    <AuthProvider>
      <html.div
        data-layoutconformance="strict"
        style={[webTheme as unknown as typeof styles.app, styles.app]}
      >
        <Outlet />
      </html.div>
    </AuthProvider>
  );
};

const styles = css.create({
  app: {
    minHeight: "100vh",
  },
});

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: Root,
});
