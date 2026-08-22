const DEFAULT_SITE_URL = "https://sadiaestate.cz";

export function getSiteUrl(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    return undefined;
  }

  try {
    return new URL(raw.replace(/\/$/, ""));
  } catch {
    return undefined;
  }
}

export function getMetadataBase(): URL {
  return getSiteUrl() ?? new URL(DEFAULT_SITE_URL);
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, getMetadataBase()).toString();
}

export const siteName = "SADIA";

export const openGraphLocale = {
  cs: "cs_CZ",
  en: "en_GB",
} as const;
