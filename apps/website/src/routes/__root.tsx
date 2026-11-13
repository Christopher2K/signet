import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppLocaleProvider } from "#/app-locale";
import "../styles.css";

/** Root document properties. */
type RootDocumentProps = {
  children: ReactNode;
};

const RootDocument = ({ children }: RootDocumentProps) => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
};

const RootComponent = () => {
  return (
    <AppLocaleProvider>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </AppLocaleProvider>
  );
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Signet" },
      { name: "theme-color", content: "#FBFFF1" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "preload",
        href: "/fonts/SpaceMono-Regular.ttf",
        as: "font",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/SpaceMono-Bold.ttf",
        as: "font",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
});
