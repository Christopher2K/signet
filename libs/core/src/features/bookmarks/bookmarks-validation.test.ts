import { describe, expect, it } from "vitest";
import {
  bookmarkToFormValues,
  emptyBookmarkValues,
  getBookmarkHostname,
  toBookmarkRequest,
  validateBookmark,
} from "./bookmarks-validation";

describe("bookmark validation", () => {
  it("requires a title and valid HTTP(S) URLs", () => {
    expect(
      validateBookmark({
        ...emptyBookmarkValues,
        image: "file:///tmp/image.png",
        title: " ",
        url: "example.com",
      }),
    ).toEqual({
      image: "Enter a valid absolute HTTP(S) image URL.",
      title: "Enter a title.",
      url: "Enter a valid absolute HTTP(S) URL.",
    });
  });

  it("limits notes to 2000 characters", () => {
    expect(
      validateBookmark({
        ...emptyBookmarkValues,
        notes: "a".repeat(2001),
        title: "Example",
        url: "https://example.com",
      }).notes,
    ).toBe("Notes must be 2000 characters or fewer.");
  });

  it("normalizes request fields and deduplicates tags case-insensitively", () => {
    expect(
      toBookmarkRequest({
        image: " ",
        notes: "  Remember this  ",
        tags: " Work,reading,WORK, ,Reading ",
        title: "  Example  ",
        url: "  https://example.com/article  ",
      }),
    ).toEqual({
      image: null,
      notes: "Remember this",
      tags: ["work", "reading"],
      title: "Example",
      url: "https://example.com/article",
    });
  });

  it("converts nullable bookmark fields to form values", () => {
    expect(
      bookmarkToFormValues({
        createdAt: "2026-11-10T12:00:00Z",
        id: "bookmark-id",
        image: null,
        notes: null,
        ownerId: "owner-id",
        tags: ["work", "reading"],
        title: "Example",
        updatedAt: "2026-11-10T12:00:00Z",
        url: "https://www.example.com/article",
      }),
    ).toEqual({
      image: "",
      notes: "",
      tags: "work, reading",
      title: "Example",
      url: "https://www.example.com/article",
    });
    expect(getBookmarkHostname("https://www.example.com/article")).toBe(
      "example.com",
    );
  });
});
