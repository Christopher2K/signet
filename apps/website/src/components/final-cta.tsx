import { useTranslation } from "@signet/locale/react";
import { quickstartUrl } from "#/links";

export const FinalCta = () => {
  const { t } = useTranslation("web");

  return (
    <section className="final-cta">
      <div className="page-shell">
        <div>
          <h2>{t("marketing.finalCta.title")}</h2>
          <p>{t("marketing.finalCta.description")}</p>
        </div>
        <a
          className="button button-primary"
          href={quickstartUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t("marketing.finalCta.action")}
        </a>
      </div>
    </section>
  );
};
