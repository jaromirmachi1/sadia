import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { LegalDocument } from "@/components/LegalDocument";
import { PageShell } from "@/components/PageShell";
import { getLegalDocument } from "@/legal/documents";
import type { Locale } from "@/utils/routes";

type PrivacyPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const document = getLegalDocument(locale, "privacy");

  return {
    title: `${document.title} | SADIA`,
    description: document.description,
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageShell locale={locale}>
      <LegalDocument document={getLegalDocument(locale, "privacy")} />
    </PageShell>
  );
}
