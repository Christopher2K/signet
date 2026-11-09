import type { StorybookConfig } from "@storybook/tanstack-react";

const config: StorybookConfig = {
  stories: [
    "../../../libs/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/tanstack-react",
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      // The shared RSD stories declare portable argTypes explicitly.
      exclude: ["**/.storybook/preview.tsx", "**/libs/design-system/**"],
      tsconfigPath: "./tsconfig.json",
    },
  },
};
export default config;
