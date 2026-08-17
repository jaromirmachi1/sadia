import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
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
      className="sadia-section-cut-20-top bg-sadia-navy-black pb-section-lg pt-[calc(var(--sadia-cut-depth)+var(--spacing-section-lg))] text-sadia-white"
    >
      <Container>
        <Reveal className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-body-sm font-medium uppercase tracking-[0.22em] text-sadia-gray">
              {t("eyebrow")}
            </p>
            <h2
              id="home-cta-title"
              className="mt-6 max-w-[12ch] text-display-md font-medium text-balance"
            >
              {t("title")}
            </h2>
            <p className="mt-6 max-w-lg text-body-lg text-sadia-white/60">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-start">
            <Link
              href={routeKeys.projects}
              className="sadia-underline-link pb-1 text-body-lg font-semibold text-sadia-white"
            >
              {t("primary")}
            </Link>
            <Link
              href={routeKeys.contact}
              className="sadia-underline-link pb-1 text-body-lg font-medium text-sadia-white/65"
            >
              {t("secondary")}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
