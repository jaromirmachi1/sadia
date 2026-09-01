import Link from "next/link";
import { Plus } from "lucide-react";

import { ProjectStatusBadge } from "@/components/admin/ProjectBadges";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
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
import { getAdminProjects } from "@/sanity/lib/admin-fetch";

export default async function AdminProjectsPage() {
  const [{ t }, projects] = await Promise.all([getAdminT(), getAdminProjects()]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("projectsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("projectsPage.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("projectsPage.description")}
          </p>
        </div>
        <Link href="/admin/projects/new" className={buttonVariants()}>
          <Plus className="size-4" />
          {t("nav.addProject")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("projectsPage.columns.project")}</TableHead>
              <TableHead>{t("projectsPage.columns.location")}</TableHead>
              <TableHead>{t("projectsPage.columns.status")}</TableHead>
              <TableHead>{t("projectsPage.columns.slug")}</TableHead>
              <TableHead className="text-right">{t("projectsPage.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {t("projectsPage.empty")}
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{project.location}</TableCell>
                  <TableCell>
                    <ProjectStatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {project.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project._id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        {t("actions.edit")}
                      </Link>
                      <DeleteProjectButton
                        projectId={project._id}
                        label={project.name}
                      />
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
