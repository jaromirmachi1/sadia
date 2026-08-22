import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
import { Reveal } from "@/components/Reveal";
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
                  <p className="sadia-eyebrow mb-1">01</p>
                  <h2 id="home-about-title" className="sadia-section-kicker">
                    {t("title")}
                  </h2>
                </div>
              </div>
            </Reveal>
          </header>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.08}>
              <p className="sadia-lead-lg">{t("description")}</p>
            </Reveal>
          </div>
        </div>

        <div className="pb-[clamp(4rem,8vw,8rem)] pt-[clamp(7rem,14vw,16rem)]">
          <Reveal>
            <p aria-hidden="true" className="sadia-eyebrow mb-5">
              {t("statementLabel")}
            </p>
            <p className="sadia-statement max-w-[18ch]">{t("statement")}</p>
          </Reveal>
        </div>

        <div className="grid items-end gap-10 border-t border-sadia-gray-light pt-6 sm:grid-cols-2">
          <Reveal>
            <div className="sadia-meta flex gap-10">
              <p>{t("location")}</p>
              <p aria-label={t("coordinatesLabel")}>49.1951° N / 16.6068° E</p>
            </div>
          </Reveal>

          <Reveal className="sm:justify-self-end" delay={0.1}>
            <CtaLink href={routeKeys.about}>{t("cta")}</CtaLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
