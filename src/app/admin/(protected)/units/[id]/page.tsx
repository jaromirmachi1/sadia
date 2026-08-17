import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteUnitButton } from "@/components/admin/DeleteUnitButton";
import { UnitForm } from "@/components/admin/UnitForm";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminT } from "@/lib/admin-locale";
import { getAdminProjects, getAdminUnit } from "@/sanity/lib/admin-fetch";

type AdminEditUnitPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditUnitPage({ params }: AdminEditUnitPageProps) {
  const { id } = await params;
  const [{ t }, unit, projects] = await Promise.all([
    getAdminT(),
    getAdminUnit(id),
    getAdminProjects(),
  ]);

  if (!unit) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("unitsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("unitForm.editTitle", { name: unit.identifier })}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/units" className={buttonVariants({ variant: "outline" })}>
            {t("actions.back")}
          </Link>
          <DeleteUnitButton unitId={unit._id} label={unit.identifier} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("unitForm.details")}</CardTitle>
          <CardDescription>
            Slug: <code className="rounded bg-muted px-1 py-0.5">{unit.slug}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnitForm
            mode="edit"
            unitId={unit._id}
            projects={projects}
            photos={unit.photos}
            floorPlanImage={unit.floorPlanImage}
            defaultValues={{
              projectId: unit.projectId,
              identifier: unit.identifier,
              layout: unit.layout,
              unitType: unit.unitType ?? "apartment",
              areaM2: unit.areaM2,
              floor: unit.floor,
              orientation: unit.orientation,
              cellarM2: unit.cellarM2,
              outdoorM2: unit.outdoorM2,
              balconyM2: unit.balconyM2,
              loggiaM2: unit.loggiaM2,
              terraceM2: unit.terraceM2,
              gardenM2: unit.gardenM2,
              price: unit.price,
              currency: unit.currency as "CZK" | "EUR",
              priceOnRequest: unit.priceOnRequest,
              status: unit.status,
              dealType: unit.dealType,
              featured: unit.featured,
              photoAltCs: unit.photos[0]?.altCs,
              photoAltEn: unit.photos[0]?.altEn,
              floorPlanAltCs: unit.floorPlanImage?.altCs,
              floorPlanAltEn: unit.floorPlanImage?.altEn,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
