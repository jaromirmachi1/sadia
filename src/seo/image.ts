import type { StaticImageData } from "next/image";

import { urlForImage } from "@/sanity/lib/image";
import { isSanityConfigured } from "@/sanity/env";
import type { CmsImage } from "@/sanity/types";

import { absoluteUrl, getMetadataBase } from "./site";

function localImageSrc(image: StaticImageData | string): string {
  return typeof image === "string" ? image : image.src;
}

export function resolveImageAlt(
  image: CmsImage,
  fallback: string,
  explicitAlt?: string,
): string {
  const candidate = explicitAlt ?? image.alt;
  return candidate.trim() || fallback;
}

export function resolveOgImageUrl(image: CmsImage): string | undefined {
  if (image.sanity && isSanityConfigured) {
    try {
      return urlForImage(image.sanity).width(1200).height(630).url();
    } catch {
      return undefined;
    }
  }

  if (image.local) {
    const src = localImageSrc(image.local);

    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    return new URL(src, getMetadataBase()).toString();
  }

  return undefined;
}

export function resolveOgImage(image?: CmsImage | string) {
  if (!image) {
    return undefined;
  }

  if (typeof image === "string") {
    const url = image.startsWith("http") ? image : absoluteUrl(image);
    return { url, width: 1200, height: 630, alt: siteNameFallback() };
  }

  const url = resolveOgImageUrl(image);
  if (!url) {
    return undefined;
  }

  return {
    url,
    width: 1200,
    height: 630,
    alt: image.alt || siteNameFallback(),
  };
}

function siteNameFallback() {
  return "SADIA";
}
