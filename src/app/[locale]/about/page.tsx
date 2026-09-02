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
                  href="#about-statement"
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
        id="about-statement"
        className="scroll-mt-24 overflow-hidden bg-sadia-navy-black py-[clamp(5rem,11vw,10rem)] text-sadia-white"
      >
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
                <h2 className="sadia-heading-section max-w-[12ch]">
                  {t("ctaTitle")}
                </h2>
                <p className="sadia-lead-md mt-6 max-w-sm">{t("ctaDescription")}</p>
              </div>

              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                <CtaLink href={routeKeys.contact}>{t("cta")}</CtaLink>
                <CtaLink href={routeKeys.projects} variant="ghost">
                  {t("projectsCta")}
                </CtaLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
