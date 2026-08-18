import { Fragment } from "react";

import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: AppHref;
};

type AppHref =
  | "/"
  | "/projects"
  | "/availability"
  | "/for-sale"
  | "/for-rent"
  | "/we-buy"
  | "/about"
  | "/contact"
  | {
      pathname: "/projects/[slug]";
      params: { slug: string };
    }
  | {
      pathname: "/flat/[slug]";
      params: { slug: string };
    };

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  label: string;
  className?: string;
};

export function Breadcrumbs({ items, label, className = "" }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-[0.8125rem] leading-none">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li
                  aria-hidden="true"
                  className="text-[#4A90C0]/35 select-none"
                >
                  /
                </li>
              ) : null}
              <li>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-[#4A90C0]/70 transition-colors hover:text-[#4A90C0]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-[#4A90C0]/55"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
