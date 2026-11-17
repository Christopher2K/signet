import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "#/components/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
      {
        property: "og:image:alt",
        content: "Signet — Your bookmarks. Everywhere. Yours.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
      {
        name: "twitter:image:alt",
        content: "Signet — Your bookmarks. Everywhere. Yours.",
      },
    ],
  }),
  component: LandingPage,
});
