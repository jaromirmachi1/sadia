import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { CmsImageView } from "@/components/CmsImageView";
import { Container } from "@/components/Container";
import { HeroMotion } from "@/components/HeroMotion";
import type { CmsImage } from "@/sanity/types";

type ProjectHeroSectionProps = {
  name: string;
  address: string;
  statusLabel: string;
  badge?: string;
  heroImage: CmsImage;
  breadcrumbs: BreadcrumbItem[];
  breadcrumbsLabel: string;
  scrollLabel: string;
  contentId?: string;
};

export function ProjectHeroSection({
  name,
  address,
  statusLabel,
  badge,
  heroImage,
  breadcrumbs,
  breadcrumbsLabel,
  scrollLabel,
  contentId = "project-content",
}: ProjectHeroSectionProps) {
  return (
    <section
      aria-labelledby="project-hero-title"
      data-header-theme="dark"
      className="relative min-h-svh overflow-hidden bg-sadia-navy-black text-sadia-white"
    >
      <div className="absolute inset-0" data-hero-media>
        <CmsImageView
          image={heroImage}
          alt={heroImage.alt || name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,46,0.42)_0%,rgba(18,20,46,0.12)_22%,rgba(18,20,46,0.16)_48%,rgba(18,20,46,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[11rem] bg-[linear-gradient(180deg,rgba(18,20,46,0.5)_0%,rgba(18,20,46,0.18)_58%,transparent_100%)] md:h-[13rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,20,46,0.28)_0%,transparent_62%)]" />
      </div>

      <Container className="relative z-2 flex min-h-svh flex-col justify-end pb-10 pt-32 md:pb-14 lg:pb-16">
        <Breadcrumbs
          label={breadcrumbsLabel}
          tone="light"
          className="absolute top-28 md:top-32"
          items={breadcrumbs}
        />

        <HeroMotion>
          <div className="grid w-full gap-8 border-t border-sadia-white/25 pt-6 md:grid-cols-12 md:items-end md:gap-x-10">
            <div className="md:col-span-8">
              {badge ? (
                <p className="mb-5 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-sadia-white/65">
                  {badge}
                </p>
              ) : null}
              <h1
                id="project-hero-title"
                className="max-w-[18ch] font-display text-[clamp(2.25rem,4.8vw,4.25rem)] font-medium leading-[1.05] tracking-[-0.025em] text-balance text-sadia-white"
              >
                {name}
              </h1>
            </div>

            <div className="flex items-end justify-between gap-8 md:col-span-4 md:block">
              <div className="max-w-sm">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-white/65">
                  {statusLabel}
                </p>
                <p className="mt-3 text-body-base leading-relaxed text-sadia-white/70">
                  {address}
                </p>
              </div>
              <a
                href={`#${contentId}`}
                className="group mt-8 hidden items-center gap-4 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-white/70 transition-colors hover:text-sadia-white focus-visible:outline-2 focus-visible:outline-offset-4 md:inline-flex"
              >
                <span>{scrollLabel}</span>
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-300 group-hover:translate-y-1"
                >
                  ↓
                </span>
              </a>
            </div>
          </div>
        </HeroMotion>
      </Container>
    </section>
  );
}
