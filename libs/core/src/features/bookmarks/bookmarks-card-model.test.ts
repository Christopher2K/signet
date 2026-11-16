import type { Bookmark } from "@signet/api";
import { describe, expect, it } from "vitest";
import {
  formatBookmarkDate,
  getBookmarkCardModel,
} from "./bookmarks-card-model";

const bookmark: Bookmark = {
  createdAt: "2026-11-15T12:00:00.000Z",
  icon: "https://www.example.com/apple-touch-icon.png",
  id: "01a1e0da-24c0-71a6-a0ac-704ba3421749",
  image: "https://cdn.example.net/cover.png",
  notes: "Read the docs",
  ownerId: "6f1f6f7a-4a2f-4b1f-9c25-2f5b2f0d1c11",
  tags: ["reading"],
  title: "Example",
  updatedAt: "2026-11-15T13:00:00.000Z",
  url: "https://www.example.com/docs",
};

describe("bookmark card model", () => {
  it("derives hostname and artwork sources from the saved bookmark", () => {
    expect(getBookmarkCardModel(bookmark)).toEqual({
      createdAt: bookmark.createdAt,
      hostname: "example.com",
      iconSources: [
        "https://www.example.com/apple-touch-icon.png",
        "https://www.example.com/favicon.ico",
      ],
      id: bookmark.id,
      notes: "Read the docs",
      previewSources: ["https://cdn.example.net/cover.png"],
      tags: ["reading"],
      title: "Example",
      updatedAt: bookmark.updatedAt,
      url: bookmark.url,
    });
  });

  it("formats saved dates and rejects invalid timestamps", () => {
    expect(formatBookmarkDate("2026-11-15T12:00:00.000Z", "en")).toBe(
      "Nov 15, 2026",
    );
    expect(formatBookmarkDate("not a date", "en")).toBeUndefined();
  });
});
