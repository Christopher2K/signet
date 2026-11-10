import type { Preview } from "@storybook/tanstack-react";
import type { ComponentPropsWithoutRef } from "react";
import { html } from "react-strict-dom";
import "../src/strict.css";
import { webTheme } from "../src/web-theme.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <html.div
        data-layoutconformance="strict"
        style={
          webTheme as unknown as ComponentPropsWithoutRef<
            typeof html.div
          >["style"]
        }
      >
        <Story />
      </html.div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
