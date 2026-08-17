import Link from "next/link";

import { ProjectForm } from "@/components/admin/ProjectForm";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminT } from "@/lib/admin-locale";

export default async function AdminNewProjectPage() {
  const { t } = await getAdminT();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("projectsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("projectForm.newTitle")}
          </h1>
        </div>
        <Link href="/admin/projects" className={buttonVariants({ variant: "outline" })}>
          {t("actions.back")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("projectForm.details")}</CardTitle>
          <CardDescription>{t("projectForm.newDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
