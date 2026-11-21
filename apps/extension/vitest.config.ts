import viteBabel from "vite-plugin-babel";
import { defineConfig } from "vitest/config";
import { WxtVitest } from "wxt/testing/vitest-plugin";

export default defineConfig({
  plugins: [
    WxtVitest(),
    viteBabel({
      include: [
        /[\\/]entrypoints[\\/]/,
        /[\\/]libs[\\/]design-system[\\/]/,
        /[\\/]react-strict-dom[\\/]/,
      ],
      filter: /\.[cm]?[jt]sx?$/,
    }),
  ],
  resolve: {
    extensions: [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ".mjs",
      ".js",
      ".mts",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
    ],
  },
  test: {
    environment: "jsdom",
  },
});
