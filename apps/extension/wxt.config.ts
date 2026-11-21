import viteBabel from "vite-plugin-babel";
import { defineConfig } from "wxt";

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

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  browser: "safari",
  manifestVersion: 3,
  outDir: "../extension-safari/assets",
  outDirTemplate: ".",
  imports: false,
  vite: () => ({
    resolve: { extensions: allExtensions },
    plugins: [
      viteBabel({
        include: [
          /[\\/]entrypoints[\\/]/,
          /[\\/]libs[\\/]design-system[\\/]/,
          /[\\/]react-strict-dom[\\/]/,
        ],
        filter: /\.[cm]?[jt]sx?$/,
      }),
    ],
    optimizeDeps: {
      rolldownOptions: {
        resolve: { extensions: allExtensions },
      },
    },
  }),
  manifest: {
    default_locale: "en",
    name: "__MSG_extension_name__",
    description: "__MSG_extension_description__",
    icons: {
      48: "images/icon-48.png",
      96: "images/icon-96.png",
      128: "images/icon-128.png",
      256: "images/icon-256.png",
      512: "images/icon-512.png",
    },
    action: {
      default_icon: {
        16: "images/toolbar-icon-16.png",
        19: "images/toolbar-icon-19.png",
        32: "images/toolbar-icon-32.png",
        38: "images/toolbar-icon-38.png",
        48: "images/toolbar-icon-48.png",
        72: "images/toolbar-icon-72.png",
      },
    },
    permissions: ["activeTab", "nativeMessaging"],
  },
});
