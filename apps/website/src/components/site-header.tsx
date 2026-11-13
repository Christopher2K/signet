import { useTranslation } from "@signet/locale/react";
import { Logo } from "#/components/logo";

export const SiteHeader = () => {
  const { t } = useTranslation("web");

  return (
    <header className="site-header page-shell">
      <a className="brand-link" href="#top" aria-label="Signet">
        <Logo />
      </a>
      <nav className="site-nav" aria-label={t("marketing.nav.features")}>
        <a href="#features">{t("marketing.nav.features")}</a>
        <a href="#how-it-works">{t("marketing.nav.howItWorks")}</a>
      </nav>
      <a className="button button-small button-outline" href="#self-host">
        {t("marketing.nav.selfHost")}
      </a>
    </header>
  );
};
