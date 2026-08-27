import { getTranslations } from "next-intl/server";

import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";
import { Link } from "@/i18n/navigation";
import { legalEntity } from "@/legal/entity";
import { routeKeys, type Locale } from "@/utils/routes";

type SiteFooterProps = {
  locale: Locale;
};

const exploreLinks = [
  { href: routeKeys.projects, key: "projects" },
  { href: routeKeys.news, key: "news" },
  { href: routeKeys.weBuy, key: "weBuy" },
  { href: routeKeys.about, key: "about" },
  { href: routeKeys.contact, key: "contact" },
] as const;

export async function SiteFooter({ locale }: SiteFooterProps) {
  void locale;
  const [t, nav] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Navigation"),
  ]);

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-sadia-navy-black text-sadia-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_0%_0%,rgba(210,233,250,0.08),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sadia-white/20 to-transparent"
      />

      <Container className="relative pt-[clamp(3.5rem,7vw,5.5rem)] pb-10 md:pb-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-14">
          <div className="lg:col-span-5">
            <BrandLogo tone="white" size="md" className="w-28 md:w-32" />
            <p className="mt-8 max-w-[28ch] text-[clamp(1.35rem,2.2vw,1.85rem)] font-normal leading-[1.15] tracking-tight text-sadia-white/90">
              {t("description")}
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2 lg:gap-x-10">
            <nav aria-label={nav("footerLabel")}>
              <p className="sadia-eyebrow-light">{t("exploreLabel")}</p>
              <ul className="mt-6 flex flex-col gap-3">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-3 text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-sadia-white/70 transition-colors hover:text-sadia-white"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-4 bg-sadia-white/25 transition-all duration-300 group-hover:w-7 group-hover:bg-sadia-white"
                      />
                      {nav(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="sadia-eyebrow-light">{t("contactLabel")}</p>
              <address className="mt-6 not-italic">
                <p className="font-display text-[0.9375rem] font-medium uppercase tracking-[0.08em] text-sadia-white">
                  {legalEntity.name}
                </p>
                <p className="mt-3 max-w-[22ch] text-body-base leading-relaxed text-sadia-white/55">
                  {legalEntity.address}
                </p>

                <div className="mt-6 flex flex-col gap-2">
                  <a
                    href={`mailto:${legalEntity.email}`}
                    className="text-body-base text-sadia-white/80 transition-colors hover:text-sadia-white"
                  >
                    {legalEntity.email}
                  </a>
                  <a
                    href={`tel:${legalEntity.phone.replace(/\s+/g, "")}`}
                    className="text-body-base text-sadia-white/80 transition-colors hover:text-sadia-white"
                  >
                    {legalEntity.phone}
                  </a>
                </div>

                <dl className="mt-8 space-y-1 text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-white/40">
                  <div className="flex gap-2">
                    <dt>{t("ico")}</dt>
                    <dd>{legalEntity.ico}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>{t("dic")}</dt>
                    <dd>{legalEntity.dic}</dd>
                  </div>
                </dl>
                <p className="mt-3 max-w-xs text-[0.6875rem] leading-relaxed tracking-[0.04em] text-sadia-white/35">
                  {t("register", {
                    court: legalEntity.court,
                    file: legalEntity.fileRef,
                  })}
                </p>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-sadia-white/10 pt-6 text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-white/40 md:mt-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
            <p>
              © {year} {legalEntity.name}
            </p>
            <p className="normal-case tracking-normal text-sadia-white/45">
              {t("credit")}{" "}
              <a
                href="https://www.uitherapy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sadia-white/70 transition-colors hover:text-sadia-white"
              >
                {t("creditBrand")}
              </a>
            </p>
          </div>

          <nav
            aria-label={t("legalNav")}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            <Link
              href={routeKeys.privacy}
              className="transition-colors hover:text-sadia-white/75"
            >
              {t("privacy")}
            </Link>
            <Link
              href={routeKeys.cookies}
              className="transition-colors hover:text-sadia-white/75"
            >
              {t("cookies")}
            </Link>
            <Link
              href={routeKeys.terms}
              className="transition-colors hover:text-sadia-white/75"
            >
              {t("terms")}
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
