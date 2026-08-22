import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/Container";
import { NewsCard } from "@/components/NewsCard";
import { NewsPagination } from "@/components/NewsPagination";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { getNewsPage } from "@/sanity/lib/fetch";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";

type NewsPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News.metadata" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.news,
  });
}

export default async function NewsPage({
  params,
  searchParams,
}: NewsPageProps) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);

  const requestedPage = Number.parseInt(pageParam ?? "1", 10);
  const pageNumber = Number.isFinite(requestedPage) ? requestedPage : 1;

  const [t, newsPage] = await Promise.all([
    getTranslations("News"),
    getNewsPage(locale, pageNumber),
  ]);

  return (
    <PageShell locale={locale}>
      <section className="bg-sadia-white pt-16 pb-10 lg:pb-12">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="sadia-eyebrow">{t("eyebrow")}</p>
            <h1 className="sadia-heading-page mt-5">{t("title")}</h1>
            <p className="sadia-lead-md mt-6 max-w-2xl">{t("description")}</p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-sadia-white pb-section-lg">
        <Container>
          {newsPage.articles.length === 0 ? (
            <p className="text-body-lg text-sadia-navy-black/70">{t("empty")}</p>
          ) : (
            <>
              <div className="grid gap-12 lg:gap-16">
                {newsPage.articles.map((article, index) => (
                  <Reveal key={article._id} delay={index * 0.04}>
                    <NewsCard
                      article={article}
                      locale={locale}
                      readMoreLabel={t("readMore")}
                      priority={index === 0 && newsPage.page === 1}
                    />
                  </Reveal>
                ))}
              </div>

              <NewsPagination
                currentPage={newsPage.page}
                totalPages={newsPage.totalPages}
                summary={t("pagination", {
                  current: newsPage.page,
                  total: newsPage.totalPages,
                })}
                previousLabel={t("previous")}
                nextLabel={t("next")}
              />
            </>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
