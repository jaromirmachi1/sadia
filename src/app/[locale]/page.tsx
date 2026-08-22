import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AboutSection } from "@/sections/AboutSection";
import { BrandStatementSection } from "@/sections/BrandStatementSection";
import { CtaSection } from "@/sections/CtaSection";
import { HeroSection } from "@/sections/HeroSection";
import { ProjectsStackSection } from "@/sections/ProjectsStackSection";
import { getProjects } from "@/sanity/lib/fetch";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/seo/json-ld";
import { buildPageMetadata } from "@/seo/metadata";
import type { Locale } from "@/utils/routes";

type HomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home.metadata" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: "/",
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [projects, metadata] = await Promise.all([
    getProjects(locale),
    getTranslations({ locale, namespace: "Home.metadata" }),
  ]);

  const description = metadata("description");

  return (
    <>
      <SiteHeader locale={locale} variant="overlay" />
      <main>
        <HeroSection locale={locale} />
        <AboutSection />
        <ProjectsStackSection locale={locale} projects={projects} />
        <BrandStatementSection />
        <CtaSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      <JsonLd
        data={[
          buildOrganizationSchema(description),
          buildWebSiteSchema(locale, description),
        ]}
      />
    </>
  );
}
