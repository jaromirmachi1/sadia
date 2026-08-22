export type Locale = "cs" | "en";

export type AppPathname =
  | "/"
  | "/projects"
  | "/news"
  | "/availability"
  | "/for-sale"
  | "/for-rent"
  | "/we-buy"
  | "/about"
  | "/contact"
  | "/privacy"
  | "/cookies"
  | "/terms";

export const routeKeys = {
  home: "/" as const,
  projects: "/projects" as const,
  news: "/news" as const,
  availability: "/availability" as const,
  sale: "/for-sale" as const,
  rent: "/for-rent" as const,
  weBuy: "/we-buy" as const,
  about: "/about" as const,
  contact: "/contact" as const,
  privacy: "/privacy" as const,
  cookies: "/cookies" as const,
  terms: "/terms" as const,
};
