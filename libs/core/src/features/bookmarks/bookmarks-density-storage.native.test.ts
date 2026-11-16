import AsyncStorage from "@react-native-async-storage/async-storage";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { bookmarkDensityStorage } from "./bookmarks-density-storage.native";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

describe("native bookmark density storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists and restores the stored density", async () => {
    vi.mocked(AsyncStorage.setItem).mockResolvedValue(undefined);
    vi.mocked(AsyncStorage.getItem).mockResolvedValue("compact");

    await bookmarkDensityStorage.writeDensity("compact");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "signet.library.density",
      "compact",
    );
    await expect(bookmarkDensityStorage.readDensity()).resolves.toBe("compact");
  });

  it("ignores stored values that are not supported densities", async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValue("huge");

    await expect(bookmarkDensityStorage.readDensity()).resolves.toBeNull();
  });

  it("treats storage failures as an unset preference", async () => {
    vi.mocked(AsyncStorage.getItem).mockRejectedValue(
      new Error("Storage blocked"),
    );
    vi.mocked(AsyncStorage.setItem).mockRejectedValue(
      new Error("Storage blocked"),
    );

    await expect(bookmarkDensityStorage.readDensity()).resolves.toBeNull();
    await expect(
      bookmarkDensityStorage.writeDensity("big"),
    ).resolves.toBeUndefined();
  });
});
