import AsyncStorage from "@react-native-async-storage/async-storage";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sessionStorage } from "./auth-session-storage.native";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    multiGet: vi.fn(),
    multiSet: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("native session storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("persists and restores the token with its selected server", async () => {
    vi.mocked(AsyncStorage.multiSet).mockResolvedValue(undefined);
    vi.mocked(AsyncStorage.multiGet).mockResolvedValue([
      ["signet.session.token", "session-token"],
      ["signet.session.server-url", "https://native.example.com"],
    ]);

    await sessionStorage.writeStoredSession(
      "session-token",
      "https://native.example.com",
    );
    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      ["signet.session.token", "session-token"],
      ["signet.session.server-url", "https://native.example.com"],
    ]);
    await expect(sessionStorage.readStoredSession()).resolves.toEqual({
      token: "session-token",
      serverUrl: "https://native.example.com",
    });
  });

  it("clears only the token and retains the selected server", async () => {
    await sessionStorage.clearSessionToken();

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      "signet.session.token",
    );
    expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith(
      "signet.session.server-url",
    );
  });

  it("treats storage read failures as signed out", async () => {
    vi.mocked(AsyncStorage.multiGet).mockRejectedValue(
      new Error("Storage blocked"),
    );

    await expect(sessionStorage.readStoredSession()).resolves.toEqual({
      token: null,
      serverUrl: null,
    });
  });
});
