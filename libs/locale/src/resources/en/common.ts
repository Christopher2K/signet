export const common = {
  appName: "Signet",
  bookmarkCount_one: "{{count}} bookmark",
  bookmarkCount_other: "{{count}} bookmarks",
  errors: {
    unavailable:
      "Cannot reach the server. Check your connection and try again.",
    unknown: "Something went wrong. Please try again.",
  },
  validation: {
    emailInvalid: "Enter a valid email address.",
    emailRequired: "Email is required.",
    imageUrlInvalid: "Enter a valid absolute HTTP(S) image URL.",
    nameRequired: "Name is required.",
    nameTooLong: "Name must be 100 characters or fewer.",
    notesTooLong: "Notes must be 2000 characters or fewer.",
    passwordRequired: "Password is required.",
    passwordTooLong: "Password must be 128 characters or fewer.",
    passwordTooShort: "Password must be at least 12 characters.",
    serverUrlInvalid: "Enter a valid HTTP or HTTPS server URL.",
    serverUrlRequired: "Server URL is required.",
    titleRequired: "Enter a title.",
    urlInvalid: "Enter a valid absolute HTTP(S) URL.",
  },
} as const;
