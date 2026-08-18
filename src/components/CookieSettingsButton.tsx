"use client";

import { useTranslations } from "next-intl";

import { openCookieSettings } from "@/lib/cookie-consent";

export function CookieSettingsButton() {
  const t = useTranslations("Cookies");

  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="sadia-underline-link mt-8 inline-flex pb-1 text-body-sm font-semibold uppercase tracking-[0.14em] text-sadia-navy-black"
    >
      {t("settings")}
    </button>
  );
}
