import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { getAllUnits, getNewsArticles, getProjects } from "@/sanity/lib/fetch";
import { indexableStaticRoutes } from "@/seo/routes";
import { getMetadataBase } from "@/seo/site";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getMetadataBase();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of indexableStaticRoutes) {
      entries.push({
        url: new URL(getPathname({ locale, href: route }), base).toString(),
        lastModified: now,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1 : route === "/projects" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((altLocale) => [
              altLocale,
              new URL(
                getPathname({ locale: altLocale, href: route }),
                base,
              ).toString(),
            ]),
          ),
        },
      });
    }
  }

  const [projects, units, newsArticles] = await Promise.all([
    getProjects("cs"),
    getAllUnits("cs"),
    getNewsArticles("cs"),
  ]);

  for (const project of projects) {
    const href = {
      pathname: "/projects/[slug]" as const,
      params: { slug: project.slug },
    };

    entries.push({
      url: new URL(getPathname({ locale: "cs", href }), base).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            new URL(getPathname({ locale, href }), base).toString(),
          ]),
        ),
      },
    });
  }

  for (const unit of units) {
    const href = {
      pathname: "/flat/[slug]" as const,
      params: { slug: unit.slug },
    };

    entries.push({
      url: new URL(getPathname({ locale: "cs", href }), base).toString(),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            new URL(getPathname({ locale, href }), base).toString(),
          ]),
        ),
      },
    });
  }

  for (const article of newsArticles) {
    const href = {
      pathname: "/news/[slug]" as const,
      params: { slug: article.slug },
    };

    entries.push({
      url: new URL(getPathname({ locale: "cs", href }), base).toString(),
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            new URL(getPathname({ locale, href }), base).toString(),
          ]),
        ),
      },
    });
  }

  return entries;
}
