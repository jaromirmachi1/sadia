import Link from "next/link";
import { Plus } from "lucide-react";

import { DealTypeBadge, UnitStatusBadge } from "@/components/admin/UnitBadges";
import { DeleteUnitButton } from "@/components/admin/DeleteUnitButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminT } from "@/lib/admin-locale";
import { getAdminUnits } from "@/sanity/lib/admin-fetch";

export default async function AdminUnitsPage() {
  const [{ t }, units] = await Promise.all([getAdminT(), getAdminUnits()]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("unitsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("unitsPage.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("unitsPage.description")}
          </p>
        </div>
        <Link href="/admin/units/new" className={buttonVariants()}>
          <Plus className="size-4" />
          {t("nav.addUnit")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("unitsPage.columns.unit")}</TableHead>
              <TableHead>{t("unitsPage.columns.project")}</TableHead>
              <TableHead>{t("unitsPage.columns.layout")}</TableHead>
              <TableHead>{t("unitsPage.columns.deal")}</TableHead>
              <TableHead>{t("unitsPage.columns.status")}</TableHead>
              <TableHead>{t("unitsPage.columns.price")}</TableHead>
              <TableHead className="text-right">{t("unitsPage.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  {t("unitsPage.empty")}
                </TableCell>
              </TableRow>
            ) : (
              units.map((unit) => (
                <TableRow key={unit._id}>
                  <TableCell className="font-medium">{unit.identifier}</TableCell>
                  <TableCell>{unit.projectName}</TableCell>
                  <TableCell>{unit.layout}</TableCell>
                  <TableCell>
                    <DealTypeBadge dealType={unit.dealType} />
                  </TableCell>
                  <TableCell>
                    <UnitStatusBadge status={unit.status} />
                  </TableCell>
                  <TableCell>
                    {unit.priceOnRequest
                      ? t("unitsPage.onRequest")
                      : unit.price
                        ? `${unit.price.toLocaleString("cs-CZ")} ${unit.currency}`
                        : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/units/${unit._id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        {t("actions.edit")}
                      </Link>
                      <DeleteUnitButton unitId={unit._id} label={unit.identifier} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
