// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";
import type { Locale } from "./locale";
import { LocaleProvider, useLocale } from "./provider";

type TestCopyProps = {
  count: number;
};

const TestCopy = ({ count }: TestCopyProps) => {
  const { getLocale } = useLocale();
  const { t } = useTranslation("mobile");
  return (
    <div>
      <span>{t("common:appName")}</span>
      <span>{t("common:bookmarkCount", { count })}</span>
      <span>{getLocale()}</span>
    </div>
  );
};

const renderLocale = (locale: Locale, count = 1) => (
  <LocaleProvider locale={locale}>
    <TestCopy count={count} />
  </LocaleProvider>
);

describe("LocaleProvider", () => {
  it("renders English translations and singular plurals", () => {
    render(renderLocale("en"));
    expect(screen.getByText("Signet")).toBeTruthy();
    expect(screen.getByText("1 bookmark")).toBeTruthy();
    expect(screen.getByText("en")).toBeTruthy();
  });

  it("switches to French translations and plural rules", async () => {
    const { rerender } = render(renderLocale("en", 2));
    expect(screen.getByText("2 bookmarks")).toBeTruthy();
    rerender(renderLocale("fr", 2));
    expect(await screen.findByText("2 favoris")).toBeTruthy();
    expect(screen.getByText("fr")).toBeTruthy();
  });
});
