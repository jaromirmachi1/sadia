import { getTranslations } from "next-intl/server";

import { CmsImageView } from "@/components/CmsImageView";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import type { ProjectDetail } from "@/sanity/types";
import type { Locale } from "@/utils/routes";

type FeaturedProjectSectionProps = {
  locale: Locale;
  project: ProjectDetail;
};

const statusLabels = {
  cs: {
    "in-progress": "V přípravě",
    completed: "Dokončeno",
    upcoming: "Připravujeme",
  },
  en: {
    "in-progress": "In progress",
    completed: "Completed",
    upcoming: "Upcoming",
  },
} as const;

const typeLabels = {
  cs: {
    "for-sale": "Byty k prodeji",
    "for-rent": "Byty k pronájmu",
    mixed: "Prodej a pronájem",
  },
  en: {
    "for-sale": "Homes for sale",
    "for-rent": "Homes for rent",
    mixed: "Sale and rent",
  },
} as const;

export async function FeaturedProjectSection({
  locale,
  project,
}: FeaturedProjectSectionProps) {
  const t = await getTranslations("Home.featured");
  const secondaryImage =
    project.gallery[1] ?? project.gallery[0] ?? project.heroImage;

  return (
    <section
      aria-labelledby="featured-project-title"
      className="overflow-hidden bg-sadia-navy-black text-sadia-white"
    >
      <div className="relative min-h-[70vh] lg:min-h-[85vh]">
        <div className="absolute inset-0">
          <CmsImageView
            image={project.heroImage}
            alt={t("imageAlt")}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-sadia-navy-black/45" />
        </div>

        <Container className="relative z-[1] flex min-h-[70vh] flex-col justify-end py-16 lg:min-h-[85vh] lg:py-24">
          <Reveal>
            <p className="text-body-sm font-medium uppercase tracking-[0.22em] text-sadia-gray-light">
              {t("eyebrow")}
            </p>
            <h2
              id="featured-project-title"
              className="mt-5 max-w-[8ch] text-display-xl font-medium"
            >
              {project.name}
            </h2>
            <p className="mt-4 text-body-sm uppercase tracking-[0.16em] text-sadia-white/65">
              {project.location}
            </p>
          </Reveal>
        </Container>
      </div>

      <Container className="py-section-lg">
        <div className="grid items-end gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal>
            <p className="max-w-md text-body-lg leading-relaxed text-sadia-white/70">
              {project.description || t("description")}
            </p>
            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 text-body-sm">
              <div>
                <dt className="uppercase tracking-[0.16em] text-sadia-gray">
                  {t("statusLabel")}
                </dt>
                <dd className="mt-2 text-body-base font-medium text-sadia-white">
                  {statusLabels[locale][project.status]}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.16em] text-sadia-gray">
                  {t("typeLabel")}
                </dt>
                <dd className="mt-2 text-body-base font-medium text-sadia-white">
                  {typeLabels[locale][project.type]}
                </dd>
              </div>
            </dl>
            <Link
              href={{
                pathname: "/projects/[slug]",
                params: { slug: project.slug },
              }}
              className="sadia-underline-link mt-12 inline-flex pb-1 text-body-base font-semibold text-sadia-white"
            >
              {t("link")}
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="group">
            <div className="sadia-card-cut-20 relative aspect-[5/4] overflow-hidden bg-sadia-navy-black">
              <CmsImageView
                image={secondaryImage}
                alt={t("interiorAlt")}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="sadia-media-zoom object-cover"
              />
            </div>
            <div className="mt-8 max-w-sm">
              <h3 className="font-display text-heading-lg font-medium">
                {t("interiorTitle")}
              </h3>
              <p className="mt-4 text-body-base leading-relaxed text-sadia-white/65">
                {t("interiorDescription")}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
