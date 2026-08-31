import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaAnchor } from "@/components/CtaLink";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { WeBuyForm } from "@/components/WeBuyForm";
import { getSiteSettings } from "@/sanity/lib/fetch";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";
import weBuyHero from "@/images/byt_koblizna_said_15_1.webp";

type WeBuyPageProps = {
  params: Promise<{ locale: Locale }>;
};

const lookingKeys = [
  "residential",
  "admin",
  "land",
  "shares",
  "projects",
] as const;

const whyKeys = ["capital", "direct", "history", "potential"] as const;

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="sadia-eyebrow">{children}</p>;
}

export async function generateMetadata({
  params,
}: WeBuyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "WeBuy.metadata" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.weBuy,
  });
}

export default async function WeBuyPage({ params }: WeBuyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, contact, settings] = await Promise.all([
    getTranslations("WeBuy"),
    getTranslations("Contact"),
    getSiteSettings(locale),
  ]);

  return (
    <PageShell locale={locale}>
      <section className="bg-sadia-white pt-16 pb-[clamp(4rem,8vw,6rem)]">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="lg:col-span-6">
              <SectionEyebrow>{t("eyebrow")}</SectionEyebrow>
              <h1 className="sadia-heading-page mt-6 max-w-[12ch]">{t("title")}</h1>
              <p className="sadia-lead-md mt-6 max-w-lg">{t("description")}</p>
              <CtaAnchor href="#offer" className="mt-10">
                {t("cta")}
              </CtaAnchor>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-6">
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-sadia-gray-light lg:aspect-[4/5]">
                <Image
                  src={weBuyHero}
                  alt={t("imageAlt")}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 46vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-sadia-gray-light/80 bg-sadia-white py-section-lg">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="lg:col-span-4">
              <SectionEyebrow>01</SectionEyebrow>
              <h2 className="sadia-heading-section mt-4 max-w-[10ch]">
                {t("lookingTitle")}
              </h2>
              <p className="mt-5 max-w-sm text-body-lg leading-relaxed text-sadia-gray">
                {t("lookingDescription")}
              </p>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-8">
              <ul className="grid gap-3 sm:grid-cols-2">
                {lookingKeys.map((key, index) => (
                  <li
                    key={key}
                    className="flex gap-4 rounded-xl bg-muted/60 px-5 py-5 text-body-base text-sadia-navy-black"
                  >
                    <span className="shrink-0 font-display text-body-sm font-medium text-[#4A90C0]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-snug">{t(`looking.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div
            id="offer"
            className="mt-section-sm scroll-mt-24 border-t border-sadia-gray-light/80 pt-section-sm"
          >
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10 lg:items-start">
              <Reveal className="lg:col-span-4">
                <SectionEyebrow>{t("formEyebrow")}</SectionEyebrow>
                <h2 className="sadia-heading-section mt-4 max-w-[12ch]">
                  {t("formTitle")}
                </h2>
                <p className="mt-5 max-w-sm text-body-lg leading-relaxed text-sadia-gray">
                  {t("formDescription")}
                </p>

                <a
                  href={`mailto:${settings.email}`}
                  className="mt-10 block rounded-xl bg-muted/60 px-5 py-4 transition-colors hover:bg-muted"
                >
                  <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-gray">
                    {contact("email")}
                  </p>
                  <p className="mt-1 font-medium text-sadia-navy-black">
                    {settings.email}
                  </p>
                </a>
              </Reveal>

              <Reveal delay={0.08} className="lg:col-span-8">
                <WeBuyForm />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-muted/50 py-section-lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="lg:col-span-5">
              <SectionEyebrow>02</SectionEyebrow>
              <h2 className="sadia-heading-page mt-4 max-w-[14ch]">
                {t("whyTitle")}
              </h2>
              <p className="mt-6 max-w-md text-body-lg leading-relaxed text-sadia-gray">
                {t("whyDescription")}
              </p>
            </Reveal>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {whyKeys.map((key, index) => (
                <Reveal key={key} delay={index * 0.05}>
                  <article className="h-full rounded-xl bg-sadia-white px-6 py-7">
                    <p className="font-display text-body-sm font-medium text-[#4A90C0]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 font-display text-heading-md font-medium text-sadia-navy-black">
                      {t(`why.${key}.title`)}
                    </h3>
                    <p className="mt-3 text-body-base leading-relaxed text-sadia-navy-black/65">
                      {t(`why.${key}.text`)}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-sadia-navy-black py-[clamp(5rem,10vw,8rem)] text-sadia-white">
        <Container>
          <Reveal className="max-w-3xl">
            <SectionEyebrow>
              <span className="text-sadia-white/40">03</span>
            </SectionEyebrow>
            <h2 className="sadia-heading-page mt-6 max-w-[16ch]">
              {t("statementTitle")}
            </h2>
            <p className="mt-8 max-w-2xl text-body-lg leading-relaxed text-sadia-white/55">
              {t("statementDescription")}
            </p>
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}
