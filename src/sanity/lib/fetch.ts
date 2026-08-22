import { isSanityConfigured } from "@/sanity/env";
import { sanityClient } from "@/sanity/lib/client";
import {
  getMockNewsArticleBySlug,
  getMockNewsArticles,
  getMockProjectBySlug,
  getMockProjects,
  getMockSiteSettings,
  getMockStats,
  getMockUnitBySlug,
  getMockUnitsByDealType,
} from "@/sanity/lib/mock-data";
import {
  NEWS_ARTICLE_BY_SLUG_QUERY,
  NEWS_ARTICLES_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
  UNIT_BY_SLUG_QUERY,
  UNITS_BY_DEAL_TYPE_QUERY,
} from "@/sanity/lib/queries";
import type {
  CmsImage,
  HomeStats,
  NewsDetail,
  NewsPage,
  NewsSummary,
  ProjectAmenity,
  ProjectDetail,
  ProjectDownload,
  ProjectSummary,
  ProjectTimelineItem,
  SiteSettings,
  UnitDetail,
  UnitSummary,
} from "@/sanity/types";
import { portableTextToPlainText } from "@/lib/admin-types";
import { withPublicContact } from "@/legal/entity";
import type { Locale } from "@/utils/routes";

export const NEWS_PAGE_SIZE = 9;

type SanityImageDoc = {
  alt?: { cs?: string; en?: string } | string;
  asset?: unknown;
};

function mapLocalizedAlt(
  locale: Locale,
  alt?: { cs?: string; en?: string } | string,
  fallback = "",
) {
  if (!alt) {
    return fallback;
  }

  if (typeof alt === "string") {
    return alt;
  }

  return alt[locale] ?? alt.cs ?? fallback;
}

function mapSanityImage(
  locale: Locale,
  image: SanityImageDoc | null | undefined,
  fallbackAlt = "",
): CmsImage | undefined {
  if (!image?.asset) {
    return undefined;
  }

  return {
    alt: mapLocalizedAlt(locale, image.alt, fallbackAlt),
    sanity: image as CmsImage["sanity"],
  };
}

function mapSanityUnit(
  locale: Locale,
  unit: Record<string, unknown>,
): UnitSummary {
  const photos = Array.isArray(unit.photos)
    ? unit.photos
        .map((photo) =>
          mapSanityImage(locale, photo as SanityImageDoc, unit.identifier as string),
        )
        .filter(Boolean)
    : [];

  const optionalNumber = (value: unknown) =>
    typeof value === "number" && !Number.isNaN(value) ? value : undefined;

  return {
    _id: unit._id as string,
    identifier: unit.identifier as string,
    slug: unit.slug as string,
    layout: unit.layout as string,
    unitType: unit.unitType === "commercial" ? "commercial" : "apartment",
    areaM2: unit.areaM2 as number,
    floor: unit.floor as number,
    orientation: (unit.orientation as string | undefined) || undefined,
    cellarM2: optionalNumber(unit.cellarM2),
    outdoorM2: optionalNumber(unit.outdoorM2),
    balconyM2: optionalNumber(unit.balconyM2),
    loggiaM2: optionalNumber(unit.loggiaM2),
    terraceM2: optionalNumber(unit.terraceM2),
    gardenM2: optionalNumber(unit.gardenM2),
    price: unit.price as number | undefined,
    currency: (unit.currency as string) ?? "CZK",
    priceOnRequest: Boolean(unit.priceOnRequest),
    status: unit.status as UnitSummary["status"],
    dealType: unit.dealType as UnitSummary["dealType"],
    featured: Boolean(unit.featured),
    externalUrl:
      typeof unit.externalUrl === "string" && unit.externalUrl.trim()
        ? unit.externalUrl
        : undefined,
    photos: photos as CmsImage[],
    project: unit.project as UnitSummary["project"],
  };
}

async function fetchFromSanity<T>(
  query: string,
  params: Record<string, unknown>,
): Promise<T | null> {
  if (!sanityClient) {
    return null;
  }

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch {
    return null;
  }
}

