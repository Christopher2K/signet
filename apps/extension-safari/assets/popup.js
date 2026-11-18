const applicationId = "co.signetapp.app";
const form = document.querySelector("#bookmark-form");
const titleInput = document.querySelector("#bookmark-title");
const titleError = document.querySelector("#title-error");
const urlElement = document.querySelector("#bookmark-url");
const statusElement = document.querySelector("#status");
const statusTitle = document.querySelector("#status-title");
const statusMessage = document.querySelector("#status-message");
const saveButton = document.querySelector("#save-button");
const openAppButton = document.querySelector("#open-app-button");

let bookmarkUrl = null;
let canSave = false;
let saving = false;

const translate = (key) => browser.i18n.getMessage(key);

document.documentElement.lang = browser.i18n.getUILanguage();
document.title = translate("popup_title");

for (const element of document.querySelectorAll("[data-i18n]")) {
  element.textContent = translate(element.dataset.i18n);
}

titleInput.disabled = true;

const showStatus = (state, titleKey, messageKey) => {
  statusElement.hidden = false;
  statusElement.dataset.state = state;
  statusTitle.textContent = titleKey ? translate(titleKey) : "";
  statusMessage.textContent = translate(messageKey);
};

const hideStatus = () => {
  statusElement.hidden = true;
  statusElement.removeAttribute("data-state");
  statusTitle.textContent = "";
  statusMessage.textContent = "";
};

const updateControls = () => {
  titleInput.disabled = !canSave || saving;
  saveButton.disabled = !canSave || saving;
  saveButton.textContent = translate(saving ? "saving" : "save");
};

const setOpenAppVisible = (visible) => {
  form.classList.toggle("signed-out", visible);
  openAppButton.hidden = !visible;
};

const sendNativeMessage = (message) =>
  browser.runtime.sendNativeMessage(applicationId, {
    ...message,
    language: browser.i18n.getUILanguage(),
  });

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
};

const initialize = async () => {
  try {
    const [tabs, session] = await Promise.all([
      browser.tabs.query({ active: true, currentWindow: true }),
      sendNativeMessage({ action: "getSession" }),
    ]);
    const tab = tabs[0];
    bookmarkUrl = tab?.url ?? null;

    if (!bookmarkUrl || !isHttpUrl(bookmarkUrl)) {
      showStatus("error", "", "unsupported_page");
      return;
    }

    titleInput.value = tab.title || bookmarkUrl;
    urlElement.textContent = bookmarkUrl;

    if (session?.status !== "ready") {
      setOpenAppVisible(true);
      showStatus("info", "signed_out_title", "signed_out_message");
      return;
    }

    canSave = true;
    hideStatus();
  } catch {
    showStatus("error", "", "load_failed");
  } finally {
    updateControls();
  }
};

titleInput.addEventListener("input", () => {
  titleInput.removeAttribute("aria-invalid");
  titleError.hidden = true;
  titleError.textContent = "";
});

openAppButton.addEventListener("click", () => {
  window.location.href = "signet://";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canSave || saving || !bookmarkUrl) return;

  const title = titleInput.value.trim();
  if (!title) {
    titleInput.setAttribute("aria-invalid", "true");
    titleError.textContent = translate("title_required");
    titleError.hidden = false;
    titleInput.focus();
    return;
  }

  saving = true;
  hideStatus();
  updateControls();

  try {
    const response = await sendNativeMessage({
      action: "saveBookmark",
      title,
      url: bookmarkUrl,
    });

    switch (response?.status) {
      case "saved":
        canSave = false;
        showStatus("success", "saved_title", "saved_message");
        break;
      case "duplicate":
        canSave = false;
        showStatus("duplicate", "already_saved_title", "already_saved_message");
        break;
      case "signedOut":
        canSave = false;
        setOpenAppVisible(true);
        showStatus("info", "signed_out_title", "signed_out_message");
        break;
      case "unauthorized":
        canSave = false;
        setOpenAppVisible(true);
        showStatus("error", "session_expired_title", "session_expired_message");
        break;
      case "offline":
        showStatus("error", "", "offline_message");
        break;
      default:
        showStatus("error", "", "save_failed");
    }
  } catch {
    showStatus("error", "", "save_failed");
  } finally {
    saving = false;
    updateControls();
  }
});

void initialize();
