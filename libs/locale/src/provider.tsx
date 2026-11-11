import { createInstance } from "i18next";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { defaultLocale, type Locale, supportedLocales } from "./locale";
import { resources } from "./resources";

/** Active language and a request-time language accessor. */
export type LocaleContextValue = {
  locale: Locale;
  getLocale: () => Locale;
};

const englishContext: LocaleContextValue = {
  getLocale: () => defaultLocale,
  locale: defaultLocale,
};

const LocaleContext = createContext<LocaleContextValue>(englishContext);

/** Localization provider properties. */
export type LocaleProviderProps = {
  children: ReactNode;
  /** Language selected by the client platform adapter. */
  locale: Locale;
};

/** Provides synchronous bundled translations and the active language. */
export const LocaleProvider = ({ children, locale }: LocaleProviderProps) => {
  const [i18n] = useState(() => {
    const instance = createInstance();
    void instance.use(initReactI18next).init({
      defaultNS: "common",
      fallbackLng: defaultLocale,
      initAsync: false,
      interpolation: { escapeValue: false },
      lng: locale,
      ns: ["common", "mobile", "web"],
      react: { useSuspense: false },
      resources,
      supportedLngs: [...supportedLocales],
    });
    return instance;
  });
  const localeRef = useRef(locale);
  localeRef.current = locale;

  const getLocale = useCallback(() => localeRef.current, []);

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  const value = useMemo(() => ({ getLocale, locale }), [getLocale, locale]);

  return (
    <LocaleContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  );
};

/** Returns the active language, defaulting to English in isolated tests. */
export const useLocale = (): LocaleContextValue => useContext(LocaleContext);
