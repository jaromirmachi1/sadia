import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("Navigation");

  return (
    <main className="grid min-h-screen place-items-center bg-sadia-white px-gutter">
      <Container className="text-center">
        <p className="text-body-sm uppercase tracking-[0.18em] text-sadia-gray">
          404
        </p>
        <h1 className="mt-4 font-display text-display-md font-medium text-sadia-navy-black">
          SADIA
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-sadia-navy-black px-7 text-body-sm font-semibold text-sadia-white transition-opacity hover:opacity-90"
        >
          {t("projects")}
        </Link>
      </Container>
    </main>
  );
}
