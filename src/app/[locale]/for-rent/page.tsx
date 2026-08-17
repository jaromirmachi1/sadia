import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/utils/routes";
import { redirect } from "next/navigation";

type RedirectPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ForRentRedirect({ params }: RedirectPageProps) {
  const { locale } = await params;
  const pathname = getPathname({
    locale,
    href: {
      pathname: "/availability",
      query: { type: "rent" },
    },
  });

  redirect(pathname);
}
