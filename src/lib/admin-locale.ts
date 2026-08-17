import "server-only";

import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export const ADMIN_LOCALE_COOKIE = "sadia_admin_locale";
export type AdminLocale = "cs" | "en";

export async function getAdminLocale(): Promise<AdminLocale> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_LOCALE_COOKIE)?.value === "en" ? "en" : "cs";
}

export async function getAdminMessages() {
  const locale = await getAdminLocale();
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return { locale, messages };
}

export async function getAdminT(namespace: string = "Admin") {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace });

  return { locale, t };
}

