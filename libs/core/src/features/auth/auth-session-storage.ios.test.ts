import * as SecureStore from "expo-secure-store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { sessionStorage } from "./auth-session-storage.ios";
import { sessionStorage as asyncSessionStorage } from "./auth-session-storage.native";

vi.mock("expo-secure-store", () => ({
  AFTER_FIRST_UNLOCK: 1,
  deleteItemAsync: vi.fn(),
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
}));

vi.mock("./auth-session-storage.native", () => ({
  sessionStorage: {
    clearSessionToken: vi.fn(),
    readStoredSession: vi.fn(),
    writeStoredSession: vi.fn(),
  },
}));

const sharedOptions = expect.objectContaining({
  accessGroup: "2YELN5S6P5.co.signetapp.app.shared",
  keychainService: "co.signetapp.app",
  requireAuthentication: false,
});

describe("iOS shared session storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(asyncSessionStorage.clearSessionToken).mockResolvedValue(
      undefined,
    );
    vi.mocked(asyncSessionStorage.writeStoredSession).mockResolvedValue(
      undefined,
    );
    vi.mocked(SecureStore.deleteItemAsync).mockResolvedValue(undefined);
    vi.mocked(SecureStore.getItemAsync).mockResolvedValue(null);
    vi.mocked(SecureStore.setItemAsync).mockResolvedValue(undefined);
  });

  it("mirrors an existing AsyncStorage session during restoration", async () => {
    vi.mocked(asyncSessionStorage.readStoredSession).mockResolvedValue({
      token: "session-token",
      serverUrl: "https://native.example.com",
    });

    await expect(sessionStorage.readStoredSession()).resolves.toEqual({
      token: "session-token",
      serverUrl: "https://native.example.com",
    });
    expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(2);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "signet.session.token",
      "session-token",
      sharedOptions,
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "signet.session.server-url",
      "https://native.example.com",
      sharedOptions,
    );
  });

  it("falls back to the shared session when AsyncStorage is empty", async () => {
    vi.mocked(asyncSessionStorage.readStoredSession).mockResolvedValue({
      token: null,
      serverUrl: null,
    });
    vi.mocked(SecureStore.getItemAsync).mockImplementation(async (key) =>
      key === "signet.session.token"
        ? "shared-token"
        : "https://shared.example.com",
    );

    await expect(sessionStorage.readStoredSession()).resolves.toEqual({
      token: "shared-token",
      serverUrl: "https://shared.example.com",
    });
  });

  it("persists new sessions to both stores", async () => {
    await sessionStorage.writeStoredSession(
      "new-token",
      "https://native.example.com",
    );

    expect(asyncSessionStorage.writeStoredSession).toHaveBeenCalledWith(
      "new-token",
      "https://native.example.com",
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(2);
  });

  it("clears the old shared token before updating its server", async () => {
    vi.mocked(SecureStore.getItemAsync).mockImplementation(async (key) =>
      key === "signet.session.token" ? "old-token" : "https://old.example.com",
    );
    vi.mocked(SecureStore.setItemAsync).mockRejectedValueOnce(
      new Error("Server update failed"),
    );

    await sessionStorage.writeStoredSession(
      "new-token",
      "https://new.example.com",
    );

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "signet.session.token",
      sharedOptions,
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "signet.session.server-url",
      "https://new.example.com",
      sharedOptions,
    );
    expect(
      vi.mocked(SecureStore.deleteItemAsync).mock.invocationCallOrder[0],
    ).toBeLessThan(
      vi.mocked(SecureStore.setItemAsync).mock.invocationCallOrder[0],
    );
  });

  it("clears only the shared token on logout", async () => {
    await sessionStorage.clearSessionToken();

    expect(asyncSessionStorage.clearSessionToken).toHaveBeenCalledOnce();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      "signet.session.token",
      sharedOptions,
    );
    expect(SecureStore.deleteItemAsync).not.toHaveBeenCalledWith(
      "signet.session.server-url",
      sharedOptions,
    );
  });

  it("keeps the app session usable when shared storage fails", async () => {
    vi.mocked(asyncSessionStorage.readStoredSession).mockResolvedValue({
      token: "session-token",
      serverUrl: "https://native.example.com",
    });
    vi.mocked(SecureStore.setItemAsync).mockRejectedValue(
      new Error("Missing entitlement"),
    );

    await expect(sessionStorage.readStoredSession()).resolves.toEqual({
      token: "session-token",
      serverUrl: "https://native.example.com",
    });
  });
});
