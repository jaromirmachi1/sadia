import { getTranslations } from "next-intl/server";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

export async function BrandStatementSection() {
  const t = await getTranslations("Home.statement");

  return (
    <section
      aria-labelledby="brand-statement-title"
      className="relative overflow-hidden bg-sadia-white py-section-lg text-sadia-navy-black"
    >
      <Container>
        <Reveal>
          <p className="sadia-eyebrow">{t("eyebrow")}</p>
          <h2 id="brand-statement-title" className="sadia-statement-lg mt-10 max-w-[15ch]">
            {t("title")}
          </h2>
          <p className="sadia-lead-md mt-10 max-w-xl">{t("description")}</p>
        </Reveal>
      </Container>
    </section>
  );
}
