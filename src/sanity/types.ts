import type { StaticImageData } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";

export type ProjectStatus = "in-progress" | "in-realization" | "completed" | "upcoming";
export type ProjectSalesMode = "soldByUs" | "sellByFirm";

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
  salesMode: ProjectSalesMode;
  location: string;
  address?: string;
  heroImage: CmsImage;
  gallery: CmsImage[];
  completionDate?: string;
  showOnHomepage?: boolean;
};

export type ProjectDetail = ProjectSummary & {
  address: string;
  geo?: { lat: number; lng: number };
  gallery: CmsImage[];
  description: string;
  badge?: string;
  tagline?: string;
  website?: string;
  unitCount?: number;
};

export type HomeStats = {
  projects: number;
};

export type SiteSettings = {
  companyName: string;
  address: string;
  registrationNumber?: string;
  vatNumber?: string;
  email: string;
};
