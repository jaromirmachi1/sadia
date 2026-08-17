import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { routeKeys } from "@/utils/routes";

export async function AboutSection() {
  const t = await getTranslations("Home.about");

  return (
    <section
      id="home-about"
      aria-labelledby="home-about-title"
      className="relative scroll-mt-24 overflow-hidden bg-sadia-white text-sadia-navy-black"
    >
      <Container className="pb-[clamp(6rem,11vw,13rem)] pt-8 md:pt-10">
        <div className="h-px w-full bg-sadia-gray-light" />

        <div className="grid gap-14 pt-8 md:grid-cols-12 md:gap-x-10 md:pt-10">
          <header className="md:col-span-4">
            <Reveal>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-8 w-2 skew-x-[-20deg] bg-sadia-navy-black"
                />
                <div>
                  <p className="mb-1 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-sadia-gray">
                    01
                  </p>
                  <h2
                    id="home-about-title"
                    className="font-display text-[clamp(1.25rem,1rem+0.55vw,2rem)] font-medium uppercase leading-none tracking-wider"
                  >
                    {t("title")}
                  </h2>
                </div>
              </div>
            </Reveal>
          </header>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.08}>
              <p className="max-w-[25em] text-[clamp(1.6rem,1rem+1.2vw,3.25rem)] font-normal leading-[1.08] tracking-tight">
                {t("description")}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="pb-[clamp(4rem,8vw,8rem)] pt-[clamp(7rem,14vw,16rem)]">
          <Reveal>
            <p
              aria-hidden="true"
              className="mb-5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-sadia-gray"
            >
              {t("statementLabel")}
            </p>
            <p className="max-w-[18ch] font-display text-[clamp(2.25rem,4.8vw,4.25rem)] font-medium uppercase leading-[1.05] tracking-[-0.025em] text-sadia-navy">
              {t("statement")}
            </p>
          </Reveal>
        </div>

        <div className="grid items-end gap-10 border-t border-sadia-gray-light pt-6 sm:grid-cols-2">
          <Reveal>
            <div className="flex gap-10 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-sadia-gray">
              <p>{t("location")}</p>
              <p aria-label={t("coordinatesLabel")}>49.1951° N / 16.6068° E</p>
            </div>
          </Reveal>

          <Reveal className="sm:justify-self-end" delay={0.1}>
            <Link
              href={routeKeys.about}
              className="group inline-flex items-center gap-5 text-[0.75rem] font-medium uppercase tracking-[0.16em]"
            >
              <span>{t("cta")}</span>
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-full bg-sadia-navy-black text-sadia-white transition-transform duration-500 group-hover:rotate-45"
              >
                ↗
              </span>
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
