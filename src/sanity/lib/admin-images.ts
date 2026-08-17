import "server-only";

import type { SanityClient } from "next-sanity";

import type { AdminProjectImage } from "@/lib/admin-types";

type SanityImageAssetRef = {
  _ref: string;
  _type: "reference";
};

type SanityAccessibleImageDoc = {
  _key?: string;
  _type: "image";
  asset?: SanityImageAssetRef;
  alt?: {
    cs?: string;
    en?: string;
  };
};

type SanityImageAsset = {
  _id: string;
  url?: string;
};

function imageKey() {
  return Math.random().toString(36).slice(2, 10);
}

export async function uploadImageAsset(client: SanityClient, file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  return client.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type || "application/octet-stream",
  });
}

export function buildAccessibleImage(
  assetId: string,
  altCs: string,
  altEn: string,
): SanityAccessibleImageDoc {
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: assetId,
    },
    alt: {
      cs: altCs,
      en: altEn,
    },
  };
}

export function buildGalleryImage(
  assetId: string,
  altCs: string,
  altEn: string,
): SanityAccessibleImageDoc {
  return {
    _key: imageKey(),
    ...buildAccessibleImage(assetId, altCs, altEn),
  };
}

export function mapAdminProjectImage(
  image: SanityAccessibleImageDoc | null | undefined,
  asset?: SanityImageAsset | null,
): AdminProjectImage | null {
  const assetId = image?.asset?._ref ?? asset?._id;

  if (!assetId) {
    return null;
  }

  return {
    _key: image?._key,
    assetId,
    url: asset?.url,
    altCs: image?.alt?.cs ?? "",
    altEn: image?.alt?.en ?? "",
  };
}

export function getFileFromFormData(formData: FormData, name: string) {
  const value = formData.get(name);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

export function getFilesFromFormData(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0);
}
