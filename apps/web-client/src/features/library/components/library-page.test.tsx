// @vitest-environment jsdom

import type { Bookmark } from "@signet/api";
import type { AuthApi } from "@signet/core/auth";
import { AuthProvider } from "@signet/core/auth/react";
import { LocaleProvider } from "@signet/locale/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "#/features/auth/components/route-guards";
import { LibraryPage } from "./library-page";

const user = {
  email: "reader@example.com",
  id: "user-id",
  name: "Reader",
};

const makeBookmark = (overrides: Partial<Bookmark> = {}): Bookmark => ({
  createdAt: "2026-11-09T12:00:00.000Z",
  id: "bookmark-1",
  image: null,
  notes: "Original notes",
  ownerId: user.id,
  tags: ["reading"],
  title: "Original bookmark",
  updatedAt: "2026-11-09T12:00:00.000Z",
  url: "https://example.com/article",
  ...overrides,
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });

const errorResponse = (
  status: number,
  code: string,
  message: string,
  details?: Record<string, string[]>,
) => jsonResponse({ error: { code, details, message } }, status);

type MockApiOptions = {
  createStatus?: number;
  detailStatus?: number;
  duplicateStatus?: number;
  initialBookmarks?: Bookmark[];
  listStatus?: number;
};

const createFetchMock = (options: MockApiOptions = {}) => {
  let bookmarks = options.initialBookmarks ?? [];
  let listRequests = 0;
  const postBodies: Array<Record<string, unknown>> = [];
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const request = new Request(input, init);
      const url = new URL(request.url);
      const method = request.method;
      if (url.pathname === "/api/v1/bookmarks" && method === "GET") {
        const duplicateUrl = url.searchParams.get("url");
        if (duplicateUrl) {
          if (options.duplicateStatus) {
            return errorResponse(
              options.duplicateStatus,
              "unavailable",
              "Duplicate lookup unavailable",
            );
          }
          return jsonResponse({
            data: bookmarks.filter((bookmark) => bookmark.url === duplicateUrl),
          });
        }
        listRequests += 1;
        if (options.listStatus) {
          return errorResponse(
            options.listStatus,
            "unavailable",
            "Library unavailable",
          );
        }
        return jsonResponse({ data: bookmarks });
      }
      if (url.pathname === "/api/v1/bookmarks" && method === "POST") {
        if (options.createStatus === 422) {
          return errorResponse(422, "validation_failed", "Validation failed", {
            title: ["Title was rejected by the server"],
          });
        }
        const body = (await request.json()) as Partial<Bookmark>;
        postBodies.push(body as Record<string, unknown>);
        const bookmark = makeBookmark({
          createdAt: "2026-11-10T12:00:00.000Z",
          id: `bookmark-${bookmarks.length + 2}`,
          image: body.image ?? null,
          notes: body.notes ?? null,
          tags: body.tags ?? [],
          title: body.title ?? "Untitled",
          updatedAt: "2026-11-10T12:00:00.000Z",
          url: body.url ?? "https://example.com",
        });
        bookmarks = [bookmark, ...bookmarks];
        return jsonResponse({ data: bookmark }, 201);
      }
      const detailMatch = url.pathname.match(/^\/api\/v1\/bookmarks\/(.+)$/);
      if (detailMatch) {
        const id = detailMatch[1];
        const bookmark = bookmarks.find((item) => item.id === id);
        if (options.detailStatus === 404 || !bookmark) {
          return errorResponse(404, "not_found", "Bookmark not found");
        }
        if (method === "GET") {
          return jsonResponse({ data: bookmark });
        }
        if (method === "PATCH") {
          const body = (await request.json()) as Partial<Bookmark>;
          const updated = {
            ...bookmark,
            ...body,
            updatedAt: "2026-11-10T13:00:00.000Z",
          };
          bookmarks = bookmarks.map((item) =>
            item.id === id ? updated : item,
          );
          return jsonResponse({ data: updated });
        }
        if (method === "DELETE") {
          bookmarks = bookmarks.filter((item) => item.id !== id);
          return new Response(null, { status: 204 });
        }
      }
      return errorResponse(404, "not_found", "Not found");
    },
  );
  return { fetchMock, getListRequests: () => listRequests, postBodies };
};

const authApi: AuthApi = {
  currentUser: vi.fn().mockResolvedValue(user),
  login: vi.fn(),
  logout: vi.fn().mockResolvedValue(undefined),
  signup: vi.fn(),
};

const renderLibrary = (locale: "en" | "fr" = "en") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <LocaleProvider locale={locale}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider api={authApi} defaultServerUrl="https://api.example.com">
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        </AuthProvider>
      </QueryClientProvider>
    </LocaleProvider>,
  );
  return queryClient;
};

const openCreateDialog = async () => {
  await screen.findByRole("heading", { name: "All Bookmarks" });
  fireEvent.click(screen.getByRole("button", { name: "New Bookmark" }));
  return screen.findByRole("dialog", { name: "New Bookmark" });
};

const fillRequiredFields = (title = "New article", url?: string) => {
  fireEvent.change(screen.getByLabelText("Link"), {
    target: { value: url ?? "https://new.example.com/story" },
  });
  fireEvent.change(screen.getByLabelText("Title"), {
    target: { value: title },
  });
};

