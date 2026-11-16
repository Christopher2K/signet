import type { Meta, StoryObj } from "@storybook/react";
import { css, html } from "react-strict-dom";
import { fn } from "storybook/test";
import { colors, spacing } from "../tokens.css";
import { BookmarkCard } from "./bookmark-card";
import type { BookmarkCardData } from "./bookmark-card.types";

const bookmark: BookmarkCardData = {
  createdAt: "2026-11-15T12:00:00.000Z",
  hostname: "developer.mozilla.org",
  iconSources: [
    "https://developer.mozilla.org/favicon.ico",
    "https://developer.mozilla.org/apple-touch-icon.png",
  ],
  id: "story-bookmark",
  notes: "Reference for the web platform.",
  previewSources: [
    "https://developer.mozilla.org/mdn-social-image.46ac2375.png",
  ],
  tags: ["reading"],
  title: "MDN Web Docs",
  updatedAt: "2026-11-15T12:00:00.000Z",
  url: "https://developer.mozilla.org",
};

const strings = {
  artwork: "developer.mozilla.org bookmark artwork",
  edit: "Edit",
  editItem: "Edit MDN Web Docs",
  open: "Open",
  openItem: "Open MDN Web Docs",
  savedOn: "Saved Nov 15, 2026",
  tags: "Tags",
};

const meta = {
  title: "Design System/BookmarkCard",
  component: BookmarkCard,
  args: {
    bookmark,
    density: "medium",
    onEdit: fn(),
    onOpen: fn(),
    strings,
  },
  argTypes: {
    density: {
      control: "select",
      options: ["big", "medium", "compact"],
    },
  },
  decorators: [
    (Story) => (
      <html.div data-layoutconformance="strict" style={styles.canvas}>
        <html.div style={styles.card}>
          <Story />
        </html.div>
      </html.div>
    ),
  ],
} satisfies Meta<typeof BookmarkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {};

export const Big: Story = {
  args: {
    density: "big",
  },
};

export const Compact: Story = {
  args: {
    density: "compact",
  },
};

const styles = css.create({
  canvas: {
    backgroundColor: colors.background,
    display: "flex",
    padding: spacing[6],
  },
  card: {
    display: "flex",
    maxWidth: 420,
    width: "100%",
  },
});
