import {
  ArrowsClockwise,
  type Icon,
  MagnifyingGlass,
  ShareNetwork,
  WifiSlash,
} from "@phosphor-icons/react";
import { useTranslation } from "@signet/locale/react";
import { SectionIntro } from "#/components/section-intro";

/** Translated feature content and its icon. */
type Feature = {
  key: "sync" | "offline" | "organize" | "share";
  icon: Icon;
};

const features: Feature[] = [
  { key: "sync", icon: ArrowsClockwise },
  { key: "offline", icon: WifiSlash },
  { key: "organize", icon: MagnifyingGlass },
  { key: "share", icon: ShareNetwork },
];

export const FeatureGrid = () => {
  const { t } = useTranslation("web");

  return (
    <section className="features page-shell section-space" id="features">
      <SectionIntro
        eyebrow={t("marketing.features.eyebrow")}
        title={t("marketing.features.title")}
        description={t("marketing.features.description")}
      />
      <div className="feature-grid">
        {features.map((feature) => {
          const FeatureIcon = feature.icon;

          return (
            <article className="feature-card" key={feature.key}>
              <FeatureIcon size={26} aria-hidden="true" />
              <h3>{t(`marketing.features.${feature.key}Title`)}</h3>
              <p>{t(`marketing.features.${feature.key}Description`)}</p>
              <p className="feature-note">
                {t(`marketing.features.${feature.key}Note`)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};
