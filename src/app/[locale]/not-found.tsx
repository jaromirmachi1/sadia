import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "NotFound" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.home,
    noIndex: true,
  });
}

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const [t, nav] = await Promise.all([
    getTranslations({ locale, namespace: "NotFound" }),
    getTranslations({ locale, namespace: "Navigation" }),
  ]);

  return (
    <main className="grid min-h-screen place-items-center bg-sadia-white px-gutter">
      <Container className="text-center">
        <p className="text-body-sm uppercase tracking-[0.18em] text-sadia-gray">
          404
        </p>
        <h1 className="mt-4 font-display text-display-md font-medium text-sadia-navy-black">
          {t("heading")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-body-lg text-sadia-gray">
          {t("description")}
        </p>
        <Link
          href={routeKeys.home}
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-sadia-navy-black px-7 text-body-sm font-semibold text-sadia-white transition-opacity hover:opacity-90"
        >
          {nav("home")}
        </Link>
      </Container>
    </main>
  );
}
