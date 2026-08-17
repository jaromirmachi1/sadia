import { CmsImageView } from "@/components/CmsImageView";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { CmsImage, ProjectSummary } from "@/sanity/types";

type ProjectCardProps = {
  index: number;
  priority?: boolean;
  project: ProjectSummary;
  statusLabel: string;
  typeLabel: string;
  viewLabel: string;
};

function uniqueGallery(hero: CmsImage, gallery: CmsImage[], count: number) {
  const heroKey = JSON.stringify(hero.local?.src ?? hero.sanity);

  return gallery
    .filter((image) => JSON.stringify(image.local?.src ?? image.sanity) !== heroKey)
    .slice(0, count);
}

function MosaicImage({
  image,
  priority = false,
  sizes,
}: {
  image: CmsImage;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <div className="relative h-full min-h-0 overflow-hidden rounded-2xl bg-sadia-gray-light">
      <CmsImageView
        image={image}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
}

export function ProjectCard({
  index,
  priority = false,
  project,
  statusLabel,
  typeLabel,
  viewLabel,
}: ProjectCardProps) {
  const extras = uniqueGallery(project.heroImage, project.gallery, 2);
  const sideImage = extras[0];
  const bottomImage = extras[1];
  const locationLine = project.address || project.location;

  return (
    <article>
      <Link
        href={{
          pathname: "/projects/[slug]",
          params: { slug: project.slug },
        }}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <div className="lg:hidden">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-sadia-gray-light sm:aspect-16/10">
            <CmsImageView
              image={project.heroImage}
              alt=""
              fill
              priority={priority}
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
        </div>

        <div
          className={cn(
            "hidden lg:grid lg:h-[min(34rem,58vh)] lg:gap-3",
            sideImage && bottomImage
              ? "lg:grid-cols-3 lg:grid-rows-2"
              : sideImage
                ? "lg:grid-cols-3"
                : "lg:grid-cols-1",
          )}
        >
          <div
            className={cn(
              "h-full min-h-0",
              sideImage && bottomImage && "lg:col-span-2 lg:row-span-2",
              sideImage && !bottomImage && "lg:col-span-2",
            )}
          >
            <MosaicImage
              image={project.heroImage}
              priority={priority}
              sizes={sideImage ? "66vw" : "100vw"}
            />
          </div>

          {sideImage && bottomImage ? (
            <>
              <MosaicImage image={sideImage} sizes="34vw" />
              <MosaicImage image={bottomImage} sizes="34vw" />
            </>
          ) : sideImage ? (
            <MosaicImage image={sideImage} sizes="34vw" />
          ) : null}
        </div>

        <div className="grid gap-4 pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8 lg:grid-cols-12 lg:pt-8">
          <div className="lg:col-span-6">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-gray">
              {String(index).padStart(2, "0")} · {locationLine}
            </p>
            <h2 className="mt-2 font-medium text-balance text-heading-lg text-sadia-navy-black">
              {project.name}
            </h2>
          </div>

          <div className="sm:text-right lg:col-span-3 lg:text-left">
            <p className="font-medium text-sadia-navy-black">{statusLabel}</p>
            <p className="mt-1 text-body-base text-sadia-gray">{typeLabel}</p>
          </div>

          <div className="sm:col-span-2 lg:col-span-3 lg:justify-self-end">
            <span className="inline-flex items-center gap-2 text-body-sm font-semibold uppercase tracking-[0.14em] text-sadia-navy-black">
              {viewLabel}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
