import { getTranslations } from "next-intl/server";

import { CmsImageView } from "@/components/CmsImageView";
import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { resolveImageAlt } from "@/seo/image";
import type { NewsSummary } from "@/sanity/types";
import { formatNewsDate } from "@/utils/format";
import { routeKeys, type Locale } from "@/utils/routes";

type NewsStackSectionProps = {
  locale: Locale;
  articles: NewsSummary[];
};

export async function NewsStackSection({
  locale,
  articles,
}: NewsStackSectionProps) {
  const t = await getTranslations("Home.newsStack");
  const featured = articles.slice(0, 3);

  if (!featured.length) return null;

  return (
    <section
      aria-labelledby="home-news-title"
      className="relative bg-sadia-white text-sadia-navy-black"
    >
      <Container className="py-[clamp(4rem,8vw,8rem)]">
        <div className="h-px w-full bg-sadia-gray-light" />

        <div className="flex flex-col gap-8 pt-8 sm:flex-row sm:items-end sm:justify-between md:pt-10">
          <Reveal>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-8 w-2 skew-x-[-20deg] bg-sadia-navy-black"
              />
              <h2 id="home-news-title" className="sadia-section-kicker">
                {t("title")}
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="sm:pb-0.5">
            <CtaLink href={routeKeys.news} variant="ghost">
              {t("allNews")}
            </CtaLink>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-12 sm:mt-14 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
          {featured.map((article, index) => (
            <li key={article._id}>
              <Reveal delay={index * 0.06}>
                <article>
                  <Link
                    href={{
                      pathname: "/news/[slug]",
                      params: { slug: article.slug },
                    }}
                    className="group flex h-full flex-col"
                  >
                    <div className="relative aspect-3/2 overflow-hidden bg-sadia-gray-light">
                      <CmsImageView
                        image={article.heroImage}
                        alt={resolveImageAlt(article.heroImage, article.title)}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-sadia-navy-black/0 transition-colors duration-500 group-hover:bg-sadia-navy-black/8" />
                    </div>

                    <time
                      dateTime={article.publishedAt}
                      className="sadia-meta mt-6"
                    >
                      {formatNewsDate(article.publishedAt, locale)}
                    </time>

                    <h3 className="sadia-title-content mt-3 text-balance text-heading-md transition-colors group-hover:text-sadia-navy">
                      {article.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-body-base leading-relaxed text-sadia-gray">
                      {article.excerpt}
                    </p>

                    <span className="sadia-link-caps mt-6 inline-flex items-center gap-2">
                      {t("readMore")}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
