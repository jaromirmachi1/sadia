import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
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
        <p className="sadia-eyebrow">404</p>
        <h1 className="sadia-heading-page mt-4">{t("heading")}</h1>
        <p className="sadia-lead-md mx-auto mt-4 max-w-md">{t("description")}</p>
        <div className="mt-8 flex justify-center">
          <CtaLink href={routeKeys.home}>{nav("home")}</CtaLink>
        </div>
      </Container>
    </main>
  );
}
