import babelConfig from "./babel.config.js";

export default {
  plugins: {
    "react-strict-dom/postcss-plugin": {
      include: [
        "entrypoints/**/*.{js,jsx,mjs,ts,tsx}",
        "../../libs/design-system/src/**/*.{js,jsx,mjs,ts,tsx}",
      ],
      babelConfig,
      useLayers: true,
    },
    autoprefixer: {},
  },
};
