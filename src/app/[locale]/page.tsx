import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AboutSection } from "@/sections/AboutSection";
import { BrandStatementSection } from "@/sections/BrandStatementSection";
import { CtaSection } from "@/sections/CtaSection";
import { HeroSection } from "@/sections/HeroSection";
import { ProjectsStackSection } from "@/sections/ProjectsStackSection";
import { StatsSection } from "@/sections/StatsSection";
import {
  getHomeStats,
  getProjects,
} from "@/sanity/lib/fetch";
import type { Locale } from "@/utils/routes";

type HomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.metadata" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "SADIA",
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : "en_GB",
    },
    twitter: {
      card: "summary",
      title: t("title"),
      description: t("description"),
    },
    ...(siteUrl
      ? {
          alternates: {
            canonical: new URL(locale === "cs" ? "/" : "/en", siteUrl),
            languages: {
              cs: new URL("/", siteUrl),
              en: new URL("/en", siteUrl),
            },
          },
        }
      : {}),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [stats, projects, metadata] = await Promise.all([
    getHomeStats(locale),
    getProjects(locale),
    getTranslations({ locale, namespace: "Home.metadata" }),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SADIA",
    description: metadata("description"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Radnická 376/11",
      addressLocality: "Brno",
      addressCountry: "CZ",
    },
  };

  return (
    <>
      <SiteHeader locale={locale} variant="overlay" />
      <main>
        <HeroSection locale={locale} />
        <AboutSection />
        <StatsSection locale={locale} stats={stats} />
        <ProjectsStackSection locale={locale} projects={projects} />
        <BrandStatementSection />
        <CtaSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
