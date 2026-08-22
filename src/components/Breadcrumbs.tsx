import { Fragment } from "react";

import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: AppHref;
};

type AppHref =
  | "/"
  | "/projects"
  | "/news"
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
      pathname: "/news/[slug]";
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
  tone?: "default" | "light";
};

const toneStyles = {
  default: {
    separator: "text-[#4A90C0]/35",
    link: "text-[#4A90C0]/70 transition-colors hover:text-[#4A90C0]",
    current: "text-[#4A90C0]/55",
  },
  light: {
    separator: "text-sadia-white/35",
    link: "text-sadia-white/72 transition-colors hover:text-sadia-white",
    current: "text-sadia-white/55",
  },
} as const;

export function Breadcrumbs({
  items,
  label,
  className = "",
  tone = "default",
}: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  const styles = toneStyles[tone];

  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-[0.8125rem] leading-none">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden="true" className={`${styles.separator} select-none`}>
                  /
                </li>
              ) : null}
              <li>
                {item.href && !isLast ? (
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={styles.current}
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
