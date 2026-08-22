import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CmsImageView } from "@/components/CmsImageView";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { RichTextContent } from "@/components/RichTextContent";
import { Link } from "@/i18n/navigation";
import { getNewsArticleBySlug, getNewsArticles } from "@/sanity/lib/fetch";
import {
  buildBreadcrumbListSchema,
  buildNewsArticleSchema,
  hrefForLocale,
} from "@/seo/json-ld";
import { buildPageMetadata } from "@/seo/metadata";
import { resolveImageAlt, resolveOgImageUrl } from "@/seo/image";
import { absoluteUrl } from "@/seo/site";
import { formatNewsDate } from "@/utils/format";
import { routeKeys, type Locale } from "@/utils/routes";

type NewsDetailPageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getNewsArticles("cs");

  return articles.flatMap((article) =>
    (["cs", "en"] as const).map((locale) => ({
      locale,
      slug: article.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getNewsArticleBySlug(locale, slug);

  if (!article) {
    return {};
  }

  const title = `${article.title} | SADIA`;

  return buildPageMetadata({
    locale,
    title,
    description: article.excerpt,
    href: { pathname: "/news/[slug]", params: { slug } },
    image: article.heroImage,
  });
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [article, t, nav] = await Promise.all([
    getNewsArticleBySlug(locale, slug),
    getTranslations("NewsDetail"),
    getTranslations("Navigation"),
  ]);

  if (!article) {
    notFound();
  }

  const articleUrl = absoluteUrl(
    hrefForLocale(locale, { pathname: "/news/[slug]", params: { slug } }),
  );

  const jsonLd = [
    buildNewsArticleSchema({
      title: article.title,
      description: article.excerpt,
      url: articleUrl,
      image: resolveOgImageUrl(article.heroImage),
      publishedAt: article.publishedAt,
      locale,
    }),
    buildBreadcrumbListSchema([
      { name: nav("home"), href: routeKeys.home, locale },
      { name: nav("news"), href: routeKeys.news, locale },
      { name: article.title, locale },
    ]),
  ];

  return (
    <PageShell locale={locale}>
      <JsonLd data={jsonLd} />

      <article className="bg-sadia-white pb-section-lg pt-16">
        <Container>
          <Breadcrumbs
            label={t("breadcrumbsLabel")}
            className="mb-10 lg:mb-12"
            items={[
              { label: nav("home"), href: routeKeys.home },
              { label: nav("news"), href: routeKeys.news },
              { label: article.title },
            ]}
          />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <Reveal>
              <time
                dateTime={article.publishedAt}
                className="sadia-eyebrow"
              >
                {formatNewsDate(article.publishedAt, locale)}
              </time>
              <h1 className="sadia-title-content mt-4 max-w-3xl text-display-md text-balance">
                {article.title}
              </h1>
              <p className="sadia-lead-md mt-6 max-w-2xl">{article.excerpt}</p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sadia-gray-light lg:sticky lg:top-28">
                <CmsImageView
                  image={article.heroImage}
                  alt={resolveImageAlt(article.heroImage, article.title)}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="mt-14 max-w-3xl">
            <RichTextContent value={article.body} />
          </Reveal>

          {article.relatedProject ? (
            <Reveal delay={0.16} className="mt-14 max-w-3xl">
              <div className="border border-sadia-gray-light bg-muted/40 p-6 lg:p-8">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-gray">
                  {t("relatedProject")}
                </p>
                <Link
                  href={{
                    pathname: "/projects/[slug]",
                    params: { slug: article.relatedProject.slug },
                  }}
                  className="mt-3 inline-flex text-heading-md font-medium text-sadia-navy-black transition-opacity hover:opacity-75"
                >
                  {article.relatedProject.name}
                </Link>
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.2} className="mt-14">
            <Link
              href={routeKeys.news}
              className="inline-flex min-h-12 items-center justify-center border border-sadia-navy-black px-7 text-body-sm font-semibold uppercase tracking-[0.12em] text-sadia-navy-black transition-colors hover:bg-sadia-navy-black hover:text-sadia-white"
            >
              {t("backToNews")}
            </Link>
          </Reveal>
        </Container>
      </article>
    </PageShell>
  );
}
