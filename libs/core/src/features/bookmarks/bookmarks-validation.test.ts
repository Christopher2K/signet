import { describe, expect, it } from "vitest";
import {
  bookmarkToFormValues,
  emptyBookmarkValues,
  getBookmarkHostname,
  getBookmarkIconSources,
  getBookmarkPreviewSources,
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
      image: "common:validation.imageUrlInvalid",
      title: "common:validation.titleRequired",
      url: "common:validation.urlInvalid",
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
    ).toBe("common:validation.notesTooLong");
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
        icon: null,
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

  it("orders icon sources from the resolved icon to the site paths", () => {
    expect(
      getBookmarkIconSources(
        "https://www.example.com/article",
        "https://cdn.example.net/icon.png",
      ),
    ).toEqual([
      "https://cdn.example.net/icon.png",
      "https://www.example.com/apple-touch-icon.png",
      "https://www.example.com/favicon.ico",
    ]);
    expect(getBookmarkIconSources("not a url", null)).toEqual([]);
    expect(
      getBookmarkIconSources(
        "https://www.example.com",
        "https://www.example.com/apple-touch-icon.png",
      ),
    ).toEqual([
      "https://www.example.com/apple-touch-icon.png",
      "https://www.example.com/favicon.ico",
    ]);
  });

  it("returns only stored preview images", () => {
    expect(
      getBookmarkPreviewSources(" https://cdn.example.net/cover.png "),
    ).toEqual(["https://cdn.example.net/cover.png"]);
    expect(getBookmarkPreviewSources(null)).toEqual([]);
  });
});