export async function getHomeStats(locale: Locale): Promise<HomeStats> {
  if (!isSanityConfigured) {
    return getMockStats();
  }

  const [projects, saleUnits, rentUnits] = await Promise.all([
    fetchFromSanity<unknown[]>(PROJECTS_QUERY, { locale }),
    fetchFromSanity<unknown[]>(UNITS_BY_DEAL_TYPE_QUERY, {
      locale,
      dealType: "sale",
    }),
    fetchFromSanity<unknown[]>(UNITS_BY_DEAL_TYPE_QUERY, {
      locale,
      dealType: "rent",
    }),
  ]);

  if (!projects && !saleUnits && !rentUnits) {
    return getMockStats();
  }

  const allUnits = [...(saleUnits ?? []), ...(rentUnits ?? [])] as {
    status?: string;
    areaM2?: number;
  }[];

  return {
    projects: projects?.length ?? 0,
    units: allUnits.length,
    totalSqm: allUnits.reduce((sum, unit) => sum + (unit.areaM2 ?? 0), 0),
    forSale:
      saleUnits?.filter(
        (unit) => (unit as { status?: string }).status === "available",
      ).length ?? 0,
    forRent:
      rentUnits?.filter(
        (unit) => (unit as { status?: string }).status === "available",
      ).length ?? 0,
  };
}

export async function getProjects(locale: Locale): Promise<ProjectSummary[]> {
  if (!isSanityConfigured) {
    return getMockProjects(locale);
  }

  const projects = await fetchFromSanity<Record<string, unknown>[]>(
    PROJECTS_QUERY,
    { locale },
  );

  if (!projects?.length) {
    return getMockProjects(locale);
  }

  return projects.map((project) => ({
    _id: project._id as string,
    name: project.name as string,
    slug: project.slug as string,
    status: project.status as ProjectSummary["status"],
    type: project.type as ProjectSummary["type"],
    salesMode: (project.salesMode as ProjectSummary["salesMode"]) ?? "soldByUs",
    location: project.location as string,
    address: project.address as string | undefined,
    heroImage:
      mapSanityImage(locale, project.heroImage as SanityImageDoc, project.name as string) ??
      getMockProjects(locale)[0].heroImage,
    gallery: Array.isArray(project.gallery)
      ? (project.gallery
          .map((image) =>
            mapSanityImage(
              locale,
              image as SanityImageDoc,
              project.name as string,
            ),
          )
          .filter(Boolean) as CmsImage[])
      : [],
    completionDate: project.completionDate as string | undefined,
  }));
}

export async function getProjectBySlug(
  locale: Locale,
  slug: string,
): Promise<ProjectDetail | null> {
  if (!isSanityConfigured) {
    return getMockProjectBySlug(locale, slug);
  }

  const project = await fetchFromSanity<Record<string, unknown>>(
    PROJECT_BY_SLUG_QUERY,
    { locale, slug },
  );

  if (!project) {
    return getMockProjectBySlug(locale, slug);
  }

  const units = Array.isArray(project.units)
    ? project.units
        .filter(
          (unit): unit is Record<string, unknown> =>
            Boolean(unit) && typeof unit === "object" && "_id" in unit,
        )
        .map((unit) => mapSanityUnit(locale, unit))
    : [];

  const gallery = Array.isArray(project.gallery)
    ? project.gallery
        .map((image) =>
          mapSanityImage(locale, image as SanityImageDoc, project.name as string),
        )
        .filter(Boolean)
    : [];

  const amenities = Array.isArray(project.amenities)
    ? (project.amenities as ProjectAmenity[])
        .map((group) => ({
          title: group.title,
          items: (group.items ?? []).filter(Boolean),
        }))
        .filter((group) => group.title)
    : [];

  const downloads = Array.isArray(project.downloads)
    ? (project.downloads as ProjectDownload[]).filter(
        (item) => item.title && item.url,
      )
    : [];

  const timeline = Array.isArray(project.timeline)
    ? (project.timeline as ProjectTimelineItem[]).filter((item) => item.title)
    : [];

  return {
    _id: project._id as string,
    name: project.name as string,
    slug: project.slug as string,
    status: project.status as ProjectDetail["status"],
    type: project.type as ProjectDetail["type"],
    salesMode: (project.salesMode as ProjectDetail["salesMode"]) ?? "soldByUs",
    location: project.location as string,
    address: project.address as string,
    geo: project.geo as ProjectDetail["geo"],
    heroImage:
      mapSanityImage(locale, project.heroImage as SanityImageDoc, project.name as string) ??
      getMockProjects(locale)[0].heroImage,
    gallery: gallery as CmsImage[],
    description: portableTextToPlainText(project.description),
    badge: (project.badge as string | undefined) || undefined,
    tagline: (project.tagline as string | undefined) || undefined,
    landmarks: Array.isArray(project.landmarks)
      ? (project.landmarks as string[]).filter(Boolean)
      : [],
    handover: (project.handover as string | undefined) || undefined,
    website: (project.website as string | undefined) || undefined,
    locationDescription: project.locationDescription
      ? portableTextToPlainText(project.locationDescription)
      : undefined,
    amenities,
    downloads,
    timeline,
    completionDate: project.completionDate as string | undefined,
    units,
  };
}

