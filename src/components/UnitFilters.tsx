"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { UnitCard } from "@/components/UnitCard";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { UnitSummary } from "@/sanity/types";
import type { DealType } from "@/sanity/types";
import type { Locale } from "@/utils/routes";

type DealTypeFilter = "all" | DealType;

type UnitFiltersProps = {
  units: UnitSummary[];
  locale: Locale;
  labels: {
    location: string;
    layout: string;
    project: string;
    price: string;
    all: string;
    empty: string;
    results: string;
    status: Record<string, string>;
    priceOnRequest: string;
    dealType?: {
      all: string;
      rent: string;
      sale: string;
    };
  };
  showDealTypeFilter?: boolean;
};

function parseDealType(value: string | null): DealTypeFilter {
  if (value === "sale" || value === "rent") {
    return value;
  }

  return "all";
}

export function UnitFilters({
  units,
  locale,
  labels,
  showDealTypeFilter = false,
}: UnitFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealType = parseDealType(searchParams.get("type"));

  const locations = useMemo(
    () =>
      [...new Set(units.map((unit) => unit.project?.location).filter(Boolean))] as string[],
    [units],
  );
  const layouts = useMemo(
    () => [...new Set(units.map((unit) => unit.layout))],
    [units],
  );
  const projects = useMemo(
    () =>
      [...new Set(units.map((unit) => unit.project?.name).filter(Boolean))] as string[],
    [units],
  );

  const [location, setLocation] = useState("all");
  const [layout, setLayout] = useState("all");
  const [project, setProject] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");

  const filtered = useMemo(() => {
    return units.filter((unit) => {
      if (dealType !== "all" && unit.dealType !== dealType) {
        return false;
      }

      if (location !== "all" && unit.project?.location !== location) {
        return false;
      }

      if (layout !== "all" && unit.layout !== layout) {
        return false;
      }

      if (project !== "all" && unit.project?.name !== project) {
        return false;
      }

      if (maxPrice !== "all") {
        const limit = Number(maxPrice);
        if (unit.priceOnRequest || typeof unit.price !== "number" || unit.price > limit) {
          return false;
        }
      }

      return true;
    });
  }, [units, dealType, location, layout, project, maxPrice]);

  const dealTypeOptions: { value: DealTypeFilter; label: string }[] = labels.dealType
    ? [
        { value: "all", label: labels.dealType.all },
        { value: "rent", label: labels.dealType.rent },
        { value: "sale", label: labels.dealType.sale },
      ]
    : [];

  const setDealType = (next: DealTypeFilter) => {
    router.replace(
      next === "all"
        ? { pathname: "/availability" }
        : { pathname: "/availability", query: { type: next } },
      { scroll: false },
    );
  };

  return (
    <div>
      {showDealTypeFilter && labels.dealType ? (
        <div className="mb-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-sadia-gray-light">
          {dealTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDealType(option.value)}
              className={cn(
                "cursor-pointer pb-3 text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300",
                dealType === option.value
                  ? "border-b border-sadia-navy text-sadia-navy-black"
                  : "text-sadia-gray hover:text-sadia-navy-black",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 border border-sadia-gray-light p-5 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
          {labels.location}
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="min-h-11 border border-sadia-gray-light bg-sadia-white px-3 text-body-base text-sadia-navy-black"
          >
            <option value="all">{labels.all}</option>
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
          {labels.layout}
          <select
            value={layout}
            onChange={(event) => setLayout(event.target.value)}
            className="min-h-11 border border-sadia-gray-light bg-sadia-white px-3 text-body-base text-sadia-navy-black"
          >
            <option value="all">{labels.all}</option>
            {layouts.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
          {labels.project}
          <select
            value={project}
            onChange={(event) => setProject(event.target.value)}
            className="min-h-11 border border-sadia-gray-light bg-sadia-white px-3 text-body-base text-sadia-navy-black"
          >
            <option value="all">{labels.all}</option>
            {projects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-body-sm text-sadia-gray">
          {labels.price}
          <select
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="min-h-11 border border-sadia-gray-light bg-sadia-white px-3 text-body-base text-sadia-navy-black"
          >
            <option value="all">{labels.all}</option>
            <option value="20000">≤ 20 000</option>
            <option value="25000">≤ 25 000</option>
            <option value="30000">≤ 30 000</option>
            <option value="40000">≤ 40 000</option>
          </select>
        </label>
      </div>

      <p className="mt-6 text-body-sm text-sadia-gray">
        {labels.results.replace("{count}", String(filtered.length))}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 text-body-lg text-sadia-navy-black/70">{labels.empty}</p>
      ) : (
        <div className="mt-8 grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((unit) => (
            <UnitCard
              key={unit._id}
              unit={unit}
              locale={locale}
              statusLabel={labels.status[unit.status] ?? unit.status}
              priceOnRequestLabel={labels.priceOnRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
