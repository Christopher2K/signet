import { describe, expect, it } from "vitest";
import {
  clearSessionToken,
  readSessionToken,
  type SessionStorage,
  writeSessionToken,
} from "./session-storage";

const createStorage = (): SessionStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
};

describe("session storage", () => {
  it("persists, reads, and clears the bearer token", () => {
    const storage = createStorage();

    writeSessionToken("session-token", storage);
    expect(readSessionToken(storage)).toBe("session-token");

    clearSessionToken(storage);
    expect(readSessionToken(storage)).toBeNull();
  });

  it("returns null when storage reads are blocked", () => {
    const storage: SessionStorage = {
      getItem: () => {
        throw new Error("Storage blocked");
      },
      removeItem: () => undefined,
      setItem: () => undefined,
    };

    expect(readSessionToken(storage)).toBeNull();
  });

  it("does not throw when storage writes are blocked", () => {
    const storage: SessionStorage = {
      getItem: () => null,
      removeItem: () => {
        throw new Error("Storage blocked");
      },
      setItem: () => {
        throw new Error("Storage blocked");
      },
    };

    expect(() => writeSessionToken("session-token", storage)).not.toThrow();
    expect(() => clearSessionToken(storage)).not.toThrow();
  });
});
