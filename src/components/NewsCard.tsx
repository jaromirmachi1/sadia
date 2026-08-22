import { CmsImageView } from "@/components/CmsImageView";
import { Link } from "@/i18n/navigation";
import { resolveImageAlt } from "@/seo/image";
import type { NewsSummary } from "@/sanity/types";
import { formatNewsDate } from "@/utils/format";
import type { Locale } from "@/utils/routes";

type NewsCardProps = {
  article: NewsSummary;
  locale: Locale;
  readMoreLabel: string;
  priority?: boolean;
};

export function NewsCard({
  article,
  locale,
  readMoreLabel,
  priority = false,
}: NewsCardProps) {
  return (
    <article className="group border-t border-sadia-gray-light pt-10 first:border-t-0 first:pt-0">
      <Link
        href={{
          pathname: "/news/[slug]",
          params: { slug: article.slug },
        }}
        className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-12"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sadia-gray-light">
          <CmsImageView
            image={article.heroImage}
            alt={resolveImageAlt(article.heroImage, article.title)}
            fill
            priority={priority}
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        </div>

        <div>
          <time dateTime={article.publishedAt} className="sadia-meta">
            {formatNewsDate(article.publishedAt, locale)}
          </time>
          <h2 className="sadia-title-content mt-4 text-balance text-heading-lg transition-colors group-hover:text-sadia-navy">
            {article.title}
          </h2>
          <p className="mt-4 line-clamp-4 text-body-lg leading-relaxed text-sadia-gray">
            {article.excerpt}
          </p>
          <span className="sadia-link-caps mt-6 inline-flex items-center gap-2">
            {readMoreLabel}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
