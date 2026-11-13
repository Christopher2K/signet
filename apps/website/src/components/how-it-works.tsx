import { useTranslation } from "@signet/locale/react";
import { SectionIntro } from "#/components/section-intro";

const steps = ["capture", "organize", "access"] as const;

export const HowItWorks = () => {
  const { t } = useTranslation("web");

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="page-shell section-space">
        <SectionIntro
          eyebrow={t("marketing.howItWorks.eyebrow")}
          title={t("marketing.howItWorks.title")}
          description={t("marketing.howItWorks.description")}
        />
        <div className="steps-grid">
          {steps.map((step, index) => (
            <article className="step-card" key={step}>
              <span className="step-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{t(`marketing.howItWorks.${step}Title`)}</h3>
              <p>{t(`marketing.howItWorks.${step}Description`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
