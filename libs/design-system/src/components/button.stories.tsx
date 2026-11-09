import type { Meta, StoryObj } from "@storybook/react";
import { css, html } from "react-strict-dom";
import { fn } from "storybook/test";
import { colors, spacing } from "../tokens.css";
import { Button } from "./button";

const meta = {
  title: "Design System/Button",
  component: Button,
  args: {
    children: "Save bookmark",
    onClick: fn(),
  },
  argTypes: {
    children: { control: "text" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: { control: "select", options: ["primary", "secondary"] },
  },
  decorators: [
    (Story) => (
      <html.div data-layoutconformance="strict" style={styles.canvas}>
        <Story />
      </html.div>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Create a new bookmark",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

const styles = css.create({
  canvas: {
    alignItems: "flex-start",
    backgroundColor: colors.background,
    display: "flex",
    padding: spacing[6],
  },
});
