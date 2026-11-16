// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BookmarkDensity } from "./bookmarks-density";
import { useBookmarkDensity } from "./bookmarks-density-react";
import { bookmarkDensityStorage } from "./bookmarks-density-storage";

describe("useBookmarkDensity", () => {
  beforeEach(() => {
    vi.spyOn(bookmarkDensityStorage, "readDensity").mockResolvedValue(null);
    vi.spyOn(bookmarkDensityStorage, "writeDensity").mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts on the medium density when nothing is stored", async () => {
    const { result } = renderHook(() => useBookmarkDensity());

    expect(result.current.density).toBe("medium");
    await waitFor(() =>
      expect(bookmarkDensityStorage.readDensity).toHaveBeenCalled(),
    );
  });

  it("restores the stored density", async () => {
    vi.mocked(bookmarkDensityStorage.readDensity).mockResolvedValue("compact");

    const { result } = renderHook(() => useBookmarkDensity());

    await waitFor(() => expect(result.current.density).toBe("compact"));
  });

  it("applies and persists a new density", async () => {
    const { result } = renderHook(() => useBookmarkDensity());

    act(() => {
      result.current.setDensity("big" satisfies BookmarkDensity);
    });

    expect(result.current.density).toBe("big");
    expect(bookmarkDensityStorage.writeDensity).toHaveBeenCalledWith("big");
  });
});
