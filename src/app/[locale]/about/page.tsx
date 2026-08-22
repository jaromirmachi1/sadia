import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
import { HeroMotion } from "@/components/HeroMotion";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";
import aboutHero from "@/images/byt_koblizna_said_15_1.webp";
import kobliznaFacade from "@/images/koblizna.jpg";

type AboutPageProps = {
  params: Promise<{ locale: Locale }>;
};

const chapterKeys = ["place", "craft", "team"] as const;
const principleKeys = ["place", "craft", "centre", "time"] as const;

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.metadata" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.about,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");

  return (
    <PageShell locale={locale} headerVariant="overlay">
      <section
        aria-labelledby="about-hero-title"
        data-header-theme="dark"
        className="relative min-h-svh overflow-hidden bg-sadia-navy-black text-sadia-white"
      >
        <div className="absolute inset-0" data-hero-media>
          <Image
            src={aboutHero}
            alt={t("heroImageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,46,0.5)_0%,rgba(18,20,46,0.18)_28%,rgba(18,20,46,0.22)_52%,rgba(18,20,46,0.88)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[12rem] bg-[linear-gradient(180deg,rgba(18,20,46,0.55)_0%,transparent_100%)]" />
        </div>

        <Container className="relative z-2 flex min-h-svh flex-col justify-end pb-10 pt-32 md:pb-14 lg:pb-16">
          <HeroMotion>
            <div className="grid w-full gap-10 border-t border-sadia-white/20 pt-7 md:grid-cols-12 md:items-end md:gap-x-10">
              <div className="md:col-span-8">
                <p className="sadia-eyebrow-light mb-5">{t("eyebrow")}</p>
                <h1
                  id="about-hero-title"
                  className="max-w-[16ch] font-display text-[clamp(2.35rem,5.2vw,5.25rem)] font-medium uppercase leading-[1.02] tracking-[-0.03em] text-balance text-sadia-white"
                >
                  {t("title")}
                </h1>
              </div>

              <div className="md:col-span-4">
                <p className="sadia-lead-light max-w-sm text-body-lg">
                  {t("lead")}
                </p>
                <a
                  href="#about-approach"
                  className="sadia-meta mt-8 hidden items-center gap-4 text-sadia-white/65 transition-colors hover:text-sadia-white md:inline-flex"
                >
                  <span>{t("scrollLabel")}</span>
                  <span aria-hidden="true" className="text-lg">
                    ↓
                  </span>
                </a>
              </div>
            </div>
          </HeroMotion>
        </Container>
      </section>

      <section
        id="about-approach"
        className="scroll-mt-24 bg-sadia-white py-[clamp(5rem,10vw,9rem)]"
      >
        <Container>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-8 w-2 shrink-0 skew-x-[-20deg] bg-sadia-navy-black"
                />
                <div>
                  <p className="sadia-eyebrow mb-1">{t("approachEyebrow")}</p>
                  <h2 className="sadia-section-kicker">{t("approachTitle")}</h2>
                </div>
              </div>
            </Reveal>

            <div className="divide-y divide-sadia-gray-light lg:col-span-8">
              {chapterKeys.map((key, index) => (
                <Reveal
                  key={key}
                  delay={index * 0.06}
                  className="py-10 lg:py-14"
                >
                  <article className="grid gap-6 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-10">
                    <p className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-none tracking-tight text-[#4A90C0]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div>
                      <h3 className="sadia-heading-subsection">
                        {t(`chapters.${key}.label`)}
                      </h3>
                      <p className="sadia-lead-md mt-5 max-w-[34em]">
                        {t(`chapters.${key}.text`)}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="overflow-hidden bg-sadia-navy-black py-[clamp(5rem,11vw,10rem)] text-sadia-white">
        <Container>
          <Reveal>
            <p className="sadia-eyebrow-light">{t("statementLabel")}</p>
            <p className="mt-8 max-w-[14ch] font-display text-[clamp(2.5rem,6vw,7rem)] font-medium uppercase leading-[0.94] tracking-[-0.035em]">
              {t("statement")}
            </p>
            <p className="sadia-meta mt-10 text-sadia-white/45">{t("location")}</p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-sadia-white py-[clamp(5rem,10vw,9rem)]">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="sadia-eyebrow">{t("principlesEyebrow")}</p>
            <h2 className="sadia-heading-page mt-5">{t("principlesTitle")}</h2>
          </Reveal>

          <div className="mt-14 grid border-t border-sadia-gray-light sm:grid-cols-2 lg:grid-cols-4">
            {principleKeys.map((key, index) => (
              <Reveal
                key={key}
                delay={index * 0.05}
                className="border-sadia-gray-light py-10 sm:px-8 sm:py-12 lg:border-l first:lg:border-l-0 sm:odd:border-r lg:odd:border-r-0"
              >
                <p className="sadia-meta">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="sadia-heading-subsection mt-6">
                  {t(`principles.${key}.title`)}
                </h3>
                <p className="sadia-lead-md mt-5 max-w-[18em] text-sadia-navy-black/75">
                  {t(`principles.${key}.text`)}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sadia-white pb-[clamp(5rem,10vw,9rem)]">
        <Container>
          <div className="grid overflow-hidden lg:grid-cols-12">
            <Reveal className="relative min-h-[28rem] lg:col-span-7 lg:min-h-[36rem]">
              <Image
                src={kobliznaFacade}
                alt={t("heroImageAlt")}
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover"
              />
            </Reveal>

            <Reveal
              delay={0.08}
              className="flex flex-col justify-between bg-muted/50 px-8 py-12 lg:col-span-5 lg:px-12 lg:py-16"
            >
              <div>
                <p className="sadia-eyebrow">03</p>
                <h2 className="sadia-heading-section mt-6 max-w-[12ch]">
                  {t("ctaTitle")}
                </h2>
                <p className="sadia-lead-md mt-6 max-w-sm">{t("ctaDescription")}</p>
              </div>

              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                <CtaLink href={routeKeys.contact}>{t("cta")}</CtaLink>
                <CtaLink href={routeKeys.availability} variant="ghost">
                  {t("availabilityCta")}
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