export async function getUnitsByDealType(
  locale: Locale,
  dealType: "sale" | "rent",
): Promise<UnitSummary[]> {
  if (!isSanityConfigured) {
    return getMockUnitsByDealType(locale, dealType);
  }

  const units = await fetchFromSanity<Record<string, unknown>[]>(
    UNITS_BY_DEAL_TYPE_QUERY,
    { locale, dealType },
  );

  if (!units) {
    return getMockUnitsByDealType(locale, dealType);
  }

  return units.map((unit) => mapSanityUnit(locale, unit));
}

export async function getAllUnits(locale: Locale): Promise<UnitSummary[]> {
  const [saleUnits, rentUnits] = await Promise.all([
    getUnitsByDealType(locale, "sale"),
    getUnitsByDealType(locale, "rent"),
  ]);

  return [...saleUnits, ...rentUnits];
}

export async function getUnitBySlug(
  locale: Locale,
  slug: string,
): Promise<UnitDetail | null> {
  if (!isSanityConfigured) {
    return getMockUnitBySlug(locale, slug);
  }

  const unit = await fetchFromSanity<Record<string, unknown>>(
    UNIT_BY_SLUG_QUERY,
    { locale, slug },
  );

  if (!unit) {
    return getMockUnitBySlug(locale, slug);
  }

  const mapped = mapSanityUnit(locale, unit);
  const project = unit.project as UnitDetail["project"] | undefined;

  if (!project) {
    return getMockUnitBySlug(locale, slug);
  }

  return {
    ...mapped,
    floorPlanImage: mapSanityImage(
      locale,
      unit.floorPlanImage as SanityImageDoc,
      mapped.identifier,
    ),
    project,
  };
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  if (!isSanityConfigured) {
    return withPublicContact(getMockSiteSettings(locale));
  }

  const settings = await fetchFromSanity<SiteSettings>(SITE_SETTINGS_QUERY, {
    locale,
  });

  return withPublicContact(settings ?? getMockSiteSettings(locale));
}

export async function getFeaturedProject(
  locale: Locale,
): Promise<ProjectDetail | null> {
  const projects = await getProjects(locale);
  const featured = projects[0];

  if (!featured) {
    return null;
  }

  return getProjectBySlug(locale, featured.slug);
}

function mapSanityNewsArticle(
  locale: Locale,
  article: Record<string, unknown>,
): NewsSummary {
  return {
    _id: article._id as string,
    title: article.title as string,
    slug: article.slug as string,
    excerpt: article.excerpt as string,
    publishedAt: article.publishedAt as string,
    heroImage:
      mapSanityImage(
        locale,
        article.heroImage as SanityImageDoc,
        article.title as string,
      ) ?? {
        alt: article.title as string,
      },
  };
}

function mapSanityNewsDetail(
  locale: Locale,
  article: Record<string, unknown>,
): NewsDetail {
  const summary = mapSanityNewsArticle(locale, article);
  const body = article.body;

  return {
    ...summary,
    body,
    bodyPlain: portableTextToPlainText(body),
    relatedProject: article.relatedProject
      ? {
          _id: (article.relatedProject as { _id: string })._id,
          name: (article.relatedProject as { name: string }).name,
          slug: (article.relatedProject as { slug: string }).slug,
        }
      : undefined,
  };
}

export async function getNewsArticles(locale: Locale): Promise<NewsSummary[]> {
  if (!isSanityConfigured) {
    return getMockNewsArticles(locale);
  }

  const articles = await fetchFromSanity<Record<string, unknown>[]>(
    NEWS_ARTICLES_QUERY,
    { locale },
  );

  if (!articles) {
    return getMockNewsArticles(locale);
  }

  return articles.map((article) => mapSanityNewsArticle(locale, article));
}

export async function getNewsPage(
  locale: Locale,
  page = 1,
  pageSize = NEWS_PAGE_SIZE,
): Promise<NewsPage> {
  const articles = await getNewsArticles(locale);
  const total = articles.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    articles: articles.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getNewsArticleBySlug(
  locale: Locale,
  slug: string,
): Promise<NewsDetail | null> {
  if (!isSanityConfigured) {
    return getMockNewsArticleBySlug(locale, slug);
  }

  const article = await fetchFromSanity<Record<string, unknown>>(
    NEWS_ARTICLE_BY_SLUG_QUERY,
    { locale, slug },
  );

  if (!article) {
    return getMockNewsArticleBySlug(locale, slug);
  }

  return mapSanityNewsDetail(locale, article);
}
