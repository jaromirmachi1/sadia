import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/projects": {
      cs: "/projekty",
      en: "/projects",
    },
    "/projects/[slug]": {
      cs: "/projekty/[slug]",
      en: "/projects/[slug]",
    },
    "/about": {
      cs: "/o-nas",
      en: "/about",
    },
    "/we-buy": {
      cs: "/kupujeme",
      en: "/we-buy",
    },
    "/contact": {
      cs: "/kontakt",
      en: "/contact",
    },
    "/privacy": {
      cs: "/ochrana-osobnich-udaju",
      en: "/privacy",
    },
    "/cookies": {
      cs: "/cookies",
      en: "/cookies",
    },
    "/terms": {
      cs: "/podminky-pouziti",
      en: "/terms",
    },
  },
});
