"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import {
  CONSENT_UPDATED_EVENT,
  readConsentCookie,
} from "@/lib/cookie-consent";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAllowed(readConsentCookie() === "all");
    };

    sync();
    window.addEventListener(CONSENT_UPDATED_EVENT, sync);

    return () => {
      window.removeEventListener(CONSENT_UPDATED_EVENT, sync);
    };
  }, []);

  if (!measurementId || !allowed) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="sadia-ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
