import { getPathname } from "@/i18n/navigation";
import { legalEntity } from "@/legal/entity";
import type { Locale } from "@/utils/routes";

import { absoluteUrl, siteName } from "./site";

type PageHref = Parameters<typeof getPathname>[0]["href"];

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function hrefForLocale(locale: Locale, href: PageHref): string {
  return getPathname({ locale, href });
}

export function buildOrganizationSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    legalName: legalEntity.name,
    url: absoluteUrl("/"),
    email: legalEntity.email,
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Radnická 376/11",
      addressLocality: "Brno",
      postalCode: "602 00",
      addressCountry: "CZ",
    },
  };
}

export function buildWebSiteSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl(hrefForLocale(locale, "/")),
    description,
    inLanguage: locale === "cs" ? "cs-CZ" : "en-GB",
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
  };
}

export type BreadcrumbSchemaItem = {
  name: string;
  href?: PageHref;
  locale: Locale;
};

export function buildBreadcrumbListSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href
        ? { item: absoluteUrl(hrefForLocale(item.locale, item.href)) }
        : {}),
    })),
  };
}

export function buildApartmentComplexSchema(input: {
  name: string;
  description?: string;
  address?: string;
  locality: string;
  url: string;
  image?: string;
  availableUnits: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: input.address,
      addressLocality: input.locality,
      addressCountry: "CZ",
    },
    numberOfAvailableAccommodationUnits: input.availableUnits,
  };
}

export function buildRealEstateListingSchema(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  address?: string;
  locality: string;
  floorSize: number;
  numberOfRooms?: string;
  price?: number;
  priceCurrency?: string;
  priceOnRequest: boolean;
  dealType: "sale" | "rent";
  availability:
    | "available"
    | "reserved"
    | "sold"
    | "soldThirdParty"
    | "rented";
}) {
  const availabilityMap = {
    available: "https://schema.org/InStock",
    reserved: "https://schema.org/PreOrder",
    sold: "https://schema.org/SoldOut",
    soldThirdParty: "https://schema.org/SoldOut",
    rented: "https://schema.org/SoldOut",
  } as const;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: input.address,
      addressLocality: input.locality,
      addressCountry: "CZ",
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: input.floorSize,
      unitCode: "MTK",
    },
    ...(input.numberOfRooms
      ? { numberOfRooms: input.numberOfRooms }
      : {}),
    offers: {
      "@type": "Offer",
      businessFunction:
        input.dealType === "rent"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
      availability: availabilityMap[input.availability],
      ...(input.priceOnRequest || input.price == null
        ? {}
        : {
            price: input.price,
            priceCurrency: input.priceCurrency ?? "CZK",
          }),
    },
  };
}
