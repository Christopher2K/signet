import { Check, Copy } from "@phosphor-icons/react";
import { useTranslation } from "@signet/locale/react";
import { useState } from "react";
import { githubUrl, quickstartUrl } from "#/links";

const pullCommand = "docker compose pull";
const upCommand = "docker compose up -d";
const commands = `${pullCommand}\n${upCommand}`;
const checklist = ["noTelemetry", "multiUser", "persistence", "https"] as const;

export const SelfHost = () => {
  const { t } = useTranslation("web");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands);
    setCopied(true);
  };

  return (
    <section className="self-host page-shell section-space" id="self-host">
      <div className="self-host-copy">
        <p className="eyebrow">{t("marketing.selfHost.eyebrow")}</p>
        <h2>{t("marketing.selfHost.title")}</h2>
        <p>{t("marketing.selfHost.description")}</p>
        <ul>
          {checklist.map((item) => (
            <li key={item}>
              <Check size={18} weight="bold" aria-hidden="true" />
              <span>{t(`marketing.selfHost.${item}`)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="terminal-card">
        <div className="terminal-heading">
          <span>{t("marketing.selfHost.terminalLabel")}</span>
          <button
            type="button"
            className="icon-button"
            onClick={handleCopy}
            aria-label={t("marketing.selfHost.copyCommands")}
            title={t("marketing.selfHost.copyCommands")}
          >
            {copied ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <Copy size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        <p>{t("marketing.selfHost.terminalDescription")}</p>
        <pre>{pullCommand}</pre>
        <pre>{upCommand}</pre>
        <p className="terminal-note">{t("marketing.selfHost.commandNote")}</p>
        <span className="copy-feedback" aria-live="polite">
          {copied ? t("marketing.selfHost.copiedCommands") : ""}
        </span>
        <div className="button-row">
          <a
            className="button button-light"
            href={quickstartUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t("marketing.selfHost.readQuickstart")}
          </a>
          <a
            className="button button-dark-outline"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t("marketing.selfHost.viewGitHub")}
          </a>
        </div>
      </div>
    </section>
  );
};
