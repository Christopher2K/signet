// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "./auth-context";
import { AuthError } from "./auth-errors";
import { AuthProvider } from "./auth-provider";
import type {
  SessionStorageAdapter,
  StoredSession,
} from "./auth-session-storage.types";
import type { AuthApi } from "./auth-types";

const user = {
  email: "name@example.com",
  id: "user-id",
  name: "Jane Doe",
};

const createApi = (overrides: Partial<AuthApi> = {}): AuthApi => ({
  currentUser: vi.fn().mockResolvedValue(user),
  login: vi.fn().mockResolvedValue({ token: "new-token", user }),
  logout: vi.fn().mockResolvedValue(undefined),
  signup: vi.fn().mockResolvedValue({ token: "new-token", user }),
  ...overrides,
});

const createMemoryStorage = (
  initialSession: StoredSession = { token: null, serverUrl: null },
  overrides: Partial<SessionStorageAdapter> = {},
): SessionStorageAdapter => {
  let stored = initialSession;
  return {
    readStoredSession: vi.fn(async () => stored),
    writeStoredSession: vi.fn(async (token: string, serverUrl: string) => {
      stored = { token, serverUrl };
    }),
    clearSessionToken: vi.fn(async () => {
      stored = { ...stored, token: null };
    }),
    ...overrides,
  };
};

const AuthHarness = () => {
  const { login, logout, serverUrl, state } = useAuth();

  return (
    <div>
      <span data-testid="status">{state.status}</span>
      <span data-testid="email">{state.user?.email}</span>
      <span data-testid="server-url">{serverUrl}</span>
      <button
        aria-label="Log in"
        onClick={() =>
          void login({
            email: user.email,
            password: "a secure password",
            serverUrl: "https://selected.example.com/",
          }).catch(() => undefined)
        }
        type="button"
      />
      <button
        aria-label="Log out"
        onClick={() => void logout()}
        type="button"
      />
    </div>
  );
};

type RenderAuthOptions = {
  requireStoredServerUrl?: boolean;
  storage?: SessionStorageAdapter;
};

