const DEFAULT_SITE_URL = "https://www.sadiaestate.cz";

function parseHttpsOrigin(raw: string | undefined): URL | undefined {
  if (!raw?.trim()) {
    return undefined;
  }

  try {
    const withProtocol = raw.includes("://") ? raw : `https://${raw}`;
    const url = new URL(withProtocol.replace(/\/$/, ""));
    url.protocol = "https:";
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return undefined;
  }
}

export function getSiteUrl(): URL {
  return (
    parseHttpsOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    parseHttpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    new URL(DEFAULT_SITE_URL)
  );
}

export function getMetadataBase(): URL {
  return getSiteUrl();
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
