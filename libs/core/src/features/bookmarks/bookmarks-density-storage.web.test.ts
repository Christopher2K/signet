// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type BrowserDensityStorage,
  createWebBookmarkDensityStorage,
} from "./bookmarks-density-storage.web";

const createStorage = (): BrowserDensityStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

describe("web bookmark density storage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("persists and restores the stored density", async () => {
    const storage = createWebBookmarkDensityStorage(createStorage());

    await expect(storage.readDensity()).resolves.toBeNull();
    await storage.writeDensity("big");
    await expect(storage.readDensity()).resolves.toBe("big");
  });

  it("ignores stored values that are not supported densities", async () => {
    const storage = createWebBookmarkDensityStorage({
      getItem: () => "huge",
      setItem: () => undefined,
    });

    await expect(storage.readDensity()).resolves.toBeNull();
  });

  it("does not throw when storage is unavailable", async () => {
    const storage = createWebBookmarkDensityStorage({
      getItem: () => {
        throw new Error("Storage blocked");
      },
      setItem: () => {
        throw new Error("Storage blocked");
      },
    });

    await expect(storage.readDensity()).resolves.toBeNull();
    await expect(storage.writeDensity("medium")).resolves.toBeUndefined();
  });

  it("returns no density outside the browser", async () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    await expect(
      createWebBookmarkDensityStorage().readDensity(),
    ).resolves.toBeNull();
  });
});
