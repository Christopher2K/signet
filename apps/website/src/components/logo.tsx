import { useTranslation } from "@signet/locale/react";

/** Signet Stack mark and wordmark. */
export const Logo = () => {
  const { t } = useTranslation("common");

  return (
    <span className="logo">
      <svg
        aria-hidden="true"
        className="logo-mark"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3H16v22l-6-3.6L4 25V5.5Z"
          fill="var(--mist)"
        />
        <path
          d="M9 7.5A2.5 2.5 0 0 1 11.5 5H21v22l-6-3.6L9 27v-19.5Z"
          fill="var(--azure)"
        />
        <path
          d="M14 9.5A2.5 2.5 0 0 1 16.5 7H26v22l-6-3.6L14 29V9.5Z"
          fill="var(--cobalt)"
        />
      </svg>
      <span>{t("appName")}</span>
    </span>
  );
};
