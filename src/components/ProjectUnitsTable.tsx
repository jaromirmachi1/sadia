"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ChevronsUpDown, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/utils/format";
import type { UnitSummary } from "@/sanity/types";
import type { Locale } from "@/utils/routes";

type ProjectUnitsTableProps = {
  locale: Locale;
  units: UnitSummary[];
};

type SortKey =
  | "identifier"
  | "unitType"
  | "dealType"
  | "floor"
  | "layout"
  | "cellar"
  | "outdoor"
  | "area"
  | "orientation"
  | "price";

function formatArea(value?: number) {
  if (typeof value !== "number") return "—";
  return value.toString().replace(".", ",");
}

function outdoorParts(unit: UnitSummary) {
  return [
    unit.balconyM2,
    unit.loggiaM2,
    unit.terraceM2 ?? unit.outdoorM2,
    unit.gardenM2,
  ];
}

function formatOutdoor(unit: UnitSummary) {
  return outdoorParts(unit)
    .map((value) => (typeof value === "number" ? formatArea(value) : "—"))
    .join(" / ");
}

function outdoorSortValue(unit: UnitSummary) {
  return outdoorParts(unit).reduce<number>(
    (sum, value) => sum + (typeof value === "number" ? value : 0),
    0,
  );
}

function canOpenUnit(unit: UnitSummary) {
  return Boolean(unit.slug) && unit.status !== "sold" && unit.status !== "rented";
}

function priceSortValue(unit: UnitSummary) {
  if (unit.status !== "available" || unit.priceOnRequest) return Number.POSITIVE_INFINITY;
  return typeof unit.price === "number" ? unit.price : Number.POSITIVE_INFINITY;
}

function priceCeilings(units: UnitSummary[]) {
  if (new Set(units.map((unit) => unit.dealType)).size > 1) return [];
  const prices = units
    .filter(
      (unit) =>
        unit.status === "available" &&
        !unit.priceOnRequest &&
        typeof unit.price === "number",
    )
    .map((unit) => unit.price as number);

  if (prices.length === 0) return [];

  const max = Math.max(...prices);
  const rent = units.length > 0 && units.every((unit) => unit.dealType === "rent");
  const steps = rent
    ? [15000, 20000, 25000, 30000, 40000, 50000, 75000]
    : [3_000_000, 5_000_000, 8_000_000, 10_000_000, 15_000_000, 20_000_000, 30_000_000];

  return Array.from(
    new Set(
      steps.filter(
        (step) => step <= max || step === steps.find((value) => value >= max),
      ),
    ),
  );
}

