import { useTranslation } from "@signet/locale/react";
import { Logo } from "#/components/logo";
import { githubUrl } from "#/links";

export const SiteFooter = () => {
  const { t } = useTranslation("web");

  return (
    <footer className="site-footer page-shell">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo />
          <p>{t("marketing.footer.tagline")}</p>
        </div>
        <nav className="footer-links" aria-label={t("marketing.footer.github")}>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            {t("marketing.footer.github")}
          </a>
          <a href="#self-host">{t("marketing.footer.selfHost")}</a>
        </nav>
      </div>
      <p className="footer-note">{t("marketing.footer.note")}</p>
    </footer>
  );
};
