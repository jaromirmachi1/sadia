import "server-only";

import {
  ADMIN_NEWS_BY_ID_QUERY,
  ADMIN_NEWS_QUERY,
  ADMIN_PROJECTS_QUERY,
  ADMIN_PROJECT_BY_ID_QUERY,
  ADMIN_STATS_QUERY,
  ADMIN_UNIT_BY_ID_QUERY,
  ADMIN_UNITS_QUERY,
} from "@/sanity/lib/admin-queries";
import { assertWriteClient, isSanityWriteConfigured } from "@/sanity/lib/write-client";
import type {
  AdminNewsArticle,
  AdminNewsArticleDetail,
  AdminProject,
  AdminProjectDetail,
  AdminStats,
  AdminUnit,
  AdminUnitDetail,
} from "@/lib/admin-types";
import { portableTextToPlainText } from "@/lib/admin-types";
import { mapAdminProjectImage } from "@/sanity/lib/admin-images";

type AdminImageRaw = {
  _key?: string;
  alt?: { cs?: string; en?: string };
  asset?: { _id: string; url?: string } | null;
};

function mapRawImage(image: AdminImageRaw | null | undefined) {
  return mapAdminProjectImage(
    image
      ? {
          _key: image._key,
          _type: "image",
          alt: image.alt,
          asset: image.asset
            ? { _type: "reference", _ref: image.asset._id }
            : undefined,
        }
      : null,
    image?.asset,
  );
}

function mapRawImages(images: AdminImageRaw[] | null | undefined) {
  return (images ?? [])
    .map((image) => mapRawImage(image))
    .filter((image): image is NonNullable<typeof image> => image !== null);
}

export async function getAdminUnits(): Promise<AdminUnit[]> {
  if (!isSanityWriteConfigured) {
    return [];
  }

  return assertWriteClient().fetch<AdminUnit[]>(ADMIN_UNITS_QUERY);
}

type AdminUnitRaw = Omit<AdminUnitDetail, "floorPlanImage" | "photos"> & {
  floorPlanImage?: AdminImageRaw | null;
  photos?: AdminImageRaw[] | null;
};

export async function getAdminUnit(id: string): Promise<AdminUnitDetail | null> {
  if (!isSanityWriteConfigured) {
    return null;
  }

  const unit = await assertWriteClient().fetch<AdminUnitRaw | null>(
    ADMIN_UNIT_BY_ID_QUERY,
    { id },
  );

  if (!unit) {
    return null;
  }

  return {
    ...unit,
    floorPlanImage: mapRawImage(unit.floorPlanImage),
    photos: mapRawImages(unit.photos),
  };
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  if (!isSanityWriteConfigured) {
    return [];
  }

  return assertWriteClient().fetch<AdminProject[]>(ADMIN_PROJECTS_QUERY);
}

type AdminProjectImageRaw = {
  _key?: string;
  alt?: { cs?: string; en?: string };
  asset?: { _id: string; url?: string } | null;
};

type AdminAmenityRaw = {
  titleCs?: string;
  titleEn?: string;
  itemsCs?: string[] | null;
  itemsEn?: string[] | null;
};

type AdminProjectRaw = Omit<
  AdminProjectDetail,
  | "descriptionCs"
  | "descriptionEn"
  | "locationDescriptionCs"
  | "locationDescriptionEn"
  | "heroImage"
  | "gallery"
  | "amenities"
> & {
  descriptionCs: unknown;
  descriptionEn: unknown;
  locationDescriptionCs?: unknown;
  locationDescriptionEn?: unknown;
  amenities?: AdminAmenityRaw[] | null;
  heroImage?: AdminProjectImageRaw | null;
  gallery?: AdminProjectImageRaw[] | null;
};

export async function getAdminProject(
  id: string,
): Promise<AdminProjectDetail | null> {
  if (!isSanityWriteConfigured) {
    return null;
  }

  const project = await assertWriteClient().fetch<AdminProjectRaw | null>(
    ADMIN_PROJECT_BY_ID_QUERY,
    { id },
  );

  if (!project) {
    return null;
  }

  return {
    ...project,
    descriptionCs: portableTextToPlainText(project.descriptionCs),
    descriptionEn: portableTextToPlainText(project.descriptionEn),
    locationDescriptionCs: portableTextToPlainText(
      project.locationDescriptionCs,
    ),
    locationDescriptionEn: portableTextToPlainText(
      project.locationDescriptionEn,
    ),
    landmarks: project.landmarks ?? [],
    amenities: (project.amenities ?? []).map((group) => ({
      titleCs: group.titleCs ?? "",
      titleEn: group.titleEn ?? "",
      itemsCs: (group.itemsCs ?? []).filter(Boolean).join("\n"),
      itemsEn: (group.itemsEn ?? []).filter(Boolean).join("\n"),
    })),
    downloads: project.downloads ?? [],
    timeline: project.timeline ?? [],
    heroImage: mapAdminProjectImage(
      project.heroImage
        ? {
            _key: project.heroImage._key,
            _type: "image",
            alt: project.heroImage.alt,
            asset: project.heroImage.asset
              ? { _type: "reference", _ref: project.heroImage.asset._id }
              : undefined,
          }
        : null,
      project.heroImage?.asset,
    ),
    gallery: (project.gallery ?? [])
      .map((image) =>
        mapAdminProjectImage(
          {
            _key: image._key,
            _type: "image",
            alt: image.alt,
            asset: image.asset
              ? { _type: "reference", _ref: image.asset._id }
              : undefined,
          },
          image.asset,
        ),
      )
      .filter((image): image is NonNullable<typeof image> => image !== null),
  };
}

export async function getAdminNewsArticles(): Promise<AdminNewsArticle[]> {
  if (!isSanityWriteConfigured) {
    return [];
  }

  return assertWriteClient().fetch<AdminNewsArticle[]>(ADMIN_NEWS_QUERY);
}

type AdminNewsRaw = Omit<AdminNewsArticleDetail, "bodyCs" | "bodyEn" | "heroImage"> & {
  bodyCs: unknown;
  bodyEn: unknown;
  heroImage?: AdminImageRaw | null;
};

export async function getAdminNewsArticle(
  id: string,
): Promise<AdminNewsArticleDetail | null> {
  if (!isSanityWriteConfigured) {
    return null;
  }

  const article = await assertWriteClient().fetch<AdminNewsRaw | null>(
    ADMIN_NEWS_BY_ID_QUERY,
    { id },
  );

  if (!article) {
    return null;
  }

  return {
    ...article,
    bodyCs: portableTextToPlainText(article.bodyCs),
    bodyEn: portableTextToPlainText(article.bodyEn),
    heroImage: mapRawImage(article.heroImage),
  };
}

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSanityWriteConfigured) {
    return {
      projects: 0,
      units: 0,
      news: 0,
      available: 0,
      forSale: 0,
      forRent: 0,
    };
  }

  return assertWriteClient().fetch<AdminStats>(ADMIN_STATS_QUERY);
}
