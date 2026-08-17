import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, isSanityConfigured, projectId } from "@/sanity/env";

const builder = isSanityConfigured
  ? createImageUrlBuilder({ dataset, projectId })
  : null;

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity image URL builder is not configured.");
  }

  return builder.image(source).auto("format").fit("max");
}
