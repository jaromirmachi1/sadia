import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
import { PageShell } from "@/components/PageShell";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { getProjects } from "@/sanity/lib/fetch";
import { buildPageMetadata } from "@/seo/metadata";
import { routeKeys, type Locale } from "@/utils/routes";

type ProjectsPageProps = {
  params: Promise<{ locale: Locale }>;
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
    "for-sale": "Prodej",
    "for-rent": "Pronájem",
    mixed: "Prodej a pronájem",
  },
  en: {
    "for-sale": "For sale",
    "for-rent": "For rent",
    mixed: "Sale and rent",
  },
} as const;

export async function generateMetadata({
  params,
}: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects.metadata" });

  return buildPageMetadata({
    locale,
    title: t("title"),
    description: t("description"),
    href: routeKeys.projects,
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, projects] = await Promise.all([
    getTranslations("Projects"),
    getProjects(locale),
  ]);

  return (
    <PageShell locale={locale}>
      <section className="bg-sadia-white pt-16 pb-10 lg:pb-12">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="lg:col-span-7">
              <p className="sadia-eyebrow">{t("eyebrow")}</p>
              <h1 className="sadia-heading-page mt-5 max-w-[14ch]">{t("title")}</h1>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-5">
              <p className="sadia-lead-md max-w-md">{t("description")}</p>
              {projects.length > 0 ? (
                <p className="mt-8 flex items-baseline gap-3">
                  <span className="font-display text-heading-lg font-medium tabular-nums text-sadia-navy-black">
                    {String(projects.length).padStart(2, "0")}
                  </span>
                  <span className="sadia-meta">{t("countLabel")}</span>
                </p>
              ) : null}
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-sadia-white pb-section-sm">
        <Container>
          {projects.length === 0 ? (
            <p className="text-body-lg text-sadia-navy-black/70">{t("empty")}</p>
          ) : (
            <div className="grid gap-12 lg:gap-16">
              {projects.map((project, index) => (
                <Reveal key={project._id} delay={index * 0.06}>
                  <ProjectCard
                    index={index + 1}
                    priority={index === 0}
                    project={project}
                    statusLabel={statusLabels[locale][project.status]}
                    typeLabel={typeLabels[locale][project.type]}
                    viewLabel={t("view")}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-muted/50 py-section-sm">
        <Container>
          <Reveal className="grid items-end gap-8 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-7">
              <p className="sadia-eyebrow">{t("ctaEyebrow")}</p>
              <h2 className="sadia-heading-section mt-4 max-w-[14ch]">{t("ctaTitle")}</h2>
              <p className="sadia-lead-md mt-5 max-w-md">{t("ctaDescription")}</p>
            </div>
            <div className="lg:col-span-5 lg:justify-self-end">
              <CtaLink href={routeKeys.weBuy}>{t("cta")}</CtaLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}
