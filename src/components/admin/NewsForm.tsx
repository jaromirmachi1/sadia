"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  createNewsFormAction,
  updateNewsFormAction,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  toDatetimeLocalValue,
  type AdminProject,
  type AdminProjectImage,
  type NewsFormValues,
} from "@/lib/admin-types";
import { cn } from "@/lib/utils";

type NewsFormProps = {
  mode: "create" | "edit";
  articleId?: string;
  projects: AdminProject[];
  defaultValues?: Partial<NewsFormValues>;
  heroImage?: AdminProjectImage | null;
};

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

const textareaClassName = cn(fieldClassName, "min-h-28 py-3");

function NewsFields({
  projects,
  defaultValues,
  heroImage,
  mode,
}: {
  projects: AdminProject[];
  defaultValues?: Partial<NewsFormValues>;
  heroImage?: AdminProjectImage | null;
  mode: "create" | "edit";
}) {
  const t = useTranslations("Admin.newsForm");

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="titleCs">{t("titleCs")}</Label>
          <Input
            id="titleCs"
            name="titleCs"
            defaultValue={defaultValues?.titleCs ?? ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="titleEn">{t("titleEn")}</Label>
          <Input
            id="titleEn"
            name="titleEn"
            defaultValue={defaultValues?.titleEn ?? ""}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slug">{t("slug")}</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={defaultValues?.slug ?? ""}
            placeholder="novinka-slug"
          />
          <p className="text-xs text-muted-foreground">{t("slugHint")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerptCs">{t("excerptCs")}</Label>
          <Textarea
            id="excerptCs"
            name="excerptCs"
            defaultValue={defaultValues?.excerptCs ?? ""}
            className={textareaClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerptEn">{t("excerptEn")}</Label>
          <Textarea
            id="excerptEn"
            name="excerptEn"
            defaultValue={defaultValues?.excerptEn ?? ""}
            className={textareaClassName}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bodyCs">{t("bodyCs")}</Label>
          <Textarea
            id="bodyCs"
            name="bodyCs"
            defaultValue={defaultValues?.bodyCs ?? ""}
            className={cn(textareaClassName, "min-h-40")}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bodyEn">{t("bodyEn")}</Label>
          <Textarea
            id="bodyEn"
            name="bodyEn"
            defaultValue={defaultValues?.bodyEn ?? ""}
            className={cn(textareaClassName, "min-h-40")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="publishedAt">{t("publishedAt")}</Label>
          <Input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={
              defaultValues?.publishedAt
                ? toDatetimeLocalValue(defaultValues.publishedAt)
                : toDatetimeLocalValue(new Date().toISOString())
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relatedProjectId">{t("relatedProject")}</Label>
          <select
            id="relatedProjectId"
            name="relatedProjectId"
            defaultValue={defaultValues?.relatedProjectId ?? ""}
            className={fieldClassName}
          >
            <option value="">{t("noRelatedProject")}</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-8 border-t border-border pt-8">
        <div>
          <h3 className="font-medium">{t("images")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("imagesHint")}</p>
        </div>

        {mode === "edit" && heroImage?.url ? (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {t("currentHero")}
            </p>
            <div className="relative aspect-[16/10] max-w-md overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={heroImage.url}
                alt={heroImage.altCs || heroImage.altEn || t("heroImage")}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="heroImage">
              {mode === "edit" && heroImage ? t("heroReplace") : t("heroImage")}
            </Label>
            <Input
              id="heroImage"
              name="heroImage"
              type="file"
              accept="image/*"
              required={mode === "create"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroAltCs">{t("heroAltCs")}</Label>
            <Input
              id="heroAltCs"
              name="heroAltCs"
              defaultValue={defaultValues?.heroAltCs ?? heroImage?.altCs ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroAltEn">{t("heroAltEn")}</Label>
            <Input
              id="heroAltEn"
              name="heroAltEn"
              defaultValue={defaultValues?.heroAltEn ?? heroImage?.altEn ?? ""}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function NewsForm({
  mode,
  articleId,
  projects,
  defaultValues,
  heroImage,
}: NewsFormProps) {
  const t = useTranslations("Admin.newsForm");
  const [isPending, startTransition] = useTransition();

  if (mode === "create") {
    return (
      <form
        action={createNewsFormAction}
        encType="multipart/form-data"
        className="space-y-8"
      >
        <NewsFields
          mode="create"
          projects={projects}
          defaultValues={defaultValues}
          heroImage={heroImage}
        />
        <Button type="submit">{t("create")}</Button>
      </form>
    );
  }

  return (
    <form
      encType="multipart/form-data"
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          try {
            await updateNewsFormAction(articleId!, formData);
            toast.success(t("updated"));
          } catch (error) {
            toast.error(error instanceof Error ? error.message : t("error"));
          }
        });
      }}
    >
      <NewsFields
        mode="edit"
        projects={projects}
        defaultValues={defaultValues}
        heroImage={heroImage}
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
