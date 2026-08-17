import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/Container";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { routeKeys, type Locale } from "@/utils/routes";

type AboutPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <PageShell locale={locale}>
      <section className="bg-sadia-white pb-section-lg pt-16">
        <Container>
          <Reveal>
            <p className="text-body-sm font-medium uppercase tracking-[0.18em] text-sadia-gray">
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 max-w-[14ch] text-display-md font-medium text-balance text-sadia-navy-black">
              {t("title")}
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="bg-sadia-white py-section-lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
              <h2 className="max-w-[12ch] text-heading-lg font-medium text-sadia-navy">
                {t("approachTitle")}
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="space-y-6 text-body-lg text-sadia-navy-black/75">
              <p>{t("p1")}</p>
              <p>{t("p2")}</p>
              <p>{t("p3")}</p>
            </Reveal>
          </div>

          <Reveal className="mt-section-sm border-t border-sadia-gray-light pt-section-sm">
            <h2 className="text-heading-lg font-medium text-sadia-navy">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 max-w-xl text-body-lg text-sadia-gray">
              {t("ctaDescription")}
            </p>
            <Link
              href={routeKeys.contact}
              className="mt-8 inline-flex min-h-12 items-center justify-center bg-sadia-navy-black px-7 text-body-sm font-semibold text-sadia-white transition-opacity hover:opacity-90"
            >
              {t("cta")}
            </Link>
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}
