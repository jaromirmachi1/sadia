import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import type { Locale } from "@/utils/routes";

type PageShellProps = {
  children: React.ReactNode;
  locale: Locale;
  headerVariant?: "overlay" | "solid" | "light";
};

export function PageShell({
  children,
  locale,
  headerVariant = "solid",
}: PageShellProps) {
  return (
    <>
      <SiteHeader locale={locale} variant={headerVariant} />
      <main>{children}</main>
      <SiteFooter locale={locale} />
    </>
  );
}
