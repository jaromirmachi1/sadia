import { getTranslations } from "next-intl/server";

import { CmsImageView } from "@/components/CmsImageView";
import { Container } from "@/components/Container";
import { CtaLink } from "@/components/CtaLink";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { resolveImageAlt } from "@/seo/image";
import type { ProjectSummary } from "@/sanity/types";
import { routeKeys, type Locale } from "@/utils/routes";
import { cn } from "@/lib/utils";

type ProjectsStackSectionProps = {
  locale: Locale;
  projects: ProjectSummary[];
};

const statusLabels = {
  cs: {
    "in-progress": "V přípravě",
    "in-realization": "V realizaci",
    completed: "Dokončeno",
    rented: "Pronajato",
    upcoming: "Připravujeme",
  },
  en: {
    "in-progress": "In preparation",
    "in-realization": "Under construction",
    completed: "Completed",
    rented: "Rented",
    upcoming: "Upcoming",
  },
} as const;

export async function ProjectsStackSection({
  locale,
  projects,
}: ProjectsStackSectionProps) {
  const t = await getTranslations("Home.projectsStack");

  if (!projects.length) return null;

  return (
    <section
      aria-labelledby="home-projects-title"
      className="relative bg-sadia-white text-sadia-navy-black"
    >
      <Container className="pb-[clamp(4rem,8vw,10rem)] pt-8 md:pt-10">
        <div className="h-px w-full bg-sadia-gray-light" />

        <div className="grid gap-14 pt-8 md:grid-cols-12 md:gap-x-10 md:pt-10">
          <header className="md:col-span-4">
            <Reveal>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-8 w-2 skew-x-[-20deg] bg-sadia-navy-black"
                />
                <h2 id="home-projects-title" className="sadia-section-kicker">
                  {t("title")}
                </h2>
              </div>
            </Reveal>
          </header>

          <div className="md:col-span-7 md:col-start-6">
            <Reveal delay={0.08}>
              <p className="sadia-lead-lg">{t("description")}</p>
            </Reveal>
          </div>
        </div>
      </Container>

      <div>
        {projects.map((project, index) => (
          <article
            key={project._id}
            className="relative bg-sadia-white md:sticky md:top-[var(--sadia-header-height)] md:h-[calc(100svh-var(--sadia-header-height))]"
            style={{ zIndex: index + 1 }}
          >
            <Container
              className={cn(
                "flex min-h-[82svh] flex-col pb-gutter pt-5 md:h-full md:min-h-0",
                index > 0 && "border-t border-sadia-gray-light",
              )}
            >
              <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 pb-5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] md:grid-cols-[4rem_1.5fr_0.8fr_0.8fr_auto] md:gap-x-8">
                <p className="text-sadia-gray">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-[0.8125rem] font-medium tracking-[0.06em]">
                  {project.name}
                </h3>
                <p className="hidden text-sadia-gray md:block">
                  {project.location}
                </p>
                <p className="hidden text-sadia-gray md:block">
                  {statusLabels[locale]?.[project.status] ?? project.status}
                </p>
                <Link
                  href={{
                    pathname: "/projects/[slug]",
                    params: { slug: project.slug },
                  }}
                  className="group inline-flex items-center gap-2 justify-self-end"
                  aria-label={`${t("view")} ${project.name}`}
                >
                  <span>{t("view")}</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>

              <Link
                href={{
                  pathname: "/projects/[slug]",
                  params: { slug: project.slug },
                }}
                className="group relative mx-auto min-h-0 w-full flex-1 overflow-hidden bg-sadia-gray-light md:w-[76%]"
                aria-label={`${t("view")} ${project.name}`}
              >
                <CmsImageView
                  image={project.heroImage}
                  alt={resolveImageAlt(
                    project.heroImage,
                    `${project.name} — ${project.location}`,
                  )}
                  fill
                  sizes="(max-width: 767px) 100vw, 76vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-sadia-navy-black/0 transition-colors duration-500 group-hover:bg-sadia-navy-black/10" />
              </Link>

              <div className="flex justify-between pt-4 text-[0.6875rem] uppercase tracking-[0.08em] text-sadia-gray md:hidden">
                <p>{project.location}</p>
                <p>{statusLabels[locale]?.[project.status] ?? project.status}</p>
              </div>
            </Container>
          </article>
        ))}
      </div>

      <Container className="border-t border-sadia-gray-light pb-[clamp(4rem,8vw,10rem)] pt-8 md:pt-10">
        <Reveal className="flex justify-end" delay={0.08}>
          <CtaLink href={routeKeys.projects}>{t("allProjects")}</CtaLink>
        </Reveal>
      </Container>
    </section>
  );
}
