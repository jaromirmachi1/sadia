/**
 * Archived homepage section — "SADIA v číslech" stats bento grid.
 *
 * To restore on the homepage:
 * 1. Import `StatsSection` from `@/sections/_archive/StatsSection`
 * 2. Fetch `getHomeStats(locale)` in `src/app/[locale]/page.tsx`
 * 3. Render `<StatsSection locale={locale} stats={stats} />` after AboutSection
 */
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
            <p className="sadia-eyebrow-accent mb-5">03 · {t("eyebrow")}</p>
            <h2 id="home-stats-title" className="sadia-heading-page max-w-[12ch]">
              {t("title")}
            </h2>
          </Reveal>

          <Reveal
            className="self-end md:col-span-4 md:col-start-9"
            delay={0.08}
          >
            <p className="sadia-lead-md max-w-[28em]">{t("description")}</p>
          </Reveal>
        </div>

        <div className="mt-12 md:mt-16">
          <StatsBento items={items} locale={locale} />
        </div>
      </Container>
    </section>
  );
}
