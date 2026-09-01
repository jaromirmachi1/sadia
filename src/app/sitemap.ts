import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { getProjects } from "@/sanity/lib/fetch";
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

  const projects = await getProjects("cs");

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

  return entries;
}
