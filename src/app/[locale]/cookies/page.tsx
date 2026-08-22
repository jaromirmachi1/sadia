import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { LegalDocument } from "@/components/LegalDocument";
import { PageShell } from "@/components/PageShell";
import { getLegalDocument } from "@/legal/documents";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";

type CookiesPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: CookiesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const document = getLegalDocument(locale, "cookies");

  return buildPageMetadata({
    locale,
    title: `${document.title} | SADIA`,
    description: document.description,
    href: routeKeys.cookies,
  });
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale}>
      <LegalDocument document={getLegalDocument(locale, "cookies")}>
        <CookieSettingsButton />
      </LegalDocument>
    </PageShell>
  );
}
