// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppLocaleProvider, detectNavigatorLocale } from "./app-locale";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("detectNavigatorLocale", () => {
  it("uses the first supported language in navigator order", () => {
    expect(
      detectNavigatorLocale({
        language: "en-US",
        languages: ["de-DE", "fr-CA", "en-GB"],
      }),
    ).toBe("fr");
  });

  it("falls back to navigator.language and then English", () => {
    expect(detectNavigatorLocale({ language: "fr-FR", languages: [] })).toBe(
      "fr",
    );
    expect(
      detectNavigatorLocale({ language: "de-DE", languages: ["es-ES"] }),
    ).toBe("en");
  });
});

describe("AppLocaleProvider", () => {
  it("synchronizes the document language with the negotiated locale", () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["fr-FR"]);
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("en-US");

    render(
      <AppLocaleProvider>
        <div />
      </AppLocaleProvider>,
    );

    expect(document.documentElement.lang).toBe("fr");
  });
});
