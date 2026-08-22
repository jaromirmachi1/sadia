import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
import { GradientWavesBackground } from "@/components/GradientWavesBackground";
import { Reveal } from "@/components/Reveal";
import { routeKeys, type Locale } from "@/utils/routes";

type CtaSectionProps = {
  locale: Locale;
};

export async function CtaSection({ locale }: CtaSectionProps) {
  const t = await getTranslations("Home.cta");
  void locale;

  return (
    <section
      aria-labelledby="home-cta-title"
      className="relative overflow-hidden bg-sadia-navy-black py-section-sm text-sadia-white"
    >
      <GradientWavesBackground />
      <Container className="relative z-2">
        <Reveal className="grid items-center gap-10 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-7">
            <p className="sadia-eyebrow-light">{t("eyebrow")}</p>
            <h2
              id="home-cta-title"
              className="mt-5 max-w-[18ch] font-display text-[clamp(1.85rem,2.6vw,2.85rem)] font-medium uppercase leading-[1.15] tracking-[-0.02em] text-balance"
            >
              {t("title")}
            </h2>
            <p className="sadia-lead-light mt-5 max-w-md text-body-base">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 md:col-span-5 md:items-end">
            <CtaLink href={routeKeys.availability} variant="inverse">
              {t("primary")}
            </CtaLink>
            <CtaLink
              href={routeKeys.contact}
              variant="ghost"
              className="sadia-cta-on-dark"
            >
              {t("secondary")}
            </CtaLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
