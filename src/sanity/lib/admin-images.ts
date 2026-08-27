import "server-only";

import sharp from "sharp";
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

export class InvalidAdminImageError extends Error {
  constructor(cause?: unknown) {
    super("INVALID_IMAGE");
    this.name = "InvalidAdminImageError";
    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}

function imageKey() {
  return Math.random().toString(36).slice(2, 10);
}

function toJpegFilename(name: string) {
  const base = name.replace(/\.[^.]+$/, "").trim() || "image";
  return `${base}.jpg`;
}

async function normalizeImageForSanity(file: File) {
  const input = Buffer.from(await file.arrayBuffer());

  try {
    const buffer = await sharp(input, { failOn: "none" })
      .rotate()
      .resize({
        width: 3200,
        height: 3200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    return {
      buffer,
      filename: toJpegFilename(file.name),
      contentType: "image/jpeg" as const,
    };
  } catch (error) {
    throw new InvalidAdminImageError(error);
  }
}

export async function uploadImageAsset(client: SanityClient, file: File) {
  const normalized = await normalizeImageForSanity(file);

  try {
    return await client.assets.upload("image", normalized.buffer, {
      filename: normalized.filename,
      contentType: normalized.contentType,
    });
  } catch (error) {
    throw new InvalidAdminImageError(error);
  }
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
