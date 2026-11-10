import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { css, html } from "react-strict-dom";
import { fn } from "storybook/test";
import { colors, spacing } from "../tokens.css";
import { TextField } from "./text-field";

const meta = {
  title: "Design System/TextField",
  component: TextField,
  args: {
    id: "story-email",
    label: "Email",
    onValueChange: fn(),
    placeholder: "name@example.com",
    type: "email",
    value: "name@example.com",
  },
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "text" },
    label: { control: "text" },
    type: { control: "select", options: ["text", "email", "password"] },
    value: { control: "text" },
  },
  decorators: [
    (Story) => (
      <html.div data-layoutconformance="strict" style={styles.canvas}>
        <Story />
      </html.div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Password: Story = {
  args: {
    autoComplete: "current-password",
    id: "story-password",
    label: "Password",
    type: "password",
    value: "a secure password",
  },
};

export const WithError: Story = {
  args: {
    error: "Enter a valid email address.",
    value: "not-an-email",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("name@example.com");
    return <TextField {...args} onValueChange={setValue} value={value} />;
  },
};

const styles = css.create({
  canvas: {
    backgroundColor: colors.background,
    display: "flex",
    maxWidth: 400,
    padding: spacing[6],
    width: "100%",
  },
});
