import { isSanityConfigured } from "@/sanity/env";
import { sanityClient } from "@/sanity/lib/client";
import {
  getMockProjectBySlug,
  getMockProjects,
  getMockSiteSettings,
  getMockStats,
} from "@/sanity/lib/mock-data";
import {
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  CmsImage,
  HomeStats,
  ProjectDetail,
  ProjectSummary,
  SiteSettings,
} from "@/sanity/types";
import { portableTextToPlainText } from "@/lib/admin-types";
import { withPublicContact } from "@/legal/entity";
import type { Locale } from "@/utils/routes";

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

  const projects = await fetchFromSanity<unknown[]>(PROJECTS_QUERY, { locale });

  if (!projects) {
    return getMockStats();
  }

  return {
    projects: projects.length,
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

  const gallery = Array.isArray(project.gallery)
    ? project.gallery
        .map((image) =>
          mapSanityImage(locale, image as SanityImageDoc, project.name as string),
        )
        .filter(Boolean)
    : [];

  return {
    _id: project._id as string,
    name: project.name as string,
    slug: project.slug as string,
    status: project.status as ProjectDetail["status"],
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
    completionDate: project.completionDate as string | undefined,
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