const renderAuth = (
  api: AuthApi,
  { requireStoredServerUrl = false, storage }: RenderAuthOptions = {},
) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        api={api}
        defaultServerUrl="https://default.example.com"
        requireStoredServerUrl={requireStoredServerUrl}
        storage={storage}
      >
        <AuthHarness />
      </AuthProvider>
    </QueryClientProvider>,
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("starts unauthenticated when no session is stored", async () => {
    const api = createApi();
    renderAuth(api);

    await screen.findByText("unauthenticated");
    expect(api.currentUser).not.toHaveBeenCalled();
    expect(screen.getByTestId("server-url").textContent).toBe(
      "https://default.example.com",
    );
  });

  it("restores a browser session through the current-user query", async () => {
    window.localStorage.setItem("signet.session.token", "stored-token");
    const api = createApi();
    renderAuth(api);

    await screen.findByText("authenticated");
    expect(api.currentUser).toHaveBeenCalledOnce();
    expect(screen.getByTestId("email").textContent).toBe(user.email);
  });

  it("requires a stored server URL for native restoration", async () => {
    window.localStorage.setItem("signet.session.token", "stored-token");
    const api = createApi();
    renderAuth(api, { requireStoredServerUrl: true });

    await screen.findByText("unauthenticated");
    expect(api.currentUser).not.toHaveBeenCalled();
  });

  it("restores a native session with its selected server", async () => {
    const storage = createMemoryStorage({
      token: "stored-token",
      serverUrl: "https://native.example.com",
    });
    const api = createApi();
    renderAuth(api, { requireStoredServerUrl: true, storage });

    await screen.findByText("authenticated");
    expect(api.currentUser).toHaveBeenCalledOnce();
    expect(screen.getByTestId("server-url").textContent).toBe(
      "https://native.example.com",
    );
  });

  it("authenticates in memory when session persistence is blocked", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });
    const api = createApi();
    renderAuth(api);

    await screen.findByText("unauthenticated");
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await screen.findByText("authenticated");
    expect(api.login).toHaveBeenCalledWith({
      email: user.email,
      password: "a secure password",
    });
    expect(screen.getByTestId("server-url").textContent).toBe(
      "https://selected.example.com",
    );
  });

  it("clears an unauthorized restored session", async () => {
    window.localStorage.setItem("signet.session.token", "expired-token");
    const api = createApi({
      currentUser: vi
        .fn()
        .mockRejectedValue(new AuthError("Unauthorized", "unauthorized")),
    });
    renderAuth(api);

    await screen.findByText("unauthenticated");
    expect(window.localStorage.getItem("signet.session.token")).toBeNull();
  });

  it("does not let unauthorized cleanup overwrite a newer login", async () => {
    let finishClear: () => void = () => undefined;
    const clearSessionToken = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishClear = resolve;
        }),
    );
    const storage = createMemoryStorage(
      { token: "expired-token", serverUrl: null },
      { clearSessionToken },
    );
    const api = createApi({
      currentUser: vi
        .fn()
        .mockRejectedValue(new AuthError("Unauthorized", "unauthorized")),
    });
    renderAuth(api, { storage });

    await screen.findByText("unauthenticated");
    await vi.waitFor(() => expect(clearSessionToken).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await vi.waitFor(() => expect(api.login).toHaveBeenCalledOnce());
    finishClear();

    await screen.findByText("authenticated");
    expect(screen.getByTestId("email").textContent).toBe(user.email);
  });

  it("serializes authentication attempts around persistence", async () => {
    let finishWrite: () => void = () => undefined;
    const baseStorage = createMemoryStorage();
    const writeStoredSession = vi.fn(
      async (token: string, serverUrl: string) => {
        await new Promise<void>((resolve) => {
          finishWrite = resolve;
        });
        await baseStorage.writeStoredSession(token, serverUrl);
      },
    );
    const storage = { ...baseStorage, writeStoredSession };
    const api = createApi({
      login: vi
        .fn()
        .mockResolvedValueOnce({ token: "first-token", user })
        .mockRejectedValueOnce(new Error("Second login failed")),
    });
    renderAuth(api, { storage });

    await screen.findByText("unauthenticated");
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await vi.waitFor(() => expect(writeStoredSession).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(api.login).toHaveBeenCalledOnce();
    finishWrite();

    await vi.waitFor(() => expect(api.login).toHaveBeenCalledTimes(2));
    await screen.findByText("authenticated");
    await expect(storage.readStoredSession()).resolves.toEqual({
      token: "first-token",
      serverUrl: "https://selected.example.com",
    });
  });

  it("keeps authentication usable when a storage adapter rejects", async () => {
    const storage = createMemoryStorage(
      { token: null, serverUrl: null },
      { writeStoredSession: vi.fn().mockRejectedValue(new Error("Blocked")) },
    );
    const api = createApi();
    renderAuth(api, { storage });

    await screen.findByText("unauthenticated");
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await screen.findByText("authenticated");
    expect(screen.getByTestId("email").textContent).toBe(user.email);
  });

  it("does not let an earlier logout clear a newer login", async () => {
    let finishLogout: () => void = () => undefined;
    const api = createApi({
      logout: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            finishLogout = resolve;
          }),
      ),
    });
    renderAuth(api, { storage: createMemoryStorage() });

    await screen.findByText("unauthenticated");
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await screen.findByText("authenticated");

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    await vi.waitFor(() => expect(api.logout).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    expect(api.login).toHaveBeenCalledOnce();
    finishLogout();
    await vi.waitFor(() => expect(api.login).toHaveBeenCalledTimes(2));

    await screen.findByText("authenticated");
    expect(screen.getByTestId("email").textContent).toBe(user.email);
  });

  it("does not restore a user after logout cancels restoration", async () => {
    window.localStorage.setItem("signet.session.token", "stored-token");
    let resolveCurrentUser: (value: typeof user) => void = () => undefined;
    const currentUser = new Promise<typeof user>((resolve) => {
      resolveCurrentUser = resolve;
    });
    const api = createApi({
      currentUser: vi.fn().mockReturnValue(currentUser),
    });
    renderAuth(api);

    await screen.findByText("restoring");
    await vi.waitFor(() => expect(api.currentUser).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    await screen.findByText("unauthenticated");

    resolveCurrentUser(user);
    await currentUser;
    expect(screen.getByTestId("status").textContent).toBe("unauthenticated");
    expect(screen.getByTestId("email").textContent).toBe("");
  });
});
