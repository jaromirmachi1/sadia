import Link from "next/link";
import { Plus } from "lucide-react";

import {
  getAdminProjects,
  getAdminStats,
  getAdminUnits,
} from "@/sanity/lib/admin-fetch";
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
  const [{ t }, stats, units, projects] = await Promise.all([
    getAdminT(),
    getAdminStats(),
    getAdminUnits(),
    getAdminProjects(),
  ]);

  const recentUnits = units.slice(0, 5);

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
        <Link href="/admin/units/new" className={buttonVariants()}>
          <Plus className="size-4" />
          {t("nav.addUnit")}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: t("dashboard.projects"), value: stats.projects },
          { label: t("dashboard.units"), value: stats.units },
          { label: t("dashboard.available"), value: stats.available },
          { label: t("dashboard.forSale"), value: stats.forSale },
          { label: t("dashboard.forRent"), value: stats.forRent },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-3xl">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentUnits")}</CardTitle>
            <CardDescription>{t("dashboard.recentUnitsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUnits.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.noUnits")}</p>
            ) : (
              recentUnits.map((unit) => (
                <Link
                  key={unit._id}
                  href={`/admin/units/${unit._id}`}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{unit.identifier}</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.projectName} · {unit.layout}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t(`unitStatus.${unit.status}`)}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.projectsCard")}</CardTitle>
            <CardDescription>{t("dashboard.projectsCardDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("dashboard.noProjects")}</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t("dashboard.unitsCount", { count: project.unitCount })}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
