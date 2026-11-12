/// <reference types="vitest/config" />

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteBabel from "vite-plugin-babel";

const webOnlyExtensions = [".web.js", ".web.jsx", ".web.ts", ".web.tsx"];
const allExtensions = [
  ...webOnlyExtensions,
  ".mjs",
  ".js",
  ".mts",
  ".ts",
  ".jsx",
  ".tsx",
  ".json",
];
const babelInclude = [
  /[\\/]src[\\/]/,
  /[\\/]libs[\\/]design-system[\\/]/,
  /[\\/]react-strict-dom[\\/]/,
];

export default defineConfig({
  envPrefix: ["VITE_", "API_"],
  resolve: {
    tsconfigPaths: true,
    extensions: allExtensions,
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    viteBabel({
      include: babelInclude,
      filter: /\.[cm]?[jt]sx?$/,
    }),
  ],
  optimizeDeps: {
    rolldownOptions: {
      resolve: { extensions: allExtensions },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
