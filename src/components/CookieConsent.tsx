"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Link } from "@/i18n/navigation";
import {
  CONSENT_OPEN_EVENT,
  readConsentCookie,
  writeConsentCookie,
  type CookieConsentValue,
} from "@/lib/cookie-consent";
import { routeKeys } from "@/utils/routes";

export function CookieConsent() {
  const t = useTranslations("Cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => {
      setVisible(readConsentCookie() === null);
    };

    sync();

    const onOpen = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);

    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, []);

  const choose = (value: CookieConsentValue) => {
    writeConsentCookie(value);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-text"
      className="fixed inset-x-0 bottom-0 z-[70] p-4 md:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-5 bg-sadia-navy-black px-6 py-6 text-sadia-white shadow-[0_-12px_40px_rgba(18,20,46,0.18)] md:flex-row md:items-end md:justify-between md:px-8 md:py-7">
        <div className="max-w-xl">
          <p
            id="cookie-consent-title"
            className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-white/55"
          >
            {t("bannerTitle")}
          </p>
          <p
            id="cookie-consent-text"
            className="mt-3 text-body-sm leading-relaxed text-sadia-white/78"
          >
            {t("bannerBody")}{" "}
            <Link
              href={routeKeys.cookies}
              className="underline underline-offset-4 hover:text-sadia-white"
            >
              {t("policyLink")}
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("necessary")}
            className="inline-flex min-h-11 items-center justify-center border border-sadia-white/25 px-5 text-body-sm font-semibold text-sadia-white transition-colors hover:border-sadia-white/60"
          >
            {t("necessary")}
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="inline-flex min-h-11 items-center justify-center bg-sadia-white px-5 text-body-sm font-semibold text-sadia-navy-black transition-opacity hover:opacity-90"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
