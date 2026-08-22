import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { LegalDocument } from "@/components/LegalDocument";
import { PageShell } from "@/components/PageShell";
import { getLegalDocument } from "@/legal/documents";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";

type TermsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const document = getLegalDocument(locale, "terms");

  return buildPageMetadata({
    locale,
    title: `${document.title} | SADIA`,
    description: document.description,
    href: routeKeys.terms,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale}>
      <LegalDocument document={getLegalDocument(locale, "terms")} />
    </PageShell>
  );
}
