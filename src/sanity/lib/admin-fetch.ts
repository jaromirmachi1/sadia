import "server-only";

import {
  ADMIN_PROJECTS_QUERY,
  ADMIN_PROJECT_BY_ID_QUERY,
  ADMIN_STATS_QUERY,
} from "@/sanity/lib/admin-queries";
import { assertWriteClient, isSanityWriteConfigured } from "@/sanity/lib/write-client";
import type {
  AdminProject,
  AdminProjectDetail,
  AdminStats,
} from "@/lib/admin-types";
import { portableTextToPlainText } from "@/lib/admin-types";
import { mapAdminProjectImage } from "@/sanity/lib/admin-images";

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

type AdminProjectRaw = Omit<
  AdminProjectDetail,
  | "descriptionCs"
  | "descriptionEn"
  | "locationDescriptionCs"
  | "locationDescriptionEn"
  | "heroImage"
  | "gallery"
> & {
  descriptionCs: unknown;
  descriptionEn: unknown;
  locationDescriptionCs?: unknown;
  locationDescriptionEn?: unknown;
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

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSanityWriteConfigured) {
    return { projects: 0 };
  }

  return assertWriteClient().fetch<AdminStats>(ADMIN_STATS_QUERY);
}
