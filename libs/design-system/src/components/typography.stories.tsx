import type { Meta, StoryObj } from "@storybook/react";
import { css, html } from "react-strict-dom";
import { colors, spacing } from "../tokens.css";
import { Typography } from "./typography";

const meta = {
  title: "Design System/Typography",
  component: Typography,
  args: {
    as: "span",
    children: "Your saved bookmarks will appear here.",
    tone: "default",
    variant: "body",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["span", "p", "h1", "h2", "h3", "code", "a"],
    },
    children: { control: "text" },
    tone: {
      control: "select",
      options: ["default", "secondary", "accent", "danger"],
    },
    variant: {
      control: "select",
      options: ["display", "headline", "title", "body", "caption", "code"],
    },
  },
  decorators: [
    (Story) => (
      <html.div data-layoutconformance="strict" style={styles.canvas}>
        <Story />
      </html.div>
    ),
  ],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const AllVariants: Story = {
  render: () => (
    <html.div style={styles.specimen}>
      <Typography as="h1" variant="display">
        Display 48/700
      </Typography>
      <Typography as="h2" variant="headline">
        Headline 32/700
      </Typography>
      <Typography as="h3" variant="title">
        Title 20/600
      </Typography>
      <Typography as="p" variant="body">
        Body 15/400 — Notes, titles, and folder names.
      </Typography>
      <Typography as="p" tone="secondary" variant="caption">
        Caption 12/400 — URLs, metadata, timestamps, and tags.
      </Typography>
      <Typography as="code" variant="code">
        Code 13/400 — sync:completed
      </Typography>
    </html.div>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <html.div style={styles.specimen}>
      <Typography as="h1" variant="headline">
        A semantic heading
      </Typography>
      <Typography as="p" tone="secondary">
        A paragraph with secondary text and{" "}
        <Typography as="strong" variant="body">
          inline emphasis
        </Typography>
        .
      </Typography>
      <Typography as="a" href="https://example.com" tone="accent">
        A semantic link
      </Typography>
    </html.div>
  ),
};

export const Tones: Story = {
  render: () => (
    <html.div style={styles.specimen}>
      <Typography>Default text</Typography>
      <Typography tone="secondary">Secondary text</Typography>
      <Typography tone="accent">Accent text</Typography>
      <Typography role="alert" tone="danger">
        Danger text
      </Typography>
    </html.div>
  ),
};

const styles = css.create({
  canvas: {
    backgroundColor: colors.background,
    display: "flex",
    padding: spacing[6],
  },
  specimen: {
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
});
