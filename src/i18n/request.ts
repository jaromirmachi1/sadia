import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  let locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  if (!hasLocale(routing.locales, requestedLocale)) {
    const cookieStore = await cookies();
    const adminLocale = cookieStore.get("sadia_admin_locale")?.value;

    if (hasLocale(routing.locales, adminLocale)) {
      locale = adminLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
