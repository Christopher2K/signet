/// <reference types="vitest/config" />

import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import viteBabel from "vite-plugin-babel";

const dirname = import.meta.dirname;
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

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    extensions: allExtensions,
  },
  plugins: [
    tanstackStart(),
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
  ssr: {
    noExternal: ["@signet/design-system", "react-strict-dom"],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
export default config;
