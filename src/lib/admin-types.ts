export type ProjectStatus = "in-progress" | "in-realization" | "completed" | "rented" | "upcoming";
export type ProjectSalesMode = "soldByUs" | "sellByFirm";

export type AdminProject = {
  _id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  salesMode: ProjectSalesMode;
  location: string;
  showOnHomepage?: boolean;
};

export type AdminProjectImage = {
  _key?: string;
  assetId: string;
  url?: string;
  altCs: string;
  altEn: string;
};

export type AdminProjectDetail = AdminProject & {
  nameCs: string;
  nameEn: string;
  address: string;
  completionDate?: string;
  badgeCs?: string;
  badgeEn?: string;
  taglineCs?: string;
  taglineEn?: string;
  website?: string;
  salesMode: ProjectSalesMode;
  showOnHomepage?: boolean;
  geo?: { lat: number; lng: number };
  heroImage?: AdminProjectImage | null;
  gallery: AdminProjectImage[];
};

export type ProjectFormValues = {
  nameCs: string;
  nameEn: string;
  slug: string;
  status: ProjectStatus;
  salesMode: ProjectSalesMode;
  location: string;
  address: string;
  mapLat?: number;
  mapLng?: number;
  completionDate?: string;
  badgeCs?: string;
  badgeEn?: string;
  taglineCs?: string;
  taglineEn?: string;
  website?: string;
  showOnHomepage: boolean;
  heroAltCs: string;
  heroAltEn: string;
  removeGalleryKeys: string[];
};

export type AdminStats = {
  projects: number;
};

export const PROJECT_STATUSES = [
  "in-progress",
  "in-realization",
  "completed",
  "rented",
  "upcoming",
] as const;

export const PROJECT_SALES_MODES = ["soldByUs", "sellByFirm"] as const;

export function slugifyIdentifier(identifier: string) {
  return identifier
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toDatetimeLocalValue(iso?: string) {
  if (!iso) {
    return "";
  }

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function localizedValue(cs?: string, en?: string) {
  const czech = cs?.trim() ?? "";
  const english = en?.trim() ?? "";

  if (!czech && !english) {
    return undefined;
  }

  return {
    cs: czech || english,
    en: english || czech,
  };
}
