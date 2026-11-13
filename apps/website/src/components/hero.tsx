import { BookmarkSimple } from "@phosphor-icons/react";
import { useTranslation } from "@signet/locale/react";
import { githubUrl } from "#/links";

const clients = ["web", "browser", "phone"] as const;

export const Hero = () => {
  const { t } = useTranslation("web");

  return (
    <section className="hero page-shell" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{t("marketing.hero.eyebrow")}</p>
        <h1>
          <span>{t("marketing.hero.titleStart")}</span>
          <span className="cobalt">{t("marketing.hero.titleEnd")}</span>
        </h1>
        <p className="hero-description">{t("marketing.hero.description")}</p>
        <div className="button-row">
          <a className="button button-primary" href="#self-host">
            {t("marketing.hero.primaryAction")}
          </a>
          <a
            className="button button-outline"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t("marketing.hero.secondaryAction")}
          </a>
        </div>
        <p className="fine-print">{t("marketing.hero.note")}</p>
      </div>
      <aside className="client-card">
        <div className="client-card-heading">
          <BookmarkSimple size={32} weight="fill" aria-hidden="true" />
          <p>
            <span className="client-title-line">
              {t("marketing.clients.titleStart")}
            </span>
            <span className="client-title-line">
              {t("marketing.clients.titleEnd")}
            </span>
          </p>
        </div>
        <ol className="client-list">
          {clients.map((client, index) => (
            <li key={client}>
              <span className="client-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{t(`marketing.clients.${client}Label`)}</h2>
                <p>{t(`marketing.clients.${client}Description`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  );
};
