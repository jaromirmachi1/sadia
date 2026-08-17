import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { StatsBento, type StatItem } from "@/components/StatsBento";
import type { HomeStats } from "@/sanity/types";
import type { Locale } from "@/utils/routes";

type StatsSectionProps = {
  locale: Locale;
  stats: HomeStats;
};

export async function StatsSection({ locale, stats }: StatsSectionProps) {
  const t = await getTranslations("Home.stats");

  const items: StatItem[] = [
    {
      label: t("projects"),
      value: stats.projects,
    },
    {
      label: t("units"),
      value: stats.units,
    },
    {
      label: t("totalSqm"),
      value: stats.totalSqm,
    },
    {
      label: t("forSale"),
      value: stats.forSale,
    },
    {
      label: t("forRent"),
      value: stats.forRent,
    },
    {
      label: t("available"),
      value: stats.forSale + stats.forRent,
    },
  ];

  return (
    <section
      id="home-stats"
      aria-labelledby="home-stats-title"
      aria-label={t("ariaLabel")}
      className="bg-muted/50 py-[clamp(4.5rem,8vw,7rem)] text-sadia-navy-black"
    >
      <Container>
        <div className="grid gap-10 border-t border-black/8 pt-7 md:grid-cols-12 md:gap-x-10">
          <Reveal className="md:col-span-6">
            <p className="mb-5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#4A90C0]">
              03 · {t("eyebrow")}
            </p>
            <h2
              id="home-stats-title"
              className="max-w-[12ch] font-display text-[clamp(2.5rem,5vw,5rem)] font-medium leading-[1.02] tracking-[-0.035em]"
            >
              {t("title")}
            </h2>
          </Reveal>

          <Reveal
            className="self-end md:col-span-4 md:col-start-9"
            delay={0.08}
          >
            <p className="max-w-[28em] text-body-lg leading-relaxed text-sadia-gray">
              {t("description")}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16">
          <StatsBento items={items} locale={locale} />
        </div>
      </Container>
    </section>
  );
}
