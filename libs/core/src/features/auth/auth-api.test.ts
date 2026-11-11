import { describe, expect, it, vi } from "vitest";
import { createAuthApi } from "./auth-api";
import type { AuthError } from "./auth-errors";

const user = {
  email: "name@example.com",
  id: "user-id",
  name: "Jane Doe",
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });

describe("auth API", () => {
  it("uses the configured backend and returns the signup session", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        jsonResponse({ data: { token: "session-token", user } }, 201),
      );
    const api = createAuthApi({
      baseUrl: "https://bookmarks.example.com",
      fetch: fetchMock,
      getToken: () => null,
    });

    const session = await api.signup({
      email: user.email,
      name: user.name,
      password: "a secure password",
    });

    expect(session).toEqual({ token: "session-token", user });
    const request = fetchMock.mock.calls[0]?.[0];
    expect(request).toBeInstanceOf(Request);
    expect((request as Request).url).toBe(
      "https://bookmarks.example.com/api/v1/auth/signup",
    );
  });

  it("returns the current user with a bearer authorization header", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse({ data: user }));
    const api = createAuthApi({
      baseUrl: "https://bookmarks.example.com",
      fetch: fetchMock,
      getToken: () => "saved-token",
    });

    await expect(api.currentUser()).resolves.toEqual(user);
    const request = fetchMock.mock.calls[0]?.[0] as Request;
    expect(request.headers.get("Authorization")).toBe("Bearer saved-token");
  });

  it("normalizes invalid login responses", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: "invalid_credentials",
            message: "Invalid credentials",
          },
        },
        401,
      ),
    );
    const api = createAuthApi({
      baseUrl: "https://bookmarks.example.com",
      fetch: fetchMock,
      getToken: () => null,
    });

    const request = api.login({ email: user.email, password: "wrong" });
    await expect(request).rejects.toMatchObject({
      kind: "invalid_credentials",
      message: "Invalid credentials",
    } satisfies Partial<AuthError>);
  });
});
