import Link from "next/link";

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
import { getAdminProjects } from "@/sanity/lib/admin-fetch";

export default async function AdminNewUnitPage() {
  const [{ t }, projects] = await Promise.all([getAdminT(), getAdminProjects()]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("unitsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("unitForm.newTitle")}
          </h1>
        </div>
        <Link href="/admin/units" className={buttonVariants({ variant: "outline" })}>
          {t("actions.back")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("unitForm.details")}</CardTitle>
          <CardDescription>
            {projects.length === 0
              ? t("unitForm.needProject")
              : t("unitForm.newDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>{t("unitForm.needProjectBody")}</p>
              <Link href="/admin/projects/new" className={buttonVariants()}>
                {t("unitForm.createProject")}
              </Link>
            </div>
          ) : (
            <UnitForm mode="create" projects={projects} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
