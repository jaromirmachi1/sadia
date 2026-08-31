import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { HeroMotion } from "@/components/HeroMotion";
import { HeroVideoBackground } from "@/components/HeroVideoBackground";
import type { Locale } from "@/utils/routes";

type HeroSectionProps = {
  locale: Locale;
};

export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations("Home.hero");
  void locale;

  return (
    <section
      aria-labelledby="home-hero-title"
      data-header-theme="dark"
      className="relative min-h-svh overflow-hidden bg-sadia-navy-black text-sadia-white"
    >
      <div className="absolute inset-0" data-hero-media>
        <HeroVideoBackground alt={t("imageAlt")} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,46,0.42)_0%,rgba(18,20,46,0.12)_22%,rgba(18,20,46,0.16)_48%,rgba(18,20,46,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[11rem] bg-[linear-gradient(180deg,rgba(18,20,46,0.5)_0%,rgba(18,20,46,0.18)_58%,transparent_100%)] md:h-[13rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,20,46,0.28)_0%,transparent_62%)]" />
      </div>

      <Container className="relative z-2 flex min-h-svh flex-col justify-end pb-10 pt-32 md:pb-14 lg:pb-16">
        <HeroMotion>
          <div className="grid w-full gap-8 border-t border-sadia-white/25 pt-6 md:grid-cols-12 md:items-end md:gap-x-10">
            <div className="md:col-span-8">
              <p className="sadia-eyebrow-light mb-5">{t("eyebrow")}</p>
              <h1
                id="home-hero-title"
                className="max-w-[16ch] font-display text-[clamp(2.25rem,4.8vw,4.25rem)] font-medium uppercase leading-[1.05] tracking-[-0.025em] text-balance text-sadia-white"
              >
                {t("title")}
              </h1>
            </div>

            <div className="flex items-end justify-between gap-8 md:col-span-4 md:block">
              <p className="sadia-lead-light max-w-md text-body-lg">
                {t("description")}
              </p>
              <a
                href="#home-about"
                className="group mt-8 hidden items-center gap-4 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-white/70 transition-colors hover:text-sadia-white focus-visible:outline-2 focus-visible:outline-offset-4 md:inline-flex"
              >
                <span>{t("scrollLabel")}</span>
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-300 group-hover:translate-y-1"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>
        </HeroMotion>
      </Container>
    </section>
  );
}
