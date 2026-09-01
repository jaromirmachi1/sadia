import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
import { Reveal } from "@/components/Reveal";
import aboutImage from "@/images/koblizna-day.jpg";
import { routeKeys } from "@/utils/routes";

export async function AboutSection() {
  const t = await getTranslations("Home.about");

  return (
    <section
      id="home-about"
      aria-labelledby="home-about-title"
      className="relative scroll-mt-24 overflow-hidden bg-sadia-white text-sadia-navy-black"
    >
      <Container className="pb-[clamp(4rem,8vw,8rem)] pt-8 md:pt-10">
        <div className="h-px w-full bg-sadia-gray-light" />

        <div className="grid gap-10 pt-8 md:grid-cols-12 md:gap-x-10 md:pt-10">
          <header className="md:col-span-4">
            <Reveal>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-8 w-2 skew-x-[-20deg] bg-sadia-navy-black"
                />
                <h2 id="home-about-title" className="sadia-section-kicker">
                  {t("title")}
                </h2>
              </div>
            </Reveal>
          </header>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.08}>
              <p className="sadia-lead-lg">{t("description")}</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-[clamp(2.75rem,5.5vw,4.5rem)] grid gap-10 md:grid-cols-12 md:items-end md:gap-x-10">
          <Reveal className="order-2 md:order-1 md:col-span-5">
            <p className="sadia-eyebrow mb-5">{t("statementLabel")}</p>
            <p className="sadia-statement max-w-[14ch]">{t("statement")}</p>
          </Reveal>

          <Reveal
            delay={0.08}
            className="order-1 md:order-2 md:col-span-6 md:col-start-7"
          >
            <figure className="relative aspect-[16/10] overflow-hidden bg-sadia-gray-light sm:aspect-[5/3] md:aspect-[4/3]">
              <Image
                src={aboutImage}
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 767px) 100vw, 42vw"
                className="object-cover object-center"
              />
            </figure>
          </Reveal>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,3.5rem)] grid items-end gap-8 border-t border-sadia-gray-light pt-6 sm:grid-cols-2">
          <Reveal>
            <div className="sadia-meta">
              <p>{t("location")}</p>
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
