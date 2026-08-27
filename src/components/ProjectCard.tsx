import { CmsImageView } from "@/components/CmsImageView";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { resolveImageAlt } from "@/seo/image";
import type { ProjectSummary } from "@/sanity/types";

type ProjectCardProps = {
  index: number;
  featured?: boolean;
  reversed?: boolean;
  priority?: boolean;
  project: ProjectSummary;
  statusLabel: string;
  typeLabel: string;
  viewLabel: string;
};

function CardArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 place-items-center rounded-full text-base transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45",
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="size-3.5"
      >
        <path
          d="M4 12L12 4M12 4H6.5M12 4V9.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ProjectCard({
  index,
  featured = false,
  reversed = false,
  priority = false,
  project,
  statusLabel,
  typeLabel,
  viewLabel,
}: ProjectCardProps) {
  const locationLine = project.address || project.location;
  const heroAlt = resolveImageAlt(
    project.heroImage,
    `${project.name} — ${locationLine}`,
  );
  const number = String(index).padStart(2, "0");

  if (featured) {
    return (
      <article>
        <Link
          href={{
            pathname: "/projects/[slug]",
            params: { slug: project.slug },
          }}
          className="group relative block overflow-hidden bg-sadia-navy-black text-sadia-white focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <div className="relative min-h-[32rem] md:min-h-[40rem] lg:min-h-[min(78svh,46rem)]">
            <CmsImageView
              image={project.heroImage}
              alt={heroAlt}
              fill
              priority={priority}
              sizes="100vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,46,0.08)_0%,rgba(18,20,46,0.12)_42%,rgba(18,20,46,0.82)_100%)]" />
          </div>

          <div className="absolute inset-x-0 bottom-0 z-2 grid gap-8 px-6 pb-8 pt-24 sm:px-10 lg:grid-cols-12 lg:items-end lg:px-14 lg:pb-12">
            <div className="lg:col-span-8">
              <p className="sadia-eyebrow-light">
                {number} · {locationLine}
              </p>
              <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(2.25rem,5vw,4.75rem)] font-medium uppercase leading-[0.95] tracking-[-0.03em] text-balance">
                {project.name}
              </h2>
            </div>

            <div className="flex items-end justify-between gap-6 lg:col-span-4 lg:flex-col lg:items-end lg:text-right">
              <div>
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.16em]">
                  {statusLabel}
                </p>
                <p className="mt-2 text-[0.75rem] uppercase tracking-[0.14em] text-sadia-white/65">
                  {typeLabel}
                </p>
              </div>
              <span className="inline-flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.16em]">
                {viewLabel}
                <CardArrow className="border border-white/35" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article>
      <Link
        href={{
          pathname: "/projects/[slug]",
          params: { slug: project.slug },
        }}
        className="group grid overflow-hidden bg-sadia-white text-sadia-navy-black focus-visible:outline-2 focus-visible:outline-offset-4 lg:grid-cols-12 lg:items-stretch"
      >
        <div
          className={cn(
            "relative min-h-[22rem] overflow-hidden bg-sadia-gray-light sm:min-h-[28rem] lg:col-span-7 lg:min-h-[34rem]",
            reversed && "lg:col-start-6 lg:row-start-1",
          )}
        >
          <CmsImageView
            image={project.heroImage}
            alt={heroAlt}
            fill
            priority={priority}
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        </div>

        <div
          className={cn(
            "flex flex-col justify-between gap-10 border-y border-sadia-gray-light px-6 py-10 sm:px-10 lg:col-span-5 lg:px-12 lg:py-14",
            reversed
              ? "lg:col-start-1 lg:row-start-1 lg:border-l-0 lg:border-r"
              : "lg:border-l lg:border-r-0",
          )}
        >
          <div>
            <p className="sadia-meta">
              {number} · {locationLine}
            </p>
            <h2 className="mt-5 max-w-[12ch] font-display text-[clamp(1.85rem,3.4vw,3.15rem)] font-medium uppercase leading-[1.05] tracking-[-0.025em] text-balance">
              {project.name}
            </h2>
          </div>

          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.16em]">
                {statusLabel}
              </p>
              <p className="mt-2 text-[0.75rem] uppercase tracking-[0.14em] text-sadia-gray">
                {typeLabel}
              </p>
            </div>
            <span className="inline-flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.16em]">
              {viewLabel}
              <CardArrow className="border border-sadia-navy-black/20" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
