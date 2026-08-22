import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsImageView } from "@/components/CmsImageView";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { StatusBadge } from "@/components/StatusBadge";
import { Link } from "@/i18n/navigation";
import { routeKeys } from "@/utils/routes";
import {
  getUnitBySlug,
  getUnitsByDealType,
} from "@/sanity/lib/fetch";
import {
  buildBreadcrumbListSchema,
  buildRealEstateListingSchema,
  hrefForLocale,
} from "@/seo/json-ld";
import { buildPageMetadata } from "@/seo/metadata";
import { resolveImageAlt, resolveOgImageUrl } from "@/seo/image";
import { absoluteUrl } from "@/seo/site";
import { formatPrice } from "@/utils/format";
import type { Locale } from "@/utils/routes";

type UnitDetailPageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateStaticParams() {
  const [sale, rent] = await Promise.all([
    getUnitsByDealType("cs", "sale"),
    getUnitsByDealType("cs", "rent"),
  ]);

  return [...sale, ...rent].flatMap((unit) =>
    (["cs", "en"] as const).map((locale) => ({
      locale,
      slug: unit.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: UnitDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const unit = await getUnitBySlug(locale, slug);

  if (!unit) {
    return {};
  }

  const title = `${unit.identifier} · ${unit.layout} | SADIA`;
  const description = `${unit.project.name}, ${unit.layout}, ${unit.areaM2} m²`;

  return buildPageMetadata({
    locale,
    title,
    description,
    href: { pathname: "/flat/[slug]", params: { slug } },
    image: unit.photos[0],
  });
}

export default async function UnitDetailPage({ params }: UnitDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [unit, t, common, nav] = await Promise.all([
    getUnitBySlug(locale, slug),
    getTranslations("UnitDetail"),
    getTranslations("Common"),
    getTranslations("Navigation"),
  ]);

  if (!unit) {
    notFound();
  }

  if (unit.project.salesMode === "sellByFirm" && unit.project.website) {
    redirect(unit.project.website);
  }

  const gallery = unit.photos.length > 0 ? unit.photos : [];
  const unitTitle = `${unit.identifier} · ${unit.layout}`;
  const unitPageUrl = absoluteUrl(
    hrefForLocale(locale, { pathname: "/flat/[slug]", params: { slug } }),
  );
  const photoAlt = (index: number) =>
    gallery[index]
      ? resolveImageAlt(
          gallery[index],
          `${unitTitle} — ${unit.project.name} (${index + 1})`,
        )
      : `${unitTitle} — ${unit.project.name}`;

  const jsonLd = [
    buildRealEstateListingSchema({
      name: unitTitle,
      description: `${unit.project.name}, ${unit.layout}, ${unit.areaM2} m², ${unit.project.address}`,
      url: unitPageUrl,
      image: gallery[0] ? resolveOgImageUrl(gallery[0]) : undefined,
      address: unit.project.address,
      locality: unit.project.location,
      floorSize: unit.areaM2,
      numberOfRooms: unit.layout,
      price: unit.price,
      priceCurrency: unit.currency,
      priceOnRequest: unit.priceOnRequest,
      dealType: unit.dealType,
      availability: unit.status,
    }),
    buildBreadcrumbListSchema([
      { name: nav("home"), href: routeKeys.home, locale },
      { name: nav("projects"), href: routeKeys.projects, locale },
      {
        name: unit.project.name,
        href: { pathname: "/projects/[slug]", params: { slug: unit.project.slug } },
        locale,
      },
      { name: unitTitle, locale },
    ]),
  ];

  return (
    <PageShell locale={locale}>
      <JsonLd data={jsonLd} />
      <section className="bg-sadia-white pb-section-lg pt-16">
        <Container>
          <Breadcrumbs
            label={t("breadcrumbsLabel")}
            className="mb-10 lg:mb-12"
            items={[
              { label: nav("home"), href: routeKeys.home },
              { label: nav("projects"), href: routeKeys.projects },
              {
                label: unit.project.name,
                href: {
                  pathname: "/projects/[slug]",
                  params: { slug: unit.project.slug },
                },
              },
              { label: `${unit.identifier} · ${unit.layout}` },
            ]}
          />
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
            <div>
              <Reveal>
                <p className="text-body-sm uppercase tracking-[0.14em] text-sadia-gray">
                  <Link
                    href={{
                      pathname: "/projects/[slug]",
                      params: { slug: unit.project.slug },
                    }}
                    className="hover:text-sadia-navy"
                  >
                    {unit.project.name}
                  </Link>
                </p>
                <h1 className="mt-4 text-display-md font-medium text-sadia-navy">
                  {unit.identifier} · {unit.layout}
                </h1>
                <div className="mt-5">
                  <StatusBadge
                    status={unit.status}
                    label={common(`status.${unit.status}`)}
                  />
                </div>
              </Reveal>

              <div className="mt-10 space-y-4">
                {gallery[0] ? (
                  <div className="sadia-card-cut-20 relative aspect-[4/3] overflow-hidden bg-sadia-gray-light">
                    <CmsImageView
                      image={gallery[0]}
                      fill
                      priority
                      alt={photoAlt(0)}
                      sizes="(max-width: 1023px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                {gallery.length > 1 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {gallery.slice(1).map((image, index) => (
                      <div
                        key={`${unit.slug}-photo-${index}`}
                        className="relative aspect-[4/3] overflow-hidden"
                      >
                        <CmsImageView
                          image={image}
                          fill
                          alt={photoAlt(index + 1)}
                          sizes="(max-width: 767px) 100vw, 30vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
                {unit.floorPlanImage ? (
                  <div>
                    <h2 className="mb-4 text-heading-md font-medium text-sadia-navy">
                      {t("floorPlan")}
                    </h2>
                    <div className="relative aspect-[4/3] overflow-hidden border border-sadia-gray-light bg-sadia-white">
                      <CmsImageView
                        image={unit.floorPlanImage}
                        fill
                        alt={resolveImageAlt(
                          unit.floorPlanImage,
                          `${t("floorPlan")} — ${unitTitle}`,
                        )}
                        sizes="(max-width: 1023px) 100vw, 60vw"
                        className="object-contain p-4"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <aside className="lg:sticky lg:top-28">
              <Reveal delay={0.08}>
                <div className="border border-sadia-gray-light bg-muted p-7">
                  <p className="text-body-sm uppercase tracking-[0.14em] text-sadia-gray">
                    {t("price")}
                  </p>
                  <p className="mt-3 font-display text-heading-lg font-medium text-sadia-navy">
                    {unit.priceOnRequest
                      ? common("priceOnRequest")
                      : formatPrice(unit.price, unit.currency, locale)}
                  </p>

                  <dl className="mt-8 space-y-4 border-t border-sadia-gray-light pt-6 text-body-base">
                    <div className="flex justify-between gap-4">
                      <dt className="text-sadia-gray">{t("layout")}</dt>
                      <dd className="font-semibold text-sadia-navy-black">
                        {unit.layout}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-sadia-gray">{t("area")}</dt>
                      <dd className="font-semibold text-sadia-navy-black">
                        {unit.areaM2} m²
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-sadia-gray">{t("floor")}</dt>
                      <dd className="font-semibold text-sadia-navy-black">
                        {unit.floor}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-sadia-gray">{t("address")}</dt>
                      <dd className="text-right font-semibold text-sadia-navy-black">
                        {unit.project.address}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 space-y-3">
                    <Link
                      href={routeKeys.contact}
                      className="inline-flex min-h-12 w-full items-center justify-center bg-sadia-navy-black px-6 text-body-sm font-semibold text-sadia-white transition-opacity hover:opacity-90"
                    >
                      {t("inquire")}
                    </Link>
                    <p className="text-body-sm text-sadia-gray">
                      {t("inquireHint")}
                    </p>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
