import { common as commonEn } from "./en/common";
import { mobile as mobileEn } from "./en/mobile";
import { safari as safariEn } from "./en/safari";
import { web as webEn } from "./en/web";
import { common as commonFr } from "./fr/common";
import { mobile as mobileFr } from "./fr/mobile";
import { safari as safariFr } from "./fr/safari";
import { web as webFr } from "./fr/web";

/** Statically bundled translations for both client applications. */
export const resources = {
  en: { common: commonEn, mobile: mobileEn, safari: safariEn, web: webEn },
  fr: { common: commonFr, mobile: mobileFr, safari: safariFr, web: webFr },
} as const;
