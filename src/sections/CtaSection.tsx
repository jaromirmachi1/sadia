import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { GradientWavesBackground } from "@/components/GradientWavesBackground";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
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
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-sadia-white/55">
              {t("eyebrow")}
            </p>
            <h2
              id="home-cta-title"
              className="mt-5 max-w-[18ch] font-display text-[clamp(1.85rem,2.6vw,2.85rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance"
            >
              {t("title")}
            </h2>
            <p className="mt-5 max-w-md text-body-base leading-relaxed text-sadia-white/65">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 md:col-span-5 md:items-end">
            <Link
              href={routeKeys.availability}
              className="inline-flex min-h-12 items-center bg-sadia-white px-7 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-sadia-navy-black transition-opacity hover:opacity-90"
            >
              {t("primary")}
            </Link>
            <Link
              href={routeKeys.contact}
              className="group inline-flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-sadia-white/70 transition-colors hover:text-sadia-white"
            >
              <span>{t("secondary")}</span>
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full border border-sadia-white/25 text-sadia-white transition-transform duration-500 group-hover:rotate-45"
              >
                ↗
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
