import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaAnchor, CtaLink } from "@/components/CtaLink";
import { Reveal } from "@/components/Reveal";
import { getPathname } from "@/i18n/navigation";
import weBuyPromo from "@/images/koblizna.jpg";
import { routeKeys, type Locale } from "@/utils/routes";

type WeBuyPromoSectionProps = {
  locale: Locale;
};

export async function WeBuyPromoSection({ locale }: WeBuyPromoSectionProps) {
  const t = await getTranslations("Home.weBuyPromo");
  const offerHref = `${getPathname({ locale, href: routeKeys.weBuy })}#offer`;

  return (
    <section
      aria-labelledby="home-we-buy-title"
      className="relative bg-sadia-white"
    >
      <div className="relative flex min-h-[min(78svh,40rem)] flex-col justify-end overflow-hidden bg-sadia-navy-black md:min-h-[min(82svh,48rem)]">
        <Image
          src={weBuyPromo}
          alt={t("imageAlt")}
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,46,0.18)_0%,rgba(18,20,46,0.04)_42%,rgba(18,20,46,0.28)_100%)]"
        />

        <Container className="relative z-2">
          <Reveal>
            <div className="max-w-3xl bg-sadia-white px-6 py-10 sm:px-10 sm:py-12 lg:max-w-[46rem] lg:px-14 lg:py-14">
              <p className="sadia-eyebrow">{t("eyebrow")}</p>
              <h2
                id="home-we-buy-title"
                className="sadia-heading-section mt-4 max-w-[18ch]"
              >
                {t("title")}
              </h2>
              <p className="sadia-lead-md mt-5 max-w-2xl">{t("description")}</p>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
                <CtaAnchor href={offerHref}>{t("primary")}</CtaAnchor>
                <CtaLink href={routeKeys.weBuy} variant="ghost">
                  {t("secondary")}
                </CtaLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
