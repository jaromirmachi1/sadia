export type AdminUnit = {
  _id: string;
  identifier: string;
  slug: string;
  layout: string;
  unitType: "apartment" | "commercial";
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
  status: "available" | "reserved" | "sold" | "soldThirdParty" | "rented";
  dealType: "sale" | "rent";
  featured: boolean;
  externalUrl?: string;
  projectId: string;
  projectName: string;
  _updatedAt?: string;
};

export type AdminUnitDetail = AdminUnit & {
  floorPlanImage?: AdminProjectImage | null;
  photos: AdminProjectImage[];
};

export type ProjectStatus = "in-progress" | "in-realization" | "completed" | "upcoming";
export type ProjectType = "for-sale" | "for-rent" | "mixed";
export type ProjectSalesMode = "soldByUs" | "sellByFirm";

export type AdminProject = {
  _id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  type: ProjectType;
  salesMode: ProjectSalesMode;
  location: string;
  unitCount: number;
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
  descriptionCs: string;
  descriptionEn: string;
  completionDate?: string;
  badgeCs?: string;
  badgeEn?: string;
  taglineCs?: string;
  taglineEn?: string;
  handoverCs?: string;
  handoverEn?: string;
  website?: string;
  salesMode: ProjectSalesMode;
  geo?: { lat: number; lng: number };
  landmarks: Array<{ cs: string; en: string }>;
  locationDescriptionCs?: string;
  locationDescriptionEn?: string;
  amenities: Array<{
    titleCs: string;
    titleEn: string;
    itemsCs: string;
    itemsEn: string;
  }>;
  downloads: Array<{ titleCs: string; titleEn: string; url: string }>;
  timeline: Array<{
    date?: string;
    titleCs: string;
    titleEn: string;
    descriptionCs?: string;
    descriptionEn?: string;
  }>;
  heroImage?: AdminProjectImage | null;
  gallery: AdminProjectImage[];
};

export type ProjectFormValues = {
  nameCs: string;
  nameEn: string;
  slug: string;
  status: ProjectStatus;
  type: ProjectType;
  salesMode: ProjectSalesMode;
  location: string;
  address: string;
  mapLat?: number;
  mapLng?: number;
  descriptionCs: string;
  descriptionEn: string;
  completionDate?: string;
  badgeCs?: string;
  badgeEn?: string;
  taglineCs?: string;
  taglineEn?: string;
  handoverCs?: string;
  handoverEn?: string;
  website?: string;
  landmarksCs: string;
  landmarksEn: string;
  locationDescriptionCs?: string;
  locationDescriptionEn?: string;
  amenities: Array<{
    titleCs: string;
    titleEn: string;
    itemsCs: string;
    itemsEn: string;
  }>;
  downloads: Array<{ titleCs: string; titleEn: string; url: string }>;
  timeline: Array<{
    date?: string;
    titleCs: string;
    titleEn: string;
    descriptionCs?: string;
    descriptionEn?: string;
  }>;
  heroAltCs: string;
  heroAltEn: string;
  removeGalleryKeys: string[];
};

export type AdminStats = {
  projects: number;
  units: number;
  available: number;
  forSale: number;
  forRent: number;
};

export type UnitFormValues = {
  projectId: string;
  identifier: string;
  layout: string;
  areaM2: number;
  floor: number;
  price?: number;
  currency: "CZK" | "EUR";
  priceOnRequest: boolean;
  status: AdminUnit["status"];
  dealType: AdminUnit["dealType"];
  featured: boolean;
  photoAltCs: string;
  photoAltEn: string;
  floorPlanAltCs: string;
  floorPlanAltEn: string;
  removePhotoKeys: string[];
  removeFloorPlan: boolean;
  orientation?: string;
  cellarM2?: number;
  outdoorM2?: number;
  balconyM2?: number;
  loggiaM2?: number;
  terraceM2?: number;
  gardenM2?: number;
  unitType: "apartment" | "commercial";
  externalUrl?: string;
};

export const UNIT_LAYOUTS = [
  "S",
  "1+kk",
  "1+1",
  "2+kk",
  "2+1",
  "3+kk",
  "3+1",
  "4+kk",
  "4+1",
  "5+kk",
  "5+1",
] as const;

export const UNIT_STATUSES = [
  "available",
  "reserved",
  "sold",
  "rented",
] as const;

export const DEAL_TYPES = ["sale", "rent"] as const;

export const UNIT_TYPES = ["apartment", "commercial"] as const;

export const PROJECT_STATUSES = [
  "upcoming",
  "in-progress",
  "in-realization",
  "completed",
] as const;

export const PROJECT_TYPES = ["for-sale", "for-rent", "mixed"] as const;

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

export function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
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

export function localizedList(cs: string, en: string) {
  const czech = splitLines(cs);
  const english = splitLines(en);
  const length = Math.max(czech.length, english.length);

  return Array.from({ length }, (_, index) => ({
    _type: "localizedString",
    _key: blockKey(),
    cs: czech[index] ?? english[index] ?? "",
    en: english[index] ?? czech[index] ?? "",
  })).filter((item) => item.cs || item.en);
}

function blockKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function textToPortableText(text: string) {
  const value = text.trim();

  if (!value) {
    return [];
  }

  return [
    {
      _type: "block",
      _key: blockKey(),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: blockKey(),
          text: value,
          marks: [],
        },
      ],
    },
  ];
}

export function portableTextToPlainText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .flatMap((block) => {
      if (
        typeof block === "object" &&
        block !== null &&
        "children" in block &&
        Array.isArray(block.children)
      ) {
        return block.children
          .map((child: { text?: string }) =>
            typeof child.text === "string" ? child.text : "",
          )
          .join("");
      }

      return [];
    })
    .join("\n\n")
    .trim();
}
