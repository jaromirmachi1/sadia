import type { StaticImageData } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";

export type ProjectStatus = "in-progress" | "completed" | "upcoming";
export type ProjectType = "for-sale" | "for-rent" | "mixed";
export type UnitStatus = "available" | "reserved" | "sold" | "rented";
export type DealType = "sale" | "rent";

export type CmsImage = {
  alt: string;
  local?: StaticImageData;
  sanity?: SanityImageSource;
};

export type ProjectSummary = {
  _id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  type: ProjectType;
  location: string;
  address?: string;
  heroImage: CmsImage;
  gallery: CmsImage[];
  completionDate?: string;
};

export type UnitType = "apartment" | "commercial";

export type UnitSummary = {
  _id: string;
  identifier: string;
  slug: string;
  layout: string;
  unitType: UnitType;
  areaM2: number;
  floor: number;
  orientation?: string;
  cellarM2?: number;
  outdoorM2?: number;
  balconyM2?: number;
  loggiaM2?: number;
  terraceM2?: number;
  gardenM2?: number;
  price?: number;
  currency: string;
  priceOnRequest: boolean;
  status: UnitStatus;
  dealType: DealType;
  featured: boolean;
  photos: CmsImage[];
  project?: {
    _id: string;
    name: string;
    slug: string;
    location: string;
  };
};

export type ProjectAmenity = {
  title: string;
  items: string[];
};

export type ProjectDownload = {
  title: string;
  url: string;
};

export type ProjectTimelineItem = {
  title: string;
  date?: string;
  description?: string;
};

export type ProjectDetail = ProjectSummary & {
  address: string;
  geo?: { lat: number; lng: number };
  gallery: CmsImage[];
  description: string;
  badge?: string;
  tagline?: string;
  landmarks: string[];
  handover?: string;
  website?: string;
  locationDescription?: string;
  amenities: ProjectAmenity[];
  downloads: ProjectDownload[];
  timeline: ProjectTimelineItem[];
  units: UnitSummary[];
};

export type UnitDetail = UnitSummary & {
  floorPlanImage?: CmsImage;
  project: {
    _id: string;
    name: string;
    slug: string;
    location: string;
    address: string;
  };
};

export type HomeStats = {
  projects: number;
  units: number;
  totalSqm: number;
  forSale: number;
  forRent: number;
};

export type SiteSettings = {
  companyName: string;
  address: string;
  registrationNumber?: string;
  vatNumber?: string;
  email: string;
  phone: string;
};
