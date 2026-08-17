"use client";

import { useParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/utils/routes";

type LocaleSwitcherProps = {
  locale: Locale;
  className?: string;
};

const locales = [
  { code: "cs" as const, label: "CZ" },
  { code: "en" as const, label: "EN" },
];

export function LocaleSwitcher({ locale, className }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const params = useParams();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.75rem] font-medium uppercase tracking-[0.14em]",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((item, index) => {
        const isActive = item.code === locale;

        return (
          <span key={item.code} className="inline-flex items-center gap-1.5">
            {index > 0 ? (
              <span aria-hidden="true" className="text-current/25">
                /
              </span>
            ) : null}
            {isActive ? (
              <span
                aria-current="true"
                className="text-[#4A90C0]"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={
                  {
                    pathname,
                    params,
                  } as React.ComponentProps<typeof Link>["href"]
                }
                locale={item.code}
                className="text-current/45 transition-colors hover:text-[#4A90C0] focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
