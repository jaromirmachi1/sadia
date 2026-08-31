import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CmsImageView } from "@/components/CmsImageView";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { ProjectHeroSection } from "@/components/ProjectHeroSection";
import { ProjectLocationMap } from "@/components/ProjectLocationMap";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { ProjectInquiryForm } from "@/components/ProjectInquiryForm";
import { ProjectUnitsTable } from "@/components/ProjectUnitsTable";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { getProjectBySlug, getProjects, getSiteSettings } from "@/sanity/lib/fetch";
import type { CmsImage } from "@/sanity/types";
import {
  buildApartmentComplexSchema,
  buildBreadcrumbListSchema,
  hrefForLocale,
} from "@/seo/json-ld";
import { buildPageMetadata } from "@/seo/metadata";
import { resolveImageAlt, resolveOgImageUrl } from "@/seo/image";
import { absoluteUrl } from "@/seo/site";
import { formatPrice } from "@/utils/format";
import { buildGoogleMapsLinkUrl } from "@/utils/maps";
import { routeKeys, type Locale } from "@/utils/routes";

type ProjectDetailPageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

function paragraphs(value?: string) {
  if (!value) return [];
  return value
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniqueImages(hero: CmsImage, gallery: CmsImage[]) {
  const images = [hero, ...gallery];
  const seen = new Set<string>();

  return images.filter((image) => {
    if (!image.local && !image.sanity) {
      return false;
    }

    const key = JSON.stringify(image.local?.src ?? image.sanity);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function projectGalleryLayout(count: number) {
  if (count > 2) {
    return "grid gap-3 lg:h-[min(34rem,58vh)] lg:grid-cols-3 lg:grid-rows-2";
  }

  if (count === 2) {
    return "grid gap-3 lg:h-[min(32rem,52vh)] lg:grid-cols-3";
  }

  return "grid gap-3 lg:h-[min(34rem,58vh)]";
}

function projectGalleryItemClass(index: number, count: number) {
  if (count === 1) {
    return "relative min-h-64 overflow-hidden rounded-2xl bg-sadia-gray-light lg:min-h-0";
  }

  if (index === 0 && count > 1) {
    return "relative min-h-64 overflow-hidden rounded-2xl bg-sadia-gray-light lg:col-span-2 lg:row-span-2 lg:min-h-0";
  }

  return "relative min-h-48 overflow-hidden rounded-2xl bg-sadia-gray-light lg:min-h-0";
}

function websiteLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

export async function generateStaticParams() {
  const projects = await getProjects("cs");
  return projects.flatMap((project) =>
    (["cs", "en"] as const).map((locale) => ({
      locale,
      slug: project.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(locale, slug);

  if (!project) {
    return {};
  }

  const title = `${project.name} | SADIA`;
  const description = project.description || project.location;

  return buildPageMetadata({
    locale,
    title,
    description,
    href: { pathname: "/projects/[slug]", params: { slug } },
    image: project.heroImage,
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [project, projects, settings, t, nav, contact] = await Promise.all([
    getProjectBySlug(locale, slug),
    getProjects(locale),
    getSiteSettings(locale),
    getTranslations("ProjectDetail"),
    getTranslations("Navigation"),
    getTranslations("Contact"),
  ]);

  if (!project) {
    notFound();
  }

  const availableUnits = project.units.filter(
    (unit) => unit.status === "available",
  );
  const pricedUnits = availableUnits.filter(
    (unit) => !unit.priceOnRequest && typeof unit.price === "number",
  );
  const priceFrom = pricedUnits.reduce<number | undefined>((lowest, unit) => {
    if (typeof unit.price !== "number") return lowest;
    return lowest == null ? unit.price : Math.min(lowest, unit.price);
  }, undefined);
  const images = uniqueImages(project.heroImage, project.gallery);
  const mosaic = images.slice(0, 3);
  const restImages = images.slice(3);
  const breadcrumbItems = [
    { label: nav("home"), href: routeKeys.home },
    { label: nav("projects"), href: routeKeys.projects },
    { label: project.name },
  ];
  const related = projects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const descriptionParts = paragraphs(project.description);
  const locationParts = paragraphs(project.locationDescription);
  const googleMapsUrl =
    buildGoogleMapsLinkUrl({
      geo: project.geo,
      address: project.address,
      label: project.name,
    }) ?? undefined;
  const showMap = Boolean(project.geo || project.address);

  const facts = [
    { label: t("facts.address"), value: project.address },
    { label: t("facts.status"), value: t(`status.${project.status}`) },
    project.handover
      ? { label: t("facts.handover"), value: project.handover }
      : null,
    {
      label: t("facts.available"),
      value: String(availableUnits.length),
    },
    priceFrom != null
      ? {
          label: t("facts.priceFrom"),
          value: formatPrice(
            priceFrom,
            pricedUnits[0]?.currency ?? "CZK",
            locale,
          ),
        }
      : null,
    project.website
      ? { label: t("facts.website"), value: websiteLabel(project.website), href: project.website }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    href?: string;
  }>;

  const jsonLd = [
    buildApartmentComplexSchema({
      name: project.name,
      description: project.description,
      address: project.address,
      locality: project.location,
      url: absoluteUrl(hrefForLocale(locale, {
        pathname: "/projects/[slug]",
        params: { slug },
      })),
      image: resolveOgImageUrl(project.heroImage),
      availableUnits: availableUnits.length,
    }),
    buildBreadcrumbListSchema([
      { name: nav("home"), href: routeKeys.home, locale },
      { name: nav("projects"), href: routeKeys.projects, locale },
      { name: project.name, locale },
    ]),
  ];

  return (
    <PageShell locale={locale} headerVariant="overlay">
      <JsonLd data={jsonLd} />

      <ProjectHeroSection
        name={project.name}
        address={project.address}
        badge={project.badge}
        heroImage={project.heroImage}
        breadcrumbs={breadcrumbItems}
        breadcrumbsLabel={t("breadcrumbsLabel")}
        scrollLabel={t("scrollLabel")}
      />

      <section id="project-content" className="bg-sadia-white py-section-sm">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="lg:col-span-7">
              {project.tagline ? (
                <p className="max-w-[18ch] text-heading-lg font-medium text-sadia-navy-black">
                  {project.tagline}
                </p>
              ) : null}
              <div
                className={[
                  "max-w-xl space-y-5 text-body-lg leading-relaxed text-sadia-gray",
                  project.tagline ? "mt-8" : "",
                ].join(" ")}
              >
                {descriptionParts.length > 0 ? (
                  descriptionParts.map((part) => <p key={part}>{part}</p>)
                ) : (
                  <p>{t("fallbackDescription")}</p>
                )}
              </div>
              {project.landmarks.length > 0 ? (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {project.landmarks.map((landmark) => (
                    <li
                      key={landmark}
                      className="rounded-full bg-muted/70 px-4 py-2 text-body-sm text-sadia-navy-black"
                    >
                      {landmark}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-5">
              <dl className="grid gap-px overflow-hidden rounded-2xl bg-sadia-gray-light/70 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label} className="bg-sadia-white px-5 py-5">
                    <dt className="text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-gray">
                      {fact.label}
                    </dt>
                    <dd className="mt-2 font-medium text-sadia-navy-black">
                      {fact.href ? (
                        <a
                          href={fact.href}
                          target="_blank"
                          rel="noreferrer"
                          className="sadia-underline-link"
                        >
                          {fact.value}
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      {mosaic.length > 0 ? (
        <section className="bg-sadia-white pb-section-sm" aria-label={t("gallery")}>
          <Container>
            <div className={projectGalleryLayout(mosaic.length)}>
              {mosaic.map((image, index) => (
                <div
                  key={`${project.slug}-mosaic-${index}`}
                  className={projectGalleryItemClass(index, mosaic.length)}
                >
                  <CmsImageView
                    image={image}
                    fill
                    priority={index === 0}
                    alt={resolveImageAlt(
                      image,
                      `${project.name} (${index + 1})`,
                    )}
                    sizes={
                      mosaic.length === 1
                        ? "100vw"
                        : index === 0
                          ? "66vw"
                          : "34vw"
                    }
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {restImages.length > 0 ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {restImages.map((image, index) => (
                  <div
                    key={`${project.slug}-gallery-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sadia-gray-light"
                  >
                    <CmsImageView
                      image={image}
                      fill
                      alt={resolveImageAlt(
                        image,
                        `${project.name} — galerie ${index + 1}`,
                      )}
                      sizes="(max-width: 1023px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      <section className="bg-muted/50 py-section-sm">
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="sadia-eyebrow">
                {t("unitsCount", { count: project.units.length })}
              </p>
              <h2 className="sadia-heading-section mt-3">
                {t("units")}
              </h2>
            </div>
          </Reveal>
          <div className="mt-8">
            {project.units.length === 0 ? (
              <p className="text-body-lg text-sadia-navy-black/70">{t("emptyUnits")}</p>
            ) : (
              <ProjectUnitsTable
                locale={locale}
                units={project.units}
                projectWebsite={project.website}
                projectSalesMode={project.salesMode}
              />
            )}
          </div>
        </Container>
      </section>

      {project.downloads.length > 0 ? (
        <section className="bg-sadia-white py-section-sm">
          <Container>
            <Reveal>
              <h2 className="sadia-heading-section">
                {t("downloads")}
              </h2>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {project.downloads.map((file) => (
                  <li key={file.url}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl bg-muted/60 px-5 py-4 text-body-base font-medium text-sadia-navy-black transition-colors hover:bg-muted"
                    >
                      <span>{file.title}</span>
                      <span aria-hidden="true">↓</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {project.timeline.length > 0 ? (
        <section className="bg-sadia-white py-section-sm">
          <Container>
            <ProjectTimeline heading={t("timeline")} items={project.timeline} />
          </Container>
        </section>
      ) : null}

      <section className="bg-muted/50 py-section-sm" aria-label={t("map")}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-x-10">
            <Reveal className="lg:col-span-5">
              <p className="sadia-eyebrow">
                {t("map")}
              </p>
              <h2 className="sadia-heading-section mt-4 max-w-[12ch]">
                {t("locationTitle")}
              </h2>
              <div className="mt-6 max-w-md space-y-4 text-body-lg leading-relaxed text-sadia-gray">
                {locationParts.length > 0
                  ? locationParts.map((part) => <p key={part}>{part}</p>)
                  : <p>{project.address}</p>}
              </div>
              {googleMapsUrl ? (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="sadia-underline-link mt-8 inline-flex pb-1 text-body-sm font-semibold uppercase tracking-[0.14em] text-sadia-navy-black"
                >
                  {t("openMap")}
                </a>
              ) : null}
            </Reveal>

            {showMap ? (
              <div className="lg:col-span-7">
                <ProjectLocationMap
                  title={`${project.name} – ${t("map")}`}
                  address={project.address}
                  label={project.name}
                  geo={project.geo}
                  className="h-full min-h-[22rem]"
                />
              </div>
            ) : null}
          </div>

          {project.amenities.length > 0 ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.amenities.map((group) => (
                <Reveal key={group.title}>
                  <article className="h-full rounded-2xl bg-sadia-white px-6 py-7">
                    <h3 className="font-display text-heading-md font-medium text-sadia-navy-black">
                      {group.title}
                    </h3>
                    <ul className="mt-4 space-y-2 text-body-base text-sadia-navy-black/70">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

      <section className="bg-sadia-white py-section-sm">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10 lg:items-start">
            <Reveal className="lg:col-span-5">
              <p className="sadia-eyebrow">
                {t("inquiryEyebrow")}
              </p>
              <h2 className="sadia-heading-section mt-4 max-w-[14ch]">
                {t("inquiryTitle")}
              </h2>
              <p className="mt-5 max-w-md text-body-lg leading-relaxed text-sadia-gray">
                {t("inquiryDescription")}
              </p>
              <a
                href={`mailto:${settings.email}`}
                className="mt-8 block rounded-xl bg-muted/60 px-5 py-4 transition-colors hover:bg-muted"
              >
                <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-gray">
                  {contact("email")}
                </p>
                <p className="mt-1 font-medium text-sadia-navy-black">
                  {settings.email}
                </p>
              </a>
            </Reveal>
            <Reveal delay={0.08} className="rounded-2xl bg-muted/50 p-6 lg:col-span-7 lg:p-8">
              <ProjectInquiryForm projectName={project.name} />
            </Reveal>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="bg-muted/50 py-section-sm">
          <Container>
            <Reveal className="flex items-end justify-between gap-4">
              <h2 className="sadia-heading-section">{t("related")}</h2>
              <Link
                href={routeKeys.projects}
                className="sadia-underline-link pb-1 text-body-sm font-semibold uppercase tracking-[0.14em]"
              >
                {t("relatedAll")}
              </Link>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Reveal key={item._id}>
                  <Link
                    href={{
                      pathname: "/projects/[slug]",
                      params: { slug: item.slug },
                    }}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sadia-gray-light">
                      <CmsImageView
                        image={item.heroImage}
                        fill
                        alt={resolveImageAlt(item.heroImage, item.name)}
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-4 text-[0.6875rem] uppercase tracking-[0.16em] text-sadia-gray">
                      {item.location}
                    </p>
                    <h3 className="mt-2 font-display text-heading-md font-medium text-sadia-navy-black">
                      {item.name}
                    </h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </PageShell>
  );
}
