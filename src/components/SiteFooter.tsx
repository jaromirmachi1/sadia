import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";
import { Link } from "@/i18n/navigation";
import { routeKeys, type Locale } from "@/utils/routes";

type SiteFooterProps = {
  locale: Locale;
};

export async function SiteFooter({ locale: _locale }: SiteFooterProps) {
  void _locale;
  const [t, nav] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Navigation"),
  ]);

  return (
    <footer className="border-t border-sadia-white/10 bg-sadia-navy-black py-20 text-sadia-white">
      <Container>
        <div className="grid gap-16 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="max-w-sm">
            <BrandLogo tone="white" size="sm" className="mb-8 w-24" />
            <p className="text-body-base leading-relaxed text-sadia-white/55">
              {t("description")}
            </p>
          </div>

          <nav
            aria-label={nav("footerLabel")}
            className="flex flex-col gap-4 text-body-base text-sadia-white/75"
          >
            <Link href={routeKeys.projects} className="hover:text-sadia-white">
              {nav("projects")}
            </Link>
            <Link href={routeKeys.weBuy} className="hover:text-sadia-white">
              {nav("weBuy")}
            </Link>
            <Link href={routeKeys.about} className="hover:text-sadia-white">
              {nav("about")}
            </Link>
            <Link href={routeKeys.contact} className="hover:text-sadia-white">
              {nav("contact")}
            </Link>
          </nav>

          <address className="not-italic">
            <p className="mb-3 text-body-sm uppercase tracking-[0.16em] text-sadia-gray">
              {t("addressLabel")}
            </p>
            <p className="text-body-base text-sadia-white/75">{t("address")}</p>
          </address>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-sadia-white/10 pt-8 text-body-sm text-sadia-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SADIA</p>
          <p>{t("rights")}</p>
        </div>
      </Container>
    </footer>
  );
}
