import { getTranslations } from "next-intl/server";

import { SiteHeaderClient } from "@/components/SiteHeaderClient";
import { routeKeys, type Locale } from "@/utils/routes";

type SiteHeaderProps = {
  locale: Locale;
  variant?: "overlay" | "solid" | "light";
};

export async function SiteHeader({
  locale,
  variant = "light",
}: SiteHeaderProps) {
  const t = await getTranslations("Navigation");
  const navigation = [
    { href: routeKeys.home, label: t("home") },
    { href: routeKeys.about, label: t("about") },
    { href: routeKeys.projects, label: t("projects") },
    { href: routeKeys.news, label: t("news") },
    { href: routeKeys.weBuy, label: t("weBuy") },
    { href: routeKeys.contact, label: t("contact") },
  ] as const;

  return (
    <SiteHeaderClient
      locale={locale}
      variant={variant}
      navigation={navigation}
      interestLabel={t("interest")}
      menuLabel={t("menu")}
      closeLabel={t("close")}
      primaryLabel={t("primaryLabel")}
      mobileLabel={t("mobileLabel")}
    />
  );
}
