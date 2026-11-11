// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  type BrowserSessionStorage,
  createWebSessionStorage,
} from "./auth-session-storage.web";

const createStorage = (): BrowserSessionStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
};

describe("web session storage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("persists, reads, and clears the bearer token", async () => {
    const storage = createWebSessionStorage(createStorage());

    await storage.writeStoredSession("session-token", "https://example.com");
    await expect(storage.readStoredSession()).resolves.toEqual({
      token: "session-token",
      serverUrl: null,
    });

    await storage.clearSessionToken();
    await expect(storage.readStoredSession()).resolves.toEqual({
      token: null,
      serverUrl: null,
    });
  });

  it("returns null when storage reads are blocked", async () => {
    const storage: BrowserSessionStorage = {
      getItem: () => {
        throw new Error("Storage blocked");
      },
      removeItem: () => undefined,
      setItem: () => undefined,
    };

    await expect(
      createWebSessionStorage(storage).readStoredSession(),
    ).resolves.toEqual({ token: null, serverUrl: null });
  });

  it("returns null when the browser storage getter is blocked", async () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    await expect(
      createWebSessionStorage().readStoredSession(),
    ).resolves.toEqual({ token: null, serverUrl: null });
  });

  it("does not throw when storage writes are blocked", async () => {
    const storage: BrowserSessionStorage = {
      getItem: () => null,
      removeItem: () => {
        throw new Error("Storage blocked");
      },
      setItem: () => {
        throw new Error("Storage blocked");
      },
    };
    const adapter = createWebSessionStorage(storage);

    await expect(
      adapter.writeStoredSession("session-token", "https://example.com"),
    ).resolves.toBeUndefined();
    await expect(adapter.clearSessionToken()).resolves.toBeUndefined();
  });
});
