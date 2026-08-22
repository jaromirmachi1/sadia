import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";
import { Link } from "@/i18n/navigation";
import { legalEntity } from "@/legal/entity";
import { routeKeys, type Locale } from "@/utils/routes";

type SiteFooterProps = {
  locale: Locale;
};

export async function SiteFooter({ locale }: SiteFooterProps) {
  void locale;
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

          <address className="not-italic text-body-base text-sadia-white/75">
            <p className="mb-3 text-body-sm uppercase tracking-[0.16em] text-sadia-gray">
              {t("addressLabel")}
            </p>
            <p className="font-medium text-sadia-white">{legalEntity.name}</p>
            <p className="mt-3">{legalEntity.address}</p>
            <p className="mt-2">
              {t("ico")} {legalEntity.ico}
            </p>
            <p>
              {t("dic")} {legalEntity.dic}
            </p>
            <p className="mt-2 text-body-sm text-sadia-white/55">
              {t("register", {
                court: legalEntity.court,
                file: legalEntity.fileRef,
              })}
            </p>
            <p className="mt-4">
              <a
                href={`mailto:${legalEntity.email}`}
                className="hover:text-sadia-white"
              >
                {legalEntity.email}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={`tel:${legalEntity.phone.replace(/\s+/g, "")}`}
                className="hover:text-sadia-white"
              >
                {legalEntity.phone}
              </a>
            </p>
          </address>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-sadia-white/10 pt-8 text-body-sm text-sadia-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {legalEntity.name}
          </p>
          <nav
            aria-label={t("legalNav")}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <Link href={routeKeys.privacy} className="hover:text-sadia-white/70">
              {t("privacy")}
            </Link>
            <Link href={routeKeys.cookies} className="hover:text-sadia-white/70">
              {t("cookies")}
            </Link>
            <Link href={routeKeys.terms} className="hover:text-sadia-white/70">
              {t("terms")}
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
