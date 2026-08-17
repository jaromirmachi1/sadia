"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  createUnitFormAction,
  updateUnitFormAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEAL_TYPES,
  UNIT_LAYOUTS,
  UNIT_STATUSES,
  UNIT_TYPES,
  type AdminProject,
  type AdminProjectImage,
  type UnitFormValues,
} from "@/lib/admin-types";
import { cn } from "@/lib/utils";

type UnitFormProps = {
  mode: "create" | "edit";
  projects: AdminProject[];
  unitId?: string;
  defaultValues?: Partial<UnitFormValues>;
  photos?: AdminProjectImage[];
  floorPlanImage?: AdminProjectImage | null;
};

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function UnitFields({
  projects,
  defaultValues,
}: {
  projects: AdminProject[];
  defaultValues?: Partial<UnitFormValues>;
}) {
  const t = useTranslations("Admin.unitForm");
  const tStatus = useTranslations("Admin.unitStatus");
  const tDeal = useTranslations("Admin.dealType");
  const tUnitType = useTranslations("Admin.unitType");

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="projectId">{t("project")}</Label>
          <select
            id="projectId"
            name="projectId"
            defaultValue={defaultValues?.projectId ?? ""}
            required
            className={fieldClassName}
          >
            <option value="" disabled>
              {t("selectProject")}
            </option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="identifier">{t("identifier")}</Label>
          <Input
            id="identifier"
            name="identifier"
            defaultValue={defaultValues?.identifier ?? ""}
            placeholder="A1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="layout">{t("layout")}</Label>
          <select
            id="layout"
            name="layout"
            defaultValue={defaultValues?.layout ?? "2+kk"}
            className={fieldClassName}
          >
            {UNIT_LAYOUTS.map((layout) => (
              <option key={layout} value={layout}>
                {layout}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitType">{t("unitType")}</Label>
          <select
            id="unitType"
            name="unitType"
            defaultValue={defaultValues?.unitType ?? "apartment"}
            className={fieldClassName}
          >
            {UNIT_TYPES.map((type) => (
              <option key={type} value={type}>
                {tUnitType(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaM2">{t("area")}</Label>
          <Input
            id="areaM2"
            name="areaM2"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.areaM2 ?? ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor">{t("floor")}</Label>
          <Input
            id="floor"
            name="floor"
            type="number"
            step="1"
            defaultValue={defaultValues?.floor ?? 0}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orientation">{t("orientation")}</Label>
          <Input
            id="orientation"
            name="orientation"
            defaultValue={defaultValues?.orientation ?? ""}
            placeholder="SV"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cellarM2">{t("cellar")}</Label>
          <Input
            id="cellarM2"
            name="cellarM2"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.cellarM2 ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="balconyM2">{t("balcony")}</Label>
          <Input
            id="balconyM2"
            name="balconyM2"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.balconyM2 ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loggiaM2">{t("loggia")}</Label>
          <Input
            id="loggiaM2"
            name="loggiaM2"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.loggiaM2 ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="terraceM2">{t("terrace")}</Label>
          <Input
            id="terraceM2"
            name="terraceM2"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.terraceM2 ?? defaultValues?.outdoorM2 ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gardenM2">{t("garden")}</Label>
          <Input
            id="gardenM2"
            name="gardenM2"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.gardenM2 ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dealType">{t("dealType")}</Label>
          <select
            id="dealType"
            name="dealType"
            defaultValue={defaultValues?.dealType ?? "rent"}
            className={fieldClassName}
          >
            {DEAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {tDeal(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{t("status")}</Label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "available"}
            className={fieldClassName}
          >
            {UNIT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {tStatus(status)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t("currency")}</Label>
          <select
            id="currency"
            name="currency"
            defaultValue={defaultValues?.currency ?? "CZK"}
            className={fieldClassName}
          >
            <option value="CZK">CZK</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{t("price")}</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            defaultValue={defaultValues?.price ?? ""}
            placeholder="24500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="priceOnRequest"
            defaultChecked={defaultValues?.priceOnRequest ?? false}
            className={cn("size-4 rounded border border-input")}
          />
          {t("priceOnRequest")}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaultValues?.featured ?? false}
            className={cn("size-4 rounded border border-input")}
          />
          {t("featured")}
        </label>
      </div>
    </>
  );
}

function UnitImageFields({
  mode,
  photos = [],
  floorPlanImage,
  defaultValues,
}: {
  mode: "create" | "edit";
  photos?: AdminProjectImage[];
  floorPlanImage?: AdminProjectImage | null;
  defaultValues?: Partial<UnitFormValues>;
}) {
  const t = useTranslations("Admin.unitForm");

  return (
    <div className="space-y-8 border-t border-border pt-8">
      <div>
        <h3 className="text-sm font-medium">{t("images")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("imagesHint")}</p>
      </div>

      {photos.length > 0 ? (
        <div className="space-y-4">
          <Label>{t("currentPhotos")}</Label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((image) => (
              <label
                key={image._key ?? image.assetId}
                className="overflow-hidden rounded-lg border border-border"
              >
                {image.url ? (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.url}
                      alt={image.altCs || image.altEn || t("unitPhoto")}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                ) : null}
                <div className="flex items-center gap-2 border-t border-border bg-background px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    name="removePhotos"
                    value={image._key}
                    className="size-4 rounded border border-input"
                  />
                  {t("remove")}
                </div>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="photos">
            {mode === "create" ? t("photos") : t("addPhotos")}
          </Label>
          <Input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            required={mode === "create" && photos.length === 0}
          />
          <p className="text-xs text-muted-foreground">
            {t("photosHint")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="photoAltCs">{t("photoAltCs")}</Label>
            <Input
              id="photoAltCs"
              name="photoAltCs"
              defaultValue={defaultValues?.photoAltCs ?? ""}
              placeholder="Interiér bytu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoAltEn">{t("photoAltEn")}</Label>
            <Input
              id="photoAltEn"
              name="photoAltEn"
              defaultValue={defaultValues?.photoAltEn ?? ""}
              placeholder="Apartment interior"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {floorPlanImage?.url ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {t("currentFloorPlan")}
            </p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={floorPlanImage.url}
                alt={floorPlanImage.altCs || floorPlanImage.altEn || t("floorPlan")}
                fill
                className="object-contain p-2"
                sizes="320px"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="removeFloorPlan"
                className="size-4 rounded border border-input"
              />
              {t("removeFloorPlan")}
            </label>
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floorPlanImage">
              {mode === "edit" && floorPlanImage ? t("floorPlanReplace") : t("floorPlan")}
            </Label>
            <Input
              id="floorPlanImage"
              name="floorPlanImage"
              type="file"
              accept="image/*"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="floorPlanAltCs">{t("floorPlanAltCs")}</Label>
              <Input
                id="floorPlanAltCs"
                name="floorPlanAltCs"
                defaultValue={
                  defaultValues?.floorPlanAltCs ?? floorPlanImage?.altCs ?? ""
                }
                placeholder="Půdorys bytu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorPlanAltEn">{t("floorPlanAltEn")}</Label>
              <Input
                id="floorPlanAltEn"
                name="floorPlanAltEn"
                defaultValue={
                  defaultValues?.floorPlanAltEn ?? floorPlanImage?.altEn ?? ""
                }
                placeholder="Unit floor plan"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UnitForm({
  mode,
  projects,
  unitId,
  defaultValues,
  photos,
  floorPlanImage,
}: UnitFormProps) {
  const t = useTranslations("Admin.unitForm");
  const [isPending, startTransition] = useTransition();

  if (mode === "create") {
    return (
      <form
        action={createUnitFormAction}
        encType="multipart/form-data"
        className="space-y-8"
      >
        <UnitFields projects={projects} defaultValues={defaultValues} />
        <UnitImageFields mode="create" defaultValues={defaultValues} />
        <Button type="submit" disabled={projects.length === 0}>
          {t("create")}
        </Button>
      </form>
    );
  }

  const handleUpdate = (formData: FormData) => {
    if (!unitId) return;

    startTransition(async () => {
      try {
        await updateUnitFormAction(unitId, formData);
        toast.success(t("updated"));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t("error"));
      }
    });
  };

  return (
    <form
      action={handleUpdate}
      encType="multipart/form-data"
      className="space-y-8"
    >
      <UnitFields projects={projects} defaultValues={defaultValues} />
      <UnitImageFields
        mode="edit"
        photos={photos}
        floorPlanImage={floorPlanImage}
        defaultValues={defaultValues}
      />
      <Button type="submit" disabled={isPending || projects.length === 0}>
        {isPending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
