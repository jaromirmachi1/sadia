import type { Metadata } from "next";

import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/utils/routes";

import { resolveOgImage } from "./image";
import { getSiteUrl, openGraphLocale, siteName } from "./site";

type PageHref = Parameters<typeof getPathname>[0]["href"];

export type BuildPageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  href: PageHref;
  image?: Parameters<typeof resolveOgImage>[0];
  noIndex?: boolean;
};

export function buildPageMetadata({
  locale,
  title,
  description,
  href,
  image,
  noIndex = false,
}: BuildPageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const path = getPathname({ locale, href });
  const csPath = getPathname({ locale: "cs", href });
  const enPath = getPathname({ locale: "en", href });
  const ogImage = resolveOgImage(image);

  return {
    title,
    description,
    ...(noIndex
      ? { robots: { index: false, follow: true } }
      : {
          robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true },
          },
        }),
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      locale: openGraphLocale[locale],
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
    ...(siteUrl
      ? {
          alternates: {
            canonical: new URL(path, siteUrl).toString(),
            languages: {
              cs: new URL(csPath, siteUrl).toString(),
              en: new URL(enPath, siteUrl).toString(),
              "x-default": new URL(csPath, siteUrl).toString(),
            },
          },
        }
      : {}),
  };
}
