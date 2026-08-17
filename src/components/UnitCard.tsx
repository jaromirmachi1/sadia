import { Link } from "@/i18n/navigation";
import { CmsImageView } from "@/components/CmsImageView";
import { StatusBadge } from "@/components/StatusBadge";
import { formatPrice } from "@/utils/format";
import type { UnitSummary } from "@/sanity/types";
import type { Locale } from "@/utils/routes";

type UnitCardProps = {
  unit: UnitSummary;
  locale: Locale;
  statusLabel: string;
  priceOnRequestLabel: string;
};

export function UnitCard({
  unit,
  locale,
  statusLabel,
  priceOnRequestLabel,
}: UnitCardProps) {
  const photo = unit.photos[0];

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={{
          pathname: "/flat/[slug]",
          params: { slug: unit.slug },
        }}
        className="flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <div className="sadia-card-cut-20 relative aspect-[4/3] overflow-hidden bg-sadia-gray-light">
          {photo ? (
            <CmsImageView
              image={photo}
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : null}
          <div className="absolute left-4 top-4">
            <StatusBadge label={statusLabel} status={unit.status} />
          </div>
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <p className="text-body-sm uppercase tracking-[0.12em] text-sadia-gray">
            {unit.project?.name ?? unit.identifier}
          </p>
          <h3 className="mt-2 font-display text-heading-md font-medium text-sadia-navy">
            {unit.layout} · {unit.areaM2} m²
          </h3>
          <p className="mt-2 text-body-base text-sadia-navy-black/70">
            {unit.project?.location}
            {unit.floor != null ? ` · ${unit.floor}.` : ""}
          </p>
          <p className="mt-auto pt-5 text-body-lg font-semibold text-sadia-navy-black">
            {unit.priceOnRequest
              ? priceOnRequestLabel
              : formatPrice(unit.price, unit.currency, locale)}
          </p>
        </div>
      </Link>
    </article>
  );
}
