import { useTranslation } from "@signet/locale/react";

const platforms = [
  { key: "web", value: "webValue" },
  { key: "browser", value: "browserValue" },
  { key: "phone", value: "phoneValue" },
  { key: "server", value: "serverValue" },
] as const;

export const PlatformStrip = () => {
  const { t } = useTranslation("web");

  return (
    <section className="platform-strip">
      <div className="page-shell">
        {platforms.map((platform) => (
          <div key={platform.key}>
            <p>{t(`marketing.platforms.${platform.key}Label`)}</p>
            <strong>{t(`marketing.platforms.${platform.value}`)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
