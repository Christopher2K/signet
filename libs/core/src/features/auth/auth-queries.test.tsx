// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "./auth-provider";
import { useMeQuery } from "./auth-queries";
import type { SessionStorageAdapter } from "./auth-session-storage.types";

const emptyStorage: SessionStorageAdapter = {
  readStoredSession: async () => ({ token: null, serverUrl: null }),
  writeStoredSession: async () => undefined,
  clearSessionToken: async () => undefined,
};

const MeQueryHarness = () => {
  useMeQuery({ serverUrl: "https://selected.example.com" });
  return null;
};

describe("useMeQuery", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("queries the same server used in its query key", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            email: "name@example.com",
            id: "user-id",
            name: "Jane Doe",
          },
        }),
        { headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider
          defaultServerUrl="https://default.example.com"
          storage={emptyStorage}
        >
          <MeQueryHarness />
        </AuthProvider>
      </QueryClientProvider>,
    );

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const request = fetchMock.mock.calls[0]?.[0] as Request;
    expect(request.url).toBe("https://selected.example.com/api/v1/me");
  });
});
