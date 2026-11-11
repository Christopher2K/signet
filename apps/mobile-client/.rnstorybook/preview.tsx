import { LocaleProvider } from "@signet/locale/react";
import type { Preview } from "@storybook/react-native";

const preview: Preview = {
  decorators: [
    (Story) => (
      <LocaleProvider locale="en">
        <Story />
      </LocaleProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
