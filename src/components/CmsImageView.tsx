import Image, { type ImageProps } from "next/image";

import { urlForImage } from "@/sanity/lib/image";
import type { CmsImage } from "@/sanity/types";
import { cn } from "@/lib/utils";

type CmsImageViewProps = Omit<ImageProps, "src" | "alt"> & {
  image: CmsImage;
  alt?: string;
};

export function CmsImageView({
  image,
  alt,
  className,
  ...props
}: CmsImageViewProps) {
  const resolvedAlt = alt ?? image.alt;

  if (image.local) {
    return (
      <Image
        src={image.local}
        alt={resolvedAlt}
        className={cn(className)}
        {...props}
      />
    );
  }

  if (image.sanity) {
    const builder = urlForImage(image.sanity);
    const width =
      typeof props.width === "number"
        ? props.width
        : props.fill
          ? 1600
          : 1200;
    const height =
      typeof props.height === "number"
        ? props.height
        : props.fill
          ? 1200
          : 900;

    return (
      <Image
        src={builder.width(width).height(height).url()}
        alt={resolvedAlt}
        className={cn(className)}
        {...props}
      />
    );
  }

  return null;
}
