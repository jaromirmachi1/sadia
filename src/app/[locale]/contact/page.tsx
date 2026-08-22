import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaButton } from "@/components/CtaLink";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/sanity/lib/fetch";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";

type ContactPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.metadata" });
  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.contact,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([
    getTranslations("Contact"),
    getSiteSettings(locale),
  ]);

  return (
    <PageShell locale={locale}>
      <section className="bg-sadia-white pb-section-lg pt-16">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal>
            <p className="sadia-eyebrow">{t("eyebrow")}</p>
            <h1 className="sadia-heading-page mt-4 max-w-[12ch] text-sadia-navy">
              {t("title")}
            </h1>
              <p className="mt-6 max-w-md text-body-lg text-sadia-gray">
                {t("description")}
              </p>

              <dl className="mt-10 space-y-5 text-body-base">
                <div>
                  <dt className="text-body-sm uppercase tracking-[0.12em] text-sadia-gray">
                    {t("address")}
                  </dt>
                  <dd className="mt-2 font-semibold text-sadia-navy-black">
                    {settings.address}
                  </dd>
                </div>
                <div>
                  <dt className="text-body-sm uppercase tracking-[0.12em] text-sadia-gray">
                    {t("email")}
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${settings.email}`}
                      className="font-semibold text-sadia-navy hover:opacity-70"
                    >
                      {settings.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-body-sm uppercase tracking-[0.12em] text-sadia-gray">
                    {t("phone")}
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                      className="font-semibold text-sadia-navy hover:opacity-70"
                    >
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.08}>
              <form className="space-y-5 border border-sadia-gray-light p-7 md:p-9">
                <p className="text-body-sm text-sadia-gray">{t("formHint")}</p>
                <p className="text-body-sm text-sadia-gray">
                  {t.rich("formPrivacy", {
                    privacy: (chunks) => (
                      <Link
                        href={routeKeys.privacy}
                        className="text-sadia-navy-black underline-offset-2 hover:underline"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
                <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
                  {t("fields.name")}
                  <input
                    name="name"
                    required
                    className="min-h-11 border border-sadia-gray-light px-3 text-body-base text-sadia-navy-black"
                  />
                </label>
                <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
                  {t("fields.email")}
                  <input
                    name="email"
                    type="email"
                    required
                    className="min-h-11 border border-sadia-gray-light px-3 text-body-base text-sadia-navy-black"
                  />
                </label>
                <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
                  {t("fields.phone")}
                  <input
                    name="phone"
                    type="tel"
                    className="min-h-11 border border-sadia-gray-light px-3 text-body-base text-sadia-navy-black"
                  />
                </label>
                <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
                  {t("fields.message")}
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="border border-sadia-gray-light px-3 py-3 text-body-base text-sadia-navy-black"
                  />
                </label>
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <CtaButton type="submit">{t("submit")}</CtaButton>
              </form>
            </Reveal>
          </div>

          <Reveal className="mt-section-sm">
            <iframe
              title={t("map")}
              src="https://www.openstreetmap.org/export/embed.html?bbox=16.601%2C49.191%2C16.615%2C49.199&layer=mapnik&marker=49.195%2C16.608"
              className="h-80 w-full border border-sadia-gray-light"
              loading="lazy"
            />
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}
