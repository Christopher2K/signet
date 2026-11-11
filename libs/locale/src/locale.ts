/** Languages supported by the client applications. */
export const supportedLocales = ["en", "fr"] as const;

/** Supported client language. */
export type Locale = (typeof supportedLocales)[number];

/** Language used when no supported preference is available. */
export const defaultLocale = "en" satisfies Locale;

/** Returns a supported language for a BCP 47 language tag. */
export const normalizeLocale = (
  languageTag: string | null | undefined,
): Locale | null => {
  const language = languageTag?.trim().split(/[-_]/)[0]?.toLowerCase();
  return supportedLocales.find((locale) => locale === language) ?? null;
};

/** Selects the first supported language from ordered preferences. */
export const resolveLocale = (
  languageTags: readonly (string | null | undefined)[],
): Locale => {
  for (const languageTag of languageTags) {
    const locale = normalizeLocale(languageTag);
    if (locale) {
      return locale;
    }
  }
  return defaultLocale;
};
