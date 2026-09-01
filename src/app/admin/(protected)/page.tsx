import Link from "next/link";
import { Plus } from "lucide-react";

import { getAdminProjects, getAdminStats } from "@/sanity/lib/admin-fetch";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminT } from "@/lib/admin-locale";

export default async function AdminDashboardPage() {
  const [{ t }, stats, projects] = await Promise.all([
    getAdminT(),
    getAdminStats(),
    getAdminProjects(),
  ]);

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("dashboard.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("dashboard.title")}
          </h1>
        </div>
        <Link href="/admin/projects/new" className={buttonVariants()}>
          <Plus className="size-4" />
          {t("nav.addProject")}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("dashboard.projects")}</CardDescription>
            <CardTitle className="text-3xl">{stats.projects}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.projectsCard")}</CardTitle>
          <CardDescription>{t("dashboard.projectsCardDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("dashboard.noProjects")}</p>
          ) : (
            recentProjects.map((project) => (
              <Link
                key={project._id}
                href={`/admin/projects/${project._id}`}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">{project.location}</p>
                </div>
                <span className="text-sm text-muted-foreground">{project.slug}</span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
