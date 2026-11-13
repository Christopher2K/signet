import { defaultLocale, type Locale, resolveLocale } from "@signet/locale";
import { LocaleProvider } from "@signet/locale/react";
import { type ReactNode, useEffect, useState } from "react";

/** Browser language preferences used for locale negotiation. */
type NavigatorLanguagePreferences = Pick<Navigator, "language" | "languages">;

/** Selects the first supported browser language, defaulting to English. */
export const detectNavigatorLocale = (
  preferences: NavigatorLanguagePreferences,
) => resolveLocale([...(preferences.languages ?? []), preferences.language]);

/** App locale provider properties. */
type AppLocaleProviderProps = {
  children: ReactNode;
};

/** Provides the negotiated locale after static HTML hydration. */
export const AppLocaleProvider = ({ children }: AppLocaleProviderProps) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocale(detectNavigatorLocale(window.navigator));
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
};
