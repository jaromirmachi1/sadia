import Link from "next/link";

import { NewsForm } from "@/components/admin/NewsForm";
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

export default async function AdminNewNewsPage() {
  const [{ t }, projects] = await Promise.all([getAdminT(), getAdminProjects()]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("newsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("newsForm.newTitle")}
          </h1>
        </div>
        <Link href="/admin/news" className={buttonVariants({ variant: "outline" })}>
          {t("actions.back")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("newsForm.details")}</CardTitle>
          <CardDescription>{t("newsForm.newDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <NewsForm mode="create" projects={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
