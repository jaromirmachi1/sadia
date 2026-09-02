"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  createProjectFormAction,
  updateProjectFormAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PROJECT_SALES_MODES,
  PROJECT_STATUSES,
  type AdminProjectImage,
  type ProjectFormValues,
} from "@/lib/admin-types";

type ProjectFormProps = {
  mode: "create" | "edit";
  projectId?: string;
  defaultValues?: Partial<ProjectFormValues>;
  heroImage?: AdminProjectImage | null;
  gallery?: AdminProjectImage[];
};

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ImagePreview({
  image,
  label,
}: {
  image: AdminProjectImage;
  label: string;
}) {
  if (!image.url) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={image.url}
          alt={image.altCs || image.altEn || label}
          fill
          className="object-cover"
          sizes="320px"
        />
      </div>
    </div>
  );
}

function ProjectImageFields({
  mode,
  heroImage,
  gallery = [],
  defaultValues,
}: {
  mode: "create" | "edit";
  heroImage?: AdminProjectImage | null;
  gallery?: AdminProjectImage[];
  defaultValues?: Partial<ProjectFormValues>;
}) {
  const t = useTranslations("Admin.projectForm");

  return (
    <div className="space-y-8 border-t border-border pt-8">
      <div>
        <h3 className="text-sm font-medium">{t("images")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("imagesHint")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {heroImage?.url ? (
          <ImagePreview image={heroImage} label={t("currentHero")} />
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroImage">
              {mode === "create" ? t("heroImage") : t("heroReplace")}
            </Label>
            <Input
              id="heroImage"
              name="heroImage"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              required={mode === "create" && !heroImage}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heroAltCs">{t("heroAltCs")}</Label>
              <Input
                id="heroAltCs"
                name="heroAltCs"
                defaultValue={defaultValues?.heroAltCs ?? heroImage?.altCs ?? ""}
                placeholder="Večerní pohled na dům"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroAltEn">{t("heroAltEn")}</Label>
              <Input
                id="heroAltEn"
                name="heroAltEn"
                defaultValue={defaultValues?.heroAltEn ?? heroImage?.altEn ?? ""}
                placeholder="Evening view of the building"
              />
            </div>
          </div>
        </div>
      </div>

      {gallery.length > 0 ? (
        <div className="space-y-4">
          <Label>{t("gallery")}</Label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((image) => (
              <label
                key={image._key ?? image.assetId}
                className="group relative overflow-hidden rounded-lg border border-border"
              >
                {image.url ? (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.url}
                      alt={image.altCs || image.altEn || t("galleryImage")}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                ) : null}
                <div className="flex items-center gap-2 border-t border-border bg-background px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    name="removeGallery"
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
          <Label htmlFor="gallery">{t("addGallery")}</Label>
          <Input
            id="gallery"
            name="gallery"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            multiple
          />
          <p className="text-xs text-muted-foreground">
            {t("galleryHint")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="galleryAltCs">{t("galleryAltCs")}</Label>
            <Input
              id="galleryAltCs"
              name="galleryAltCs"
              placeholder="Interiér bytu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="galleryAltEn">{t("galleryAltEn")}</Label>
            <Input
              id="galleryAltEn"
              name="galleryAltEn"
              placeholder="Apartment interior"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectFields({ defaultValues }: { defaultValues?: Partial<ProjectFormValues> }) {
  const t = useTranslations("Admin.projectForm");
  const tStatus = useTranslations("Admin.projectStatus");
  const tSalesMode = useTranslations("Admin.projectSalesMode");

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nameCs">{t("nameCs")}</Label>
          <Input
            id="nameCs"
            name="nameCs"
            defaultValue={defaultValues?.nameCs ?? ""}
            placeholder="Koblížná"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nameEn">{t("nameEn")}</Label>
          <Input
            id="nameEn"
            name="nameEn"
            defaultValue={defaultValues?.nameEn ?? ""}
            placeholder="Koblížná"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">{t("slug")}</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={defaultValues?.slug ?? ""}
            placeholder="koblizna"
          />
          <p className="text-xs text-muted-foreground">
            {t("slugHint")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="completionDate">{t("completionDate")}</Label>
          <Input
            id="completionDate"
            name="completionDate"
            type="date"
            defaultValue={defaultValues?.completionDate ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{t("status")}</Label>
          <select
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? "upcoming"}
            className={fieldClassName}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {tStatus(status)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salesMode">{t("salesMode")}</Label>
          <select
            id="salesMode"
            name="salesMode"
            defaultValue={defaultValues?.salesMode ?? "soldByUs"}
            className={fieldClassName}
          >
            {PROJECT_SALES_MODES.map((salesMode) => (
              <option key={salesMode} value={salesMode}>
                {tSalesMode(salesMode)}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">{t("salesModeHint")}</p>
        </div>

        <div className="flex items-start gap-3 md:col-span-2">
          <input
            id="showOnHomepage"
            name="showOnHomepage"
            type="checkbox"
            defaultChecked={defaultValues?.showOnHomepage ?? false}
            className="mt-1 size-4 rounded border border-input"
          />
          <div className="space-y-1">
            <Label htmlFor="showOnHomepage">{t("showOnHomepage")}</Label>
            <p className="text-xs text-muted-foreground">{t("showOnHomepageHint")}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t("location")}</Label>
          <Input
            id="location"
            name="location"
            defaultValue={defaultValues?.location ?? ""}
            placeholder="Brno · Brno-střed"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t("address")}</Label>
          <Input
            id="address"
            name="address"
            defaultValue={defaultValues?.address ?? ""}
            placeholder="Koblížná, Brno-střed"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapLat">{t("mapLat")}</Label>
          <Input
            id="mapLat"
            name="mapLat"
            type="number"
            step="any"
            defaultValue={defaultValues?.mapLat ?? ""}
            placeholder="49.1952"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapLng">{t("mapLng")}</Label>
          <Input
            id="mapLng"
            name="mapLng"
            type="number"
            step="any"
            defaultValue={defaultValues?.mapLng ?? ""}
            placeholder="16.6086"
          />
          <p className="text-xs text-muted-foreground">{t("mapCoordsHint")}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="badgeCs">{t("badgeCs")}</Label>
          <Input
            id="badgeCs"
            name="badgeCs"
            defaultValue={defaultValues?.badgeCs ?? ""}
            placeholder="Centrum Brna"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="badgeEn">{t("badgeEn")}</Label>
          <Input
            id="badgeEn"
            name="badgeEn"
            defaultValue={defaultValues?.badgeEn ?? ""}
            placeholder="Central Brno"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taglineCs">{t("taglineCs")}</Label>
          <Input
            id="taglineCs"
            name="taglineCs"
            defaultValue={defaultValues?.taglineCs ?? ""}
            placeholder="Město na dosah"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taglineEn">{t("taglineEn")}</Label>
          <Input
            id="taglineEn"
            name="taglineEn"
            defaultValue={defaultValues?.taglineEn ?? ""}
            placeholder="The city within reach"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website">{t("website")}</Label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={defaultValues?.website ?? ""}
            placeholder="https://"
          />
        </div>
      </div>
    </>
  );
}

export function ProjectForm({
  mode,
  projectId,
  defaultValues,
  heroImage,
  gallery,
}: ProjectFormProps) {
  const t = useTranslations("Admin.projectForm");
  const [isPending, startTransition] = useTransition();

  if (mode === "create") {
    return (
      <form
        action={createProjectFormAction}
        className="space-y-8"
      >
        <ProjectFields defaultValues={defaultValues} />
        <ProjectImageFields mode="create" defaultValues={defaultValues} />
        <Button type="submit">{t("create")}</Button>
      </form>
    );
  }

  const handleUpdate = (formData: FormData) => {
    if (!projectId) return;

    startTransition(async () => {
      try {
        await updateProjectFormAction(projectId, formData);
        toast.success(t("updated"));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t("error"));
      }
    });
  };

  return (
    <form
      action={handleUpdate}
      className="space-y-8"
    >
      <ProjectFields defaultValues={defaultValues} />
      <ProjectImageFields
        mode="edit"
        heroImage={heroImage}
        gallery={gallery}
        defaultValues={defaultValues}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
