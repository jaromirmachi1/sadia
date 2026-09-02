import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { CtaAnchor } from "@/components/CtaLink";
import { PageShell } from "@/components/PageShell";
import { ProjectLocationMap } from "@/components/ProjectLocationMap";
import { Reveal } from "@/components/Reveal";
import { legalEntity } from "@/legal/entity";
import { getSiteSettings } from "@/sanity/lib/fetch";
import { buildPageMetadata } from "@/seo/metadata";
import { buildGoogleMapsLinkUrl } from "@/utils/maps";
import { routeKeys, type Locale } from "@/utils/routes";

const OFFICE_GEO = { lat: 49.195, lng: 16.608 };

type ContactPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.metadata" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.contact,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([
    getTranslations("Contact"),
    getSiteSettings(locale),
  ]);

  const officeAddress = settings.address || legalEntity.address;
  const googleMapsUrl = buildGoogleMapsLinkUrl({
    geo: OFFICE_GEO,
    address: officeAddress,
    label: legalEntity.brand,
  });

  return (
    <PageShell locale={locale} headerVariant="overlay">
      <section
        aria-labelledby="contact-title"
        data-header-theme="dark"
        className="bg-sadia-navy-black pb-section-sm pt-32 text-sadia-white md:pt-40"
      >
        <Container>
          <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="flex flex-col justify-between gap-10 lg:col-span-5">
              <div>
                <p className="sadia-eyebrow-light">{t("eyebrow")}</p>
                <h1
                  id="contact-title"
                  className="mt-5 max-w-[10ch] font-display text-[clamp(2.25rem,4.8vw,4.25rem)] font-medium uppercase leading-[1.05] tracking-[-0.025em] text-balance"
                >
                  {t("title")}
                </h1>
                <p className="mt-5 max-w-md text-body-lg leading-relaxed text-sadia-white/70">
                  {t("description")}
                </p>
              </div>
              <a
                href={`mailto:${settings.email}`}
                className="group max-w-md border-t border-sadia-white/20 pt-6"
              >
                <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-sadia-white/55">
                  {t("email")}
                </p>
                <p className="mt-2 font-display text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium tracking-[-0.02em] text-sadia-white transition-opacity group-hover:opacity-70">
                  {settings.email}
                </p>
              </a>
            </Reveal>
            <Reveal
              delay={0.08}
              className="bg-sadia-white px-6 py-10 text-sadia-navy-black sm:px-10 sm:py-12 lg:col-span-7 lg:px-14 lg:py-14"
            >
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>

      <section
        className="relative overflow-hidden bg-sadia-navy-black"
        aria-labelledby="contact-location-title"
      >
        <ProjectLocationMap
          title={t("map")}
          address={officeAddress}
          label={legalEntity.brand}
          geo={OFFICE_GEO}
          fill
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,46,0.08)_0%,rgba(18,20,46,0.04)_46%,rgba(18,20,46,0.42)_100%)]"
        />

        <Container className="relative z-2 flex min-h-[min(78svh,40rem)] flex-col justify-end pb-10 pt-24 md:min-h-[min(82svh,48rem)] md:pb-14 lg:pb-16">
          <Reveal>
            <div className="max-w-xl bg-sadia-white px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <p className="sadia-eyebrow">{t("mapEyebrow")}</p>
              <h2
                id="contact-location-title"
                className="sadia-heading-section mt-4 max-w-[14ch]"
              >
                {t("mapTitle")}
              </h2>
              <p className="mt-5 max-w-md text-body-lg leading-relaxed text-sadia-gray">
                {officeAddress}
              </p>
              {googleMapsUrl ? (
                <CtaAnchor
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8"
                >
                  {t("openMap")}
                </CtaAnchor>
              ) : null}
            </div>
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}
