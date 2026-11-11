import { resolveLocale } from "@signet/locale";
import { LocaleProvider } from "@signet/locale/react";
import { type ReactNode, useEffect } from "react";

/** Browser language preferences used for initial locale negotiation. */
type NavigatorLanguagePreferences = Pick<Navigator, "language" | "languages">;

/** Selects the first supported ordered browser language, defaulting to English. */
export const detectNavigatorLocale = (
  preferences: NavigatorLanguagePreferences,
) => resolveLocale([...(preferences.languages ?? []), preferences.language]);

/** App locale provider properties. */
type AppLocaleProviderProps = {
  children: ReactNode;
};

/** Provides the negotiated locale and keeps the document language synchronized. */
export const AppLocaleProvider = ({ children }: AppLocaleProviderProps) => {
  const locale = detectNavigatorLocale(window.navigator);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
};