export function ProjectUnitsTable({ locale, units }: ProjectUnitsTableProps) {
  const t = useTranslations("ProjectDetail");
  const common = useTranslations("Common");
  const [layout, setLayout] = useState("all");
  const [dealType, setDealType] = useState("all");
  const [priceMax, setPriceMax] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("identifier");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const layouts = useMemo(
    () => Array.from(new Set(units.map((unit) => unit.layout))).sort(),
    [units],
  );
  const pricedUnits = useMemo(
    () =>
      dealType === "all"
        ? units
        : units.filter((unit) => unit.dealType === dealType),
    [units, dealType],
  );
  const ceilings = useMemo(() => priceCeilings(pricedUnits), [pricedUnits]);

  const filtered = useMemo(() => {
    const next = units.filter((unit) => {
      const layoutMatch = layout === "all" || unit.layout === layout;
      const dealTypeMatch = dealType === "all" || unit.dealType === dealType;
      const availabilityMatch =
        availability === "all" ||
        (availability === "available" && unit.status === "available") ||
        (availability === "reserved" && unit.status === "reserved") ||
        (availability === "sold" &&
          (unit.status === "sold" || unit.status === "rented"));
      const max = priceMax === "all" ? null : Number(priceMax);
      const priceMatch =
        max === null ||
        unit.status !== "available" ||
        unit.priceOnRequest ||
        (typeof unit.price === "number" && unit.price <= max);

      return layoutMatch && dealTypeMatch && availabilityMatch && priceMatch;
    });

    const direction = sortDir === "asc" ? 1 : -1;

    return next.sort((a, b) => {
      const values: Record<SortKey, string | number> = {
        identifier: a.identifier.localeCompare(b.identifier, locale) * direction,
        unitType: a.unitType.localeCompare(b.unitType) * direction,
        dealType: a.dealType.localeCompare(b.dealType) * direction,
        floor: (a.floor - b.floor) * direction,
        layout: a.layout.localeCompare(b.layout, locale) * direction,
        cellar: ((a.cellarM2 ?? 0) - (b.cellarM2 ?? 0)) * direction,
        outdoor: (outdoorSortValue(a) - outdoorSortValue(b)) * direction,
        area: (a.areaM2 - b.areaM2) * direction,
        orientation: (a.orientation ?? "").localeCompare(b.orientation ?? "", locale) * direction,
        price: (priceSortValue(a) - priceSortValue(b)) * direction,
      };

      return values[sortKey] as number;
    });
  }, [units, layout, dealType, availability, priceMax, sortKey, sortDir, locale]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDir("asc");
  }

  function resetFilters() {
    setLayout("all");
    setDealType("all");
    setPriceMax("all");
    setAvailability("all");
  }

  const selectClassName =
    "min-h-11 w-full min-w-[11rem] appearance-none rounded-none border-0 bg-transparent px-0 text-body-sm text-sadia-navy-black outline-none";

  function priceLabel(unit: UnitSummary) {
    if (unit.status !== "available") {
      return common(`status.${unit.status}`);
    }

    if (unit.priceOnRequest) {
      return common("priceOnRequest");
    }

    const price = formatPrice(unit.price, unit.currency, locale);
    return unit.dealType === "rent" ? t("pricePerMonth", { price }) : price;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-sadia-gray-light py-4 lg:flex-row lg:items-center">
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-gray">
            {t("filters.layout")}
          </span>
          <select
            value={layout}
            onChange={(event) => setLayout(event.target.value)}
            className={selectClassName}
          >
            <option value="all">{t("filters.allLayouts")}</option>
            {layouts.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 lg:border-l lg:border-sadia-gray-light lg:pl-6">
          <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-gray">
            {t("filters.dealType")}
          </span>
          <select
            value={dealType}
            onChange={(event) => {
              setDealType(event.target.value);
              setPriceMax("all");
            }}
            className={selectClassName}
          >
            <option value="all">{t("filters.allDealTypes")}</option>
            <option value="sale">{t("dealType.sale")}</option>
            <option value="rent">{t("dealType.rent")}</option>
          </select>
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 lg:border-l lg:border-sadia-gray-light lg:pl-6">
          <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-gray">
            {t("filters.price")}
          </span>
          <select
            value={priceMax}
            onChange={(event) => setPriceMax(event.target.value)}
            className={selectClassName}
          >
            <option value="all">{t("filters.unlimited")}</option>
            {ceilings.map((value) => (
              <option key={value} value={value}>
                {t("filters.priceUpTo", {
                  price: formatPrice(value, units[0]?.currency ?? "CZK", locale),
                })}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1 lg:border-l lg:border-sadia-gray-light lg:pl-6">
          <span className="text-[0.6875rem] uppercase tracking-[0.14em] text-sadia-gray">
            {t("filters.availability")}
          </span>
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className={selectClassName}
          >
            <option value="all">{t("filters.all")}</option>
            <option value="available">{t("filters.available")}</option>
            <option value="reserved">{t("filters.reserved")}</option>
            <option value="sold">{t("filters.sold")}</option>
          </select>
        </label>
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex size-11 shrink-0 items-center justify-center text-sadia-navy-black transition-opacity hover:opacity-60"
          aria-label={t("filters.reset")}
        >
          <RotateCcw className="size-4" strokeWidth={1.5} />
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-body-lg text-sadia-navy-black/70">
          {t("emptyUnits")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left text-body-sm">
            <thead className="border-b border-sadia-gray-light text-[0.625rem] uppercase tracking-[0.12em] text-sadia-gray">
              <tr>
                <SortHeader
                  label={t("table.unit")}
                  active={sortKey === "identifier"}
                  onClick={() => toggleSort("identifier")}
                />
                <SortHeader
                  label={t("table.unitType")}
                  active={sortKey === "unitType"}
                  onClick={() => toggleSort("unitType")}
                />
                <SortHeader
                  label={t("table.dealType")}
                  active={sortKey === "dealType"}
                  onClick={() => toggleSort("dealType")}
                />
                <SortHeader
                  label={t("table.floor")}
                  active={sortKey === "floor"}
                  onClick={() => toggleSort("floor")}
                />
                <SortHeader
                  label={t("table.layout")}
                  active={sortKey === "layout"}
                  onClick={() => toggleSort("layout")}
                />
                <SortHeader
                  label={t("table.cellar")}
                  active={sortKey === "cellar"}
                  onClick={() => toggleSort("cellar")}
                />
                <SortHeader
                  label={t("table.outdoor")}
                  active={sortKey === "outdoor"}
                  onClick={() => toggleSort("outdoor")}
                />
                <SortHeader
                  label={t("table.area")}
                  active={sortKey === "area"}
                  onClick={() => toggleSort("area")}
                />
                <SortHeader
                  label={t("table.orientation")}
                  active={sortKey === "orientation"}
                  onClick={() => toggleSort("orientation")}
                />
                <SortHeader
                  label={t("table.price")}
                  active={sortKey === "price"}
                  onClick={() => toggleSort("price")}
                />
                <th className="w-12 py-4 font-medium">
                  <span className="sr-only">{t("table.action")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((unit) => (
                <tr key={unit._id} className="border-b border-sadia-gray-light/80">
                  <td className="py-5 pr-4 font-medium text-sadia-navy-black">
                    {unit.identifier}
                  </td>
                  <td className="py-5 pr-4">{t(`unitType.${unit.unitType}`)}</td>
                  <td className="py-5 pr-4">{t(`dealType.${unit.dealType}`)}</td>
                  <td className="py-5 pr-4">{unit.floor}</td>
                  <td className="py-5 pr-4">{unit.layout}</td>
                  <td className="py-5 pr-4">{formatArea(unit.cellarM2)}</td>
                  <td className="py-5 pr-4 whitespace-nowrap">{formatOutdoor(unit)}</td>
                  <td className="py-5 pr-4">{formatArea(unit.areaM2)}</td>
                  <td className="py-5 pr-4">{unit.orientation || "—"}</td>
                  <td className="py-5 pr-4 font-semibold text-sadia-navy-black">
                    {priceLabel(unit)}
                  </td>
                  <td className="py-5 text-right">
                    {canOpenUnit(unit) ? (
                      <Link
                        href={{
                          pathname: "/flat/[slug]",
                          params: { slug: unit.slug },
                        }}
                        className="inline-flex size-8 items-center justify-center text-sadia-navy-black transition-opacity hover:opacity-60"
                        aria-label={`${t("viewUnit")} ${unit.identifier}`}
                      >
                        <ArrowRight className="size-4" strokeWidth={1.5} />
                      </Link>
                    ) : (
                      <span className="text-sadia-gray">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SortHeader({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <th className="py-4 pr-4 font-medium">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 text-left uppercase tracking-[0.12em]"
      >
        {label}
        <ChevronsUpDown
          className={active ? "size-3 opacity-80" : "size-3 opacity-35"}
          strokeWidth={1.5}
        />
      </button>
    </th>
  );
}
