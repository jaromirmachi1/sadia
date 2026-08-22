import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { Container } from "@/components/Container";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { UnitFilters } from "@/components/UnitFilters";
import { getAllUnits, getUnitsByDealType } from "@/sanity/lib/fetch";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";

type ListingPageProps = {
  params: Promise<{ locale: Locale }>;
};

async function ListingPage({
  params,
  dealType,
  namespace,
}: ListingPageProps & {
  dealType: "sale" | "rent";
  namespace: "ForSale" | "ForRent";
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, common, units] = await Promise.all([
    getTranslations(namespace),
    getTranslations("Common"),
    getUnitsByDealType(locale, dealType),
  ]);

  return (
    <PageShell locale={locale}>
      <section className="bg-sadia-white pb-section-lg pt-16">
        <Container>
          <Reveal>
            <p className="sadia-eyebrow">{t("eyebrow")}</p>
            <h1 className="sadia-heading-page mt-4 max-w-[14ch] text-sadia-navy">
              {t("title")}
            </h1>
            <p className="sadia-lead-md mt-6 max-w-2xl text-sadia-navy-black/75">
              {t("description")}
            </p>
          </Reveal>

          <div className="mt-12">
            <UnitFilters
              units={units}
              locale={locale}
              labels={{
                location: t("filters.location"),
                layout: t("filters.layout"),
                project: t("filters.project"),
                price: t("filters.price"),
                all: t("filters.all"),
                empty: t("empty"),
                results: t("results"),
                priceOnRequest: common("priceOnRequest"),
                status: {
                  available: common("status.available"),
                  reserved: common("status.reserved"),
                  sold: common("status.sold"),
                  rented: common("status.rented"),
                },
              }}
            />
          </div>
        </Container>
      </section>
    </PageShell>
  );
}

export async function generateForSaleMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ForSale.metadata" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.availability,
  });
}

export async function generateForRentMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ForRent.metadata" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.availability,
  });
}

export function ForSalePage(props: ListingPageProps) {
  return ListingPage({ ...props, dealType: "sale", namespace: "ForSale" });
}

export function ForRentPage(props: ListingPageProps) {
  return ListingPage({ ...props, dealType: "rent", namespace: "ForRent" });
}

export async function generateAvailabilityMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Availability.metadata",
  });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.availability,
  });
}

export async function AvailabilityPage({ params }: ListingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, common, units] = await Promise.all([
    getTranslations("Availability"),
    getTranslations("Common"),
    getAllUnits(locale),
  ]);

  return (
    <PageShell locale={locale}>
      <section className="bg-sadia-white pb-section-lg pt-16">
        <Container>
          <Reveal>
            <p className="sadia-eyebrow">{t("eyebrow")}</p>
            <h1 className="sadia-heading-page mt-4 max-w-[14ch] text-sadia-navy">
              {t("title")}
            </h1>
            <p className="sadia-lead-md mt-6 max-w-2xl text-sadia-navy-black/75">
              {t("description")}
            </p>
          </Reveal>

          <div className="mt-12">
            <Suspense fallback={<div className="h-40" aria-hidden="true" />}>
              <UnitFilters
                units={units}
                locale={locale}
                showDealTypeFilter
                labels={{
                  location: t("filters.location"),
                  layout: t("filters.layout"),
                  project: t("filters.project"),
                  price: t("filters.price"),
                  all: t("filters.all"),
                  empty: t("empty"),
                  results: t("results"),
                  priceOnRequest: common("priceOnRequest"),
                  dealType: {
                    all: t("filters.all"),
                    rent: t("filters.rent"),
                    sale: t("filters.sale"),
                  },
                  status: {
                    available: common("status.available"),
                    reserved: common("status.reserved"),
                    sold: common("status.sold"),
                    rented: common("status.rented"),
                  },
                }}
              />
            </Suspense>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
