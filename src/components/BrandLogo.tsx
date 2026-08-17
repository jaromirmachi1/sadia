import Image, { type StaticImageData } from "next/image";

import navyLarge from "@/logos/sdbl.svg";
import navyMedium from "@/logos/sdbm.svg";
import navySmall from "@/logos/sdbs.svg";
import whiteLarge from "@/logos/sdl.svg";
import whiteMedium from "@/logos/sdm.svg";
import whiteSmall from "@/logos/sds.svg";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: "navy" | "white";
};

const logos: Record<
  NonNullable<BrandLogoProps["tone"]>,
  Record<NonNullable<BrandLogoProps["size"]>, StaticImageData>
> = {
  navy: {
    sm: navySmall,
    md: navyMedium,
    lg: navyLarge,
  },
  white: {
    sm: whiteSmall,
    md: whiteMedium,
    lg: whiteLarge,
  },
};

const sizeClasses: Record<
  NonNullable<BrandLogoProps["size"]>,
  string
> = {
  sm: "w-[5.25rem]",
  md: "w-40",
  lg: "w-64",
};

export function BrandLogo({
  alt = "SADIA",
  className,
  priority = false,
  size = "md",
  tone = "navy",
}: BrandLogoProps) {
  return (
    <Image
      src={logos[tone][size]}
      alt={alt}
      className={cn("h-auto", sizeClasses[size], className)}
      priority={priority}
    />
  );
}
