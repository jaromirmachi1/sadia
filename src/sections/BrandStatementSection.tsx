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
          <p className="text-body-sm font-medium uppercase tracking-[0.22em] text-sadia-gray">
            {t("eyebrow")}
          </p>
          <h2
            id="brand-statement-title"
            className="mt-10 max-w-[15ch] font-display text-[clamp(2.25rem,5vw,6.25rem)] font-medium leading-[1.08] tracking-tight text-balance text-sadia-navy"
          >
            {t("title")}
          </h2>
          <p className="mt-10 max-w-xl text-body-lg leading-relaxed text-sadia-gray">
            {t("description")}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
