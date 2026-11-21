import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { browser } from "wxt/browser";
import { fakeBrowser } from "wxt/testing/fake-browser";
import { Popup } from "./popup";

const actEnvironment = globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};
actEnvironment.IS_REACT_ACT_ENVIRONMENT = true;

const getElement = <T extends HTMLElement>(id: string): T => {
  const element = document.querySelector<T>(`#${id}`);
  if (!element) throw new Error(`Missing test element: ${id}`);
  return element;
};

const setTitle = async (value: string): Promise<void> => {
  const input = getElement<HTMLInputElement>("bookmark-title");
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  await act(async () => {
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const submitForm = async (): Promise<void> => {
  await act(async () => {
    getElement<HTMLFormElement>("bookmark-form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );
  });
};

describe("Safari popup", () => {
  let language = "en";
  let reactRoot: Root;
  let rootElement: HTMLDivElement;
  let sendNativeMessage: ReturnType<typeof vi.fn>;

  const renderPopup = async (): Promise<void> => {
    await act(async () => {
      reactRoot.render(<Popup />);
    });
  };

  beforeEach(async () => {
    fakeBrowser.reset();
    await fakeBrowser.windows.create({ focused: true });
    language = "en";
    rootElement = document.createElement("div");
    document.body.append(rootElement);
    reactRoot = createRoot(rootElement);

    Object.defineProperty(browser, "i18n", {
      configurable: true,
      value: {
        getMessage: (key: string) => key,
        getUILanguage: () => language,
      },
    });
    sendNativeMessage = vi.fn(
      async (_applicationId: string, message: { action: string }) => ({
        status: message.action === "getSession" ? "ready" : "saved",
      }),
    );
    Object.defineProperty(browser.runtime, "sendNativeMessage", {
      configurable: true,
      value: sendNativeMessage,
    });
  });

  afterEach(async () => {
    await act(async () => {
      reactRoot.unmount();
    });
    rootElement.remove();
  });

  it("loads the active tab and enables saving for a ready session", async () => {
    await fakeBrowser.tabs.create({
      active: true,
      url: "https://example.com/article",
    });

    await renderPopup();

    expect(getElement<HTMLInputElement>("bookmark-title").value).toBe(
      "https://example.com/article",
    );
    expect(getElement<HTMLInputElement>("bookmark-title").disabled).toBe(false);
    expect(getElement<HTMLButtonElement>("save-button").disabled).toBe(false);
    expect(getElement("bookmark-url").textContent).toBe(
      "https://example.com/article",
    );
  });

  it("rejects unsupported pages before showing the save controls", async () => {
    await fakeBrowser.tabs.create({ active: true, url: "about:blank" });

    await renderPopup();

    expect(getElement("status-message").textContent).toBe("unsupported_page");
    expect(getElement("bookmark-url").textContent).toBe("");
    expect(getElement<HTMLInputElement>("bookmark-title").disabled).toBe(true);
    expect(getElement<HTMLButtonElement>("save-button").disabled).toBe(true);
  });

  it("validates an empty title without sending a save request", async () => {
    await fakeBrowser.tabs.create({ active: true, url: "https://example.com" });
    await renderPopup();
    await setTitle("  ");

    await submitForm();

    expect(getElement("title-error").textContent).toBe("title_required");
    expect(getElement("bookmark-title").getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(sendNativeMessage).toHaveBeenCalledTimes(1);
  });

  it("sends a trimmed bookmark and localized native request", async () => {
    language = "fr";
    await fakeBrowser.tabs.create({
      active: true,
      url: "https://example.com/",
    });
    await renderPopup();
    await setTitle("  Exemple  ");

    await submitForm();

    expect(getElement("status-message").textContent).toBe("saved_message");
    expect(sendNativeMessage).toHaveBeenLastCalledWith("co.signetapp.app", {
      action: "saveBookmark",
      title: "Exemple",
      url: "https://example.com/",
      language: "fr",
    });
    expect(getElement<HTMLButtonElement>("save-button").disabled).toBe(true);
  });
});