describe("LibraryPage", () => {
  beforeEach(() => {
    window.localStorage.setItem("signet.session.token", "stored-token");
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders newest-first bookmarks and switches layouts", async () => {
    const api = createFetchMock({
      initialBookmarks: [
        makeBookmark(),
        makeBookmark({
          id: "bookmark-2",
          title: "Older bookmark",
          url: "https://old.example.com",
        }),
      ],
    });
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary();

    expect(await screen.findByText("Original bookmark")).toBeTruthy();
    expect(screen.getByText("Older bookmark")).toBeTruthy();
    expect(screen.getByText("2 bookmarks · Newest first")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Grid view" }));
    expect(
      screen
        .getByRole("button", { name: "Grid view" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("shows empty and request-error states with retry", async () => {
    const emptyApi = createFetchMock();
    vi.stubGlobal("fetch", emptyApi.fetchMock);
    const { unmount } = render(
      <LocaleProvider locale="en">
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider
            api={authApi}
            defaultServerUrl="https://api.example.com"
          >
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          </AuthProvider>
        </QueryClientProvider>
      </LocaleProvider>,
    );
    expect(await screen.findByText("No bookmarks yet")).toBeTruthy();
    unmount();

    const errorApi = createFetchMock({ listStatus: 500 });
    vi.stubGlobal("fetch", errorApi.fetchMock);
    renderLibrary();
    expect(
      await screen.findByText("Couldn't load your bookmarks"),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
  });

  it("validates required fields and creates with normalized values", async () => {
    const api = createFetchMock();
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary();
    await openCreateDialog();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Enter a title.")).toBeTruthy();
    expect(
      screen.getByText("Enter a valid absolute HTTP(S) URL."),
    ).toBeTruthy();
    expect(api.fetchMock).toHaveBeenCalledTimes(1);

    fillRequiredFields("  New article  ");
    fireEvent.change(screen.getByLabelText("Tags (optional)"), {
      target: { value: " Work, reading, WORK " },
    });
    fireEvent.change(screen.getByLabelText("Notes (optional)"), {
      target: { value: "Useful reference" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("New article")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(api.postBodies).toHaveLength(1);
    expect(api.postBodies[0]?.title).toBe("New article");
    expect(api.postBodies[0]?.tags).toEqual(["work", "reading"]);
    expect(api.getListRequests()).toBe(1);
  });

  it("warns about duplicates and saves another entry on demand", async () => {
    const api = createFetchMock({ initialBookmarks: [makeBookmark()] });
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary();
    await openCreateDialog();
    fillRequiredFields("Duplicate article", "https://example.com/article");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Already saved")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Save anyway" }));
    expect(await screen.findByText("Duplicate article")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(api.postBodies).toHaveLength(1);
  });

  it("allows a deliberate save when duplicate lookup fails", async () => {
    const api = createFetchMock({ duplicateStatus: 500 });
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary();
    await openCreateDialog();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Couldn't check for duplicates"),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Save anyway" }));
    expect(await screen.findByText("New article")).toBeTruthy();
  });

  it("opens an existing duplicate for editing", async () => {
    const api = createFetchMock({ initialBookmarks: [makeBookmark()] });
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary();
    await openCreateDialog();
    fillRequiredFields("Duplicate article", "https://example.com/article");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Open existing" }),
    );

    expect(
      await screen.findByRole("dialog", { name: "Edit Bookmark" }),
    ).toBeTruthy();
    expect(await screen.findByDisplayValue("Original bookmark")).toBeTruthy();
  });

  it("updates a bookmark and its cached list entry", async () => {
    const api = createFetchMock({ initialBookmarks: [makeBookmark()] });
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary();
    fireEvent.click(
      await screen.findByRole("button", { name: "Edit Original bookmark" }),
    );
    expect(await screen.findByDisplayValue("Original bookmark")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated bookmark" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Updated bookmark")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(api.getListRequests()).toBe(1);
  });

  it("deletes a bookmark after confirmation", async () => {
    const api = createFetchMock({ initialBookmarks: [makeBookmark()] });
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary();
    fireEvent.click(
      await screen.findByRole("button", { name: "Edit Original bookmark" }),
    );
    fireEvent.click(await screen.findByRole("button", { name: "Delete" }));
    expect(
      await screen.findByRole("dialog", { name: "Delete Bookmark" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByText("No bookmarks yet")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders French UI, plurals, accessibility labels, and validation", async () => {
    const api = createFetchMock({ initialBookmarks: [makeBookmark()] });
    vi.stubGlobal("fetch", api.fetchMock);
    renderLibrary("fr");

    expect(await screen.findByText("Original bookmark")).toBeTruthy();
    expect(screen.getByText("1 favori · Plus récents en premier")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Modifier Original bookmark" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Nouveau favori" }));
    expect(
      await screen.findByRole("dialog", { name: "Nouveau favori" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(await screen.findByText("Saisissez un titre.")).toBeTruthy();
    expect(
      screen.getByText("Saisissez une URL HTTP(S) absolue valide."),
    ).toBeTruthy();
  });

  it("translates core network errors while preserving API messages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );
    renderLibrary("fr");

    expect(
      await screen.findByText(
        "Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.",
      ),
    ).toBeTruthy();
  });

  it("shows server validation and inaccessible-record errors", async () => {
    const validationApi = createFetchMock({ createStatus: 422 });
    vi.stubGlobal("fetch", validationApi.fetchMock);
    const { unmount } = render(
      <LocaleProvider locale="en">
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider
            api={authApi}
            defaultServerUrl="https://api.example.com"
          >
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          </AuthProvider>
        </QueryClientProvider>
      </LocaleProvider>,
    );
    await openCreateDialog();
    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(
      await screen.findByText("Title was rejected by the server"),
    ).toBeTruthy();
    unmount();

    const missingApi = createFetchMock({
      detailStatus: 404,
      initialBookmarks: [makeBookmark()],
    });
    vi.stubGlobal("fetch", missingApi.fetchMock);
    renderLibrary();
    fireEvent.click(
      await screen.findByRole("button", { name: "Edit Original bookmark" }),
    );
    expect(await screen.findByText("Bookmark not found")).toBeTruthy();
  });
});
