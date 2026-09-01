export type ProjectStatus = "in-progress" | "in-realization" | "completed" | "upcoming";
export type ProjectSalesMode = "soldByUs" | "sellByFirm";

export type AdminProject = {
  _id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  salesMode: ProjectSalesMode;
  location: string;
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
  heroAltCs: string;
  heroAltEn: string;
  removeGalleryKeys: string[];
};

export type AdminStats = {
  projects: number;
};

export const PROJECT_STATUSES = [
  "upcoming",
  "in-progress",
  "in-realization",
  "completed",
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
