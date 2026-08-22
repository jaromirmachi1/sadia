import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { routeKeys } from "@/utils/routes";

type NewsPaginationProps = {
  currentPage: number;
  totalPages: number;
  summary: string;
  previousLabel: string;
  nextLabel: string;
};

export function NewsPagination({
  currentPage,
  totalPages,
  summary,
  previousLabel,
  nextLabel,
}: NewsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label={summary}
      className="mt-16 flex flex-col items-center gap-6 border-t border-sadia-gray-light pt-10 sm:flex-row sm:justify-between"
    >
      <p className="text-body-sm text-sadia-gray">{summary}</p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={{
              pathname: routeKeys.news,
              query: { page: String(currentPage - 1) },
            }}
            className="inline-flex min-h-11 items-center px-4 text-body-sm font-semibold uppercase tracking-[0.12em] text-sadia-navy-black transition-opacity hover:opacity-70"
          >
            {previousLabel}
          </Link>
        ) : null}

        {pages.map((page) => (
          <Link
            key={page}
            href={{
              pathname: routeKeys.news,
              query: page > 1 ? { page: String(page) } : undefined,
            }}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-body-sm font-semibold transition-colors",
              page === currentPage
                ? "bg-sadia-navy-black text-sadia-white"
                : "text-sadia-navy-black hover:bg-muted",
            )}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages ? (
          <Link
            href={{
              pathname: routeKeys.news,
              query: { page: String(currentPage + 1) },
            }}
            className="inline-flex min-h-11 items-center px-4 text-body-sm font-semibold uppercase tracking-[0.12em] text-sadia-navy-black transition-opacity hover:opacity-70"
          >
            {nextLabel}
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
